# Rubric Versioning Design Document

## Overview

This document addresses the challenge of editing rubrics while users are in various states of completion (not started, in progress, completed). The core tension is between the need to iterate on rubric content and the need to preserve data integrity and user experience across those edits.

---

## Problem Statement

The current schema has a flat `Rubric` → `Scale` structure with no version tracking. When a rubric or its scales are edited:

- **Not-started users** should see the latest version
- **In-progress users** may have responses tied to old `Scale` IDs that no longer match the edited content
- **Completed users** have responses that must remain interpretable against the rubric they actually filled out

Since `Response` records point directly to `scaleId`, any edit that modifies or removes a scale breaks the semantic link between a stored score and the question that produced it.

---

## Key Considerations

### 1. What counts as a "breaking" edit?

Not all edits are equal. It helps to classify changes:

| Change Type | Example | Breaking? |
|---|---|---|
| Cosmetic / typo fix | "Evaluate you're teaching" → "Evaluate your teaching" | No |
| Prompt rewording | Minor clarification of intent | Ambiguous |
| Prompt semantic change | Changing what a scale actually measures | Yes |
| Adding a scale | New question added to rubric | Yes (for in-progress users) |
| Removing a scale | Deleting a question | Yes |
| Reordering scales | Changing `orderIndex` | No |
| Changing `levelDescriptions` | Changing what scores 1–5 mean | Yes |

The design must handle the "yes" cases gracefully.

### 2. User state complexity

The three implicit states (assigned, in-progress, completed) are tracked via many-to-many relations on `User`. This means the system knows which rubric a user is working on, but not *which version* of that rubric they began.

### 3. Responses are tied to `Scale`, not `Rubric`

`Response.scaleId` links to a specific scale item. If a scale's `prompt` or `levelDescriptions` is mutated in-place, historical responses lose their ground truth context.

### 4. Global vs. bin-scoped scales

`Scale.isGlobal` controls **visibility**, not sharing across rubrics. Within a single rubric:

- A **global scale** (`isGlobal = true`) is shown to every user assigned that rubric, regardless of their course bin
- A **bin-scoped scale** (`isGlobal = false`) is shown only to users whose `UserCourseBin` matches an entry in the scale's `ScaleBin` join table

This means two users on the same rubric version may see different sets of questions depending on their bin membership. Versioning must preserve both the scale content *and* its `isGlobal` / `ScaleBin` visibility rules, so that a user's question set at the time they began can always be reconstructed accurately.

A versioned scale snapshot therefore needs to carry forward:
- `isGlobal`
- The associated `predefinedBinId` values from `ScaleBin` (for bin-scoped scales)

### 5. `ScaleBin` coupling

Scales are linked to `PredefinedCourseBin` via `ScaleBin`. A versioning strategy must not orphan these visibility relationships when new scale versions are created. Each `ScaleVersion` snapshot needs its own corresponding `ScaleVersionBin` entries so the bin-scoping rules are frozen alongside the content.

---

## Options

---

### Option A: Immutable Scales with Version Snapshots ("Copy-on-Write")

**Concept:** When an edit is made to a rubric or its scales, the system creates a new `RubricVersion` record and clones the affected scales into new rows. The original records remain intact. Users are pinned to the version they started on; new users get the latest version.

**Schema additions:**

```prisma
model RubricVersion {
  id          String   @id @default(uuid()) @db.Uuid
  rubricId    String   @db.Uuid
  versionNum  Int
  publishedAt DateTime @default(now())
  isLatest    Boolean  @default(true)
  rubric      Rubric   @relation(fields: [rubricId], references: [id])
  scales      Scale[]

  @@unique([rubricId, versionNum])
}

// Scale gains a versionId field
// Response gains a rubricVersionId field
```

**User assignment change:**

```prisma
// UserRubricAssignment replaces the many-to-many relations
model UserRubricAssignment {
  id               String        @id @default(uuid()) @db.Uuid
  userId           String        @db.Uuid
  rubricVersionId  String        @db.Uuid
  status           AssignmentStatus
  assignedAt       DateTime      @default(now())
  startedAt        DateTime?
  completedAt      DateTime?
}

enum AssignmentStatus {
  ASSIGNED
  IN_PROGRESS
  COMPLETED
}
```

**Behavior:**
- Editing a rubric bumps the version and clones scales
- In-progress and completed users remain pinned to their `rubricVersionId`
- Not-started users can be silently migrated to the new version (their assignment is re-pointed before they begin)
- `Response.scaleId` always points to the cloned scale from the version the user was on

**Pros:**
- Full audit trail; every response is interpretable forever
- Completed responses are never disturbed
- Clean separation between versions

**Cons:**
- Scale data is duplicated in the database
- Bin-scoped scales require cloning their `ScaleBin` visibility rules into new rows alongside the scale content, or the wrong users will see the wrong questions after a version bump
- More complex queries to show "latest rubric" vs "user's version"
- Requires migrating the existing many-to-many assignment pattern

---

### Option B: Append-Only Scale Edits with a `parentScaleId` Lineage

**Concept:** Scales are never edited in place. Instead, editing a scale creates a new `Scale` row with a `parentScaleId` pointing to the old one. The rubric's "active" scales are determined by following the chain to the leaf nodes. Responses remain anchored to the scale they were answered against.

**Schema additions:**

```prisma
// Scale gains:
parentScaleId  String?   @db.Uuid
supersededAt   DateTime?
parent         Scale?    @relation("ScaleLineage", fields: [parentScaleId], references: [id])
children       Scale[]   @relation("ScaleLineage")
```

**Behavior:**
- Editing a scale creates a new row; the old row gets `supersededAt = now()`
- The rubric's current scales are those with `supersededAt = null`
- In-progress users continue responding to their original `scaleId`; the UI resolves the current prompt via the lineage chain
- Completed users' responses remain valid as-is

**Pros:**
- No data duplication at the rubric level
- Natural lineage graph for auditing what changed and when
- Less invasive to the existing schema

**Cons:**
- Querying "current scales for rubric" requires filtering `supersededAt IS NULL`
- If many scales change, the rubric doesn't have a clean "version N" snapshot
- Harder to answer "what did version 2 of this rubric look like in full?"
- In-progress users see a mix of old and new scales if only some were edited

---

### Option C: Rubric Locking with Edit Windows

**Concept:** A rubric can only be edited before it is assigned, or during a designated "draft" state. Once any user begins, the rubric is locked. Admins who want to change it must create a new rubric (a copy) and re-assign users.

**Schema additions:**

```prisma
// Rubric gains:
status  RubricStatus  @default(DRAFT)

enum RubricStatus {
  DRAFT       // Editable, not yet assigned
  ACTIVE      // Locked, in use
  ARCHIVED    // Retired
}
```

**Behavior:**
- Only `DRAFT` rubrics can be edited
- Assigning the first user transitions the rubric to `ACTIVE`
- To make changes, an admin clones the rubric (new UUID, `DRAFT` status), edits it, then decides how to handle existing users
- Not-started users can be reassigned to the new rubric
- In-progress and completed users remain on the original

**Pros:**
- Conceptually simple; no versioning machinery
- Existing schema barely changes
- Easy to understand for admins

**Cons:**
- Does not handle minor/cosmetic fixes gracefully (a typo fix requires a full clone)
- Rubric proliferation over time; catalog gets noisy
- No explicit link between a rubric and its "successor" unless you add one
- Doesn't solve the problem of someone wanting to push an important correction to in-progress users

---

### Option D: Hybrid — Versioned Rubric with Migration Policy

**Concept:** Combines elements of Options A and C. The rubric carries an explicit version number. Edits bump the version. An admin is presented with a **migration policy** at the time of the edit:

- **Migrate not-started users** to the new version (automatic, safe)
- **Notify in-progress users** and let them finish on the old version, or offer them a restart
- **Leave completed users** pinned to the version they completed

**Schema additions:**

```prisma
model RubricVersion {
  id          String   @id @default(uuid()) @db.Uuid
  rubricId    String   @db.Uuid
  versionNum  Int
  changelog   String?
  publishedAt DateTime @default(now())
  rubric      Rubric   @relation(fields: [rubricId], references: [id])
  scales      ScaleVersion[]
  assignments UserRubricAssignment[]

  @@unique([rubricId, versionNum])
}

model ScaleVersion {
  id                String             @id @default(uuid()) @db.Uuid
  rubricVersionId   String             @db.Uuid
  originalScaleId   String             @db.Uuid  // links back to the Scale this was snapshotted from
  prompt            String
  orderIndex        Int
  isGlobal          Boolean            // snapshot of visibility rule at time of version
  levelDescriptions Json?
  section           String?
  rubricVersion     RubricVersion      @relation(fields: [rubricVersionId], references: [id])
  scaleVersionBins  ScaleVersionBin[]  // snapshot of bin-scoping rules
  responses         Response[]
}

// Frozen bin-visibility rules per scale snapshot
model ScaleVersionBin {
  scaleVersionId  String       @db.Uuid
  predefinedBinId String       @db.Uuid
  scaleVersion    ScaleVersion @relation(fields: [scaleVersionId], references: [id])

  @@id([scaleVersionId, predefinedBinId])
}

model UserRubricAssignment {
  id              String           @id @default(uuid()) @db.Uuid
  userId          String           @db.Uuid
  rubricVersionId String           @db.Uuid
  status          AssignmentStatus
  assignedAt      DateTime         @default(now())
  startedAt       DateTime?
  completedAt     DateTime?
  user            User             @relation(fields: [userId], references: [id])
  rubricVersion   RubricVersion    @relation(fields: [rubricVersionId], references: [id])

  @@unique([userId, rubricVersionId])
}

enum AssignmentStatus {
  ASSIGNED
  IN_PROGRESS
  COMPLETED
}
```

**Migration policy logic (application layer):**

```
On rubric publish (new version):
  1. Clone all Scale rows → ScaleVersion rows under new RubricVersion
  2. For each UserRubricAssignment on the previous version:
     - ASSIGNED   → re-assign to new version automatically
     - IN_PROGRESS → flag as "version mismatch"; admin decides (keep / migrate / notify)
     - COMPLETED   → leave untouched on old version
```

**Pros:**
- Full version history with optional changelog
- Graduated handling of each user state
- Responses are always interpretable
- Admin has explicit control over migration decisions
- `isGlobal` and `ScaleVersionBin` snapshots freeze each user's visible question set at the version they were assigned — bin-scoping rules can change in a new version without retroactively altering what completed or in-progress users saw

**Cons:**
- Most complex upfront implementation
- Requires a migration UI/workflow for admins
- Schema migration from existing flat structure is non-trivial

---

## Comparison Summary

| Criteria | A: Copy-on-Write | B: Append-Only | C: Locking | D: Hybrid |
|---|---|---|---|---|
| Response integrity | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Cosmetic edits | ✅ Easy | ✅ Easy | ❌ Requires clone | ✅ Easy |
| Admin control | ⚠️ Auto | ⚠️ Auto | ✅ Explicit | ✅ Explicit |
| Schema complexity | Medium | Low | Very Low | High |
| Query complexity | Medium | High | Low | Medium |
| Audit/history | ✅ Yes | ✅ Partial | ❌ No | ✅ Yes |
| Bin-scoped scale integrity | ⚠️ Must clone ScaleBin rows | ✅ Natural | ✅ Natural | ✅ Via ScaleVersionBin snapshot |
| Migration path from current schema | Medium | Easy | Easy | Medium |

---

## Recommendation: Option D (Hybrid Versioned Rubric)

Option D is recommended. Rationale:

**Response integrity is non-negotiable.** Since `Response` records are the core data product of this application, any approach that allows a `scaleId`'s semantics to silently change most be avoided. Options A and D both satisfy this; D is preferred because it gives admins explicit control rather than silently pinning users.

**Admin visibility matters.** When a rubric is edited mid-cycle, the admin should be aware that some users are in-progress and make a conscious decision. A silent auto-migration (Option A) risks invalidating partially-completed work without anyone noticing. Option D surfaces this as an explicit workflow step.

**Cosmetic edits should not require a full clone.** Option C's simplicity is appealing, but forcing a full rubric clone for a typo fix is operationally painful and pollutes the rubric catalog over time.

**Bin-scoped visibility rules must be versioned alongside content.** Since bin-scoped scales are only shown to users whose `UserCourseBin` matches the scale's `ScaleBin` entries, changing those bin associations mid-cycle would silently alter which questions different users see. `ScaleVersionBin` freezes the visibility rules at the point a version is published, so the question set a user was presented is always exactly reconstructable — both the prompts and who was supposed to see them.

### Migration from current schema

1. Create `RubricVersion` with `versionNum = 1` for each existing `Rubric`
2. Clone each `Scale` into a `ScaleVersion` row linked to that version; set `originalScaleId` to the existing `Scale.id`, copy `isGlobal`, and clone each `ScaleBin` row into a corresponding `ScaleVersionBin` row
3. Replace the three User↔Rubric many-to-many tables with `UserRubricAssignment` rows; infer initial `status` from which relation they appeared in (`assigned` → ASSIGNED, `inProgress` → IN_PROGRESS, `completed` → COMPLETED)
4. Re-point `Response.scaleId` to the corresponding `ScaleVersion.id` (matched via `originalScaleId`)
5. Drop the old many-to-many join tables after verifying the migration

### One thing to decide before implementation

**How strict should the version boundary be for in-progress users?** Two reasonable sub-options:

- **Strict:** In-progress users must finish on their pinned version. Admin can see who is stuck on an old version and send reminders, but cannot force a mid-stream migration.
- **Permissive:** Admin can migrate an in-progress user to the new version; their existing responses are carried forward to the matching `ScaleVersion` in the new version (matched by `originalScaleId`), any new scales they qualify for (based on `ScaleVersionBin` and their `UserCourseBin`) are presented as unanswered, and any removed scales are considered skipped.

The permissive approach is more powerful but requires careful response remapping logic. Starting strict and adding permissive migration later is a safe sequencing.
