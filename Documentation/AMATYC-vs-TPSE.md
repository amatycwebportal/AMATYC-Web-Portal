# AMATYC vs TPSE

This portal is a fork of the TPSE Web Portal. Branch `1-one-shot` (commit `9663fc6`, parent `e92a468`) is the cut that turns TPSE behavior into AMATYC behavior. Later agents should extend the AMATYC model in this document. Do not restore course bins, the `FACULTY` role, or TPSE naming because an older design note or a leftover string still mentions them.

The code and the migrations below are the source of truth. `Documentation/Design/Design-Document.md` and `Documentation/Design/Rubric-Assignment.md` were only partly relabeled and still describe course bins.

## What stayed the same

The product is still a multi-institution rubric portal: Google sign-in, institutions, published rubric versions, per-user assignments, draft and submitted responses, college-lead consensus, aggregate charts, CSV export, and a privacy-consent gate.

These stored values did not change, even where the screen label did:

| Stored value | Still means |
| --- | --- |
| `PROJECT_LEAD` | Portal-wide administrator |
| `LOCAL_LEADER` | One institution's lead |
| `USER` | Person who completes rubrics |
| `ASSIGNED`, `IN_PROGRESS`, `COMPLETED` | Assignment status |
| `DRAFT`, `SUBMITTED` | Response and consensus status |

URL and folder names still say `project-lead` and `local-leader` (`/admin/project-lead`, `/admin/local-leader`, `frontend/src/features/admin/pages/project_lead`, `frontend/src/features/admin/pages/local_leader`). Change the label in the UI. Leave the stored role and those paths alone unless a task explicitly renames them.

The superuser delete tools are still an email allowlist, not a role. Thresholds are unchanged: 25 responses for a user delete, 5 users or 50 responses for an institution delete.

## Names people see

Use `formatUserRole` in `shared/types.ts` for anything a person reads.

| Stored role | TPSE label | AMATYC label |
| --- | --- | --- |
| `PROJECT_LEAD` | Project lead | Administrator |
| `LOCAL_LEADER` | Local leader | College lead |
| `FACULTY` | Faculty | Removed. Existing rows become `USER`. |
| `USER` | User | User |

`FACULTY` is gone from the `UserRole` enum (`20261012233000_remove_faculty_role`). Do not add it back, and do not offer it on the invite form. Invite choices are `PROJECT_LEAD`, `LOCAL_LEADER`, and `USER`.

There is a second, separate identity: the AMATYC admin allowlist.

| | TPSE | AMATYC |
| --- | --- | --- |
| Module | `shared/tpseAdmin.ts` | `shared/amatycAdmin.ts` |
| Email | `tpse.web.portal@gmail.com` | `amatyc.web.portal@gmail.com` |
| Guard | `requireTpseAdmin` | `requireAmatycAdmin` |
| API | `/api/tpse-admin` | `/api/amatyc-admin` |
| Pages | `/admin/tpse-admin` | `/admin/amatyc-admin` |

Only that allowlisted account sees the delete-users and delete-institutions tools. A `PROJECT_LEAD` is an Administrator in the product. An AMATYC admin is the allowlisted operator. They are not the same check.

## Pathways replace course bins

This is the domain change. TPSE scoped work by course. AMATYC scopes work by pathway.

### TPSE

Institutions owned course bins. A project lead maintained a global catalog of predefined bins, and each institution mapped its own bins onto that catalog. Users were members of bins (`UserCourseBin`). Invitations could attach bins. Individual scales could be limited to bins (`ScaleBin`, `ScaleVersionBin`), so the questions on a rubric depended on the bin.

A missing bin meant "general." Assignments, responses, and consensus stored a nullable `courseBinId`. Null was the general context, which is why uniqueness used partial indexes.

Predefined bins were Quantitative Reasoning, College Algebra, Precalculus, Calculus 1, Calculus 2, and Intro Statistics. There was also a `Course` table of individual courses inside a bin.

### AMATYC

Pathways are a fixed global catalog in `shared/pathways.ts`. Institutions do not create, rename, or own them. There is no course-bin editor and no predefined-bin editor.

| Pathway | Id |
| --- | --- |
| General | `30000000-0000-0000-0000-000000000001` |
| Statistics | `30000000-0000-0000-0000-000000000002` |
| Quantitative Reasoning | `30000000-0000-0000-0000-000000000003` |
| STEM | `30000000-0000-0000-0000-000000000004` |
| Teacher Preparation | `30000000-0000-0000-0000-000000000005` |

General is a real pathway row. It is not null. `pathwayId` is required on `UserRubricAssignment`, `Response`, and `ConsensusResponse`. Uniqueness is `(userId, rubricVersionId, pathwayId)` for assignments and consensus, and `(userId, scaleVersionId, rubricVersionId, pathwayId)` for responses.

`RubricPathway` says which pathways a rubric may be used on. The seed links every rubric to every pathway. Scales are not filtered by pathway. Every criterion on the rubric is present in every pathway context.

A college lead assigns a person, a rubric, and one or more pathways. The default selection is General only. "Assign all rubrics on accept" creates assignments on the General pathway only. Invitations no longer carry a list of bins.

The legacy token `__general__` (`PATHWAY_GENERAL_KEY`) and a URL query param named `predefinedBinId` still resolve to the General pathway (`frontend/src/utils/pathwayScope.ts`, `resolvePathwayId`). Accept them when reading old links. Write `pathwayId` on new links.

### How old bins were mapped

Migration `20261013000000_replace_course_bins_with_pathways` rewrote existing rows, then dropped the bin tables. When several bins collapsed onto one pathway, it kept the further-along row (completed or submitted, then the newest).

| TPSE predefined bin | AMATYC pathway |
| --- | --- |
| Intro Statistics | Statistics |
| Quantitative Reasoning | Quantitative Reasoning |
| College Algebra, Precalculus, Calculus 1, Calculus 2 | STEM |
| Null, unknown, or a general assignment | General |
| (no TPSE equivalent) | Teacher Preparation |

Dropped models: `PredefinedCourseBin`, `CourseBin`, `Course`, `UserCourseBin`, `ScaleBin`, `ScaleVersionBin`, and the invitation-to-bin join. Dropped routes: `/api/course-bins`, `/api/predefined-course-bins`. Dropped pages: college-lead course bins, project-lead predefined bins, and the users-by-course-bin chart. The replacement chart is users by pathway.

`backend/prisma/seeds/seed-predefined-bins.ts` still has that filename. It now upserts `PATHWAYS`. Do not put course bins back in it.

## Anonymity

TPSE showed real names and emails to local leaders. AMATYC does not.

`User.name` and `User.email` stay the Google identity. `User.aliasName` is a mathematician name from `shared/mathematicianAliases.ts`, unique within an institution. It is assigned on first sign-in, and again at invite acceptance if it is still missing (`backend/src/lib/assignAliasName.ts`). Collisions become `"Euler 2"`, then a `Mathematician <id prefix>` fallback.

| Surface | College lead (`LOCAL_LEADER`) | Administrator (`PROJECT_LEAD`) |
| --- | --- | --- |
| Own profile | Real name and email | Real name and email |
| User lists and invite lists | Alias, email blank | Real name and email |
| Assignment management | Alias | Real name and email |
| Response CSV | `respondent_name` is the alias, `respondent_email` is blank | Real name and email |
| Charts and consensus heatmaps | No respondent names | No respondent names |

College leads can send a completion reminder. The server mails the real address and returns `{ sent: true }` (Administrators may also see the alias). The college-lead response must not include the address or the real name.

Details and the CSV rule live in `Documentation/Privacy/Anonymity-Rules.md`. Aggregate queries must not join response rows to real names for a college-lead viewer.

## Rubrics and submissions

Seeded content changed from seven Project EMBER rubrics to eight Teaching for PROWESS rubrics:

1. Student Learning and the Learning Environment
2. Instruction
3. Curriculum and Program Development
4. Assessment of Student Learning
5. Diversity, Equity, and Inclusion
6. Professionalism
7. Climate for Transformation
8. Snapshot (`seed-rubric8.ts`, new)

Drafts may omit a justification. Submitting a rubric requires a non-empty justification on every live criterion. The API error is `Justification is required for each criterion`.

## Help content

AMATYC adds placeholder training clips. Catalog: `shared/placeholderVideos.ts`. Player: `frontend/src/features/help/PlaceholderVideoCard.tsx`. Notes: `Documentation/Help/Placeholder-Videos.md`.

| Clip | Where |
| --- | --- |
| Administrator training | Administrator dashboard |
| Controlling what people see | College lead dashboard |
| First-time walkthrough | College lead dashboard |
| Site tour and color coding | Info button for standard users, help icon on the college-lead consensus overview |
| Guide to using the rubrics | First tab in the main navigation, at `/guide`. Reminder email still links here. Invitation email does not. |

Replace the mp4 at the same path when a real recording exists. Do not change the player to do that.

## Product and deploy identity

| | TPSE | AMATYC |
| --- | --- | --- |
| Repo / README title | TPSE-Web-Portal | AMATYC-Web-Portal |
| Browser title | TPSE Assessment Portal | AMATYC Assessment Portal |
| Logo | `TPSE-logo.png` | `AMATYC-logo.png` |
| Mail from-name | TPSE Web Portal | AMATYC Web Portal |
| Color export | `TPSE_COLORS` | `AMATYC_COLORS` |
| ECR image | `tpsewebportal/backend`, `tpsewebportal/frontend` | `amatycwebportal/backend`, `amatycwebportal/frontend` |
| Privacy contact | `admin@tpsemath.org` | `amatyc.web.portal@gmail.com` |

`AMATYC_COLORS` is a rename of the same palette, including the `ember_green` key. Reminder mail is new (`sendReminderEmail`) and still links to `/guide`. Invitation mail does not.

`docker-compose.yaml` no longer hardcodes the TPSE AWS account id. The image owner is the `<AWS_ACCOUNT_ID>` placeholder.

## API names that moved

| TPSE | AMATYC |
| --- | --- |
| `/api/course-bins` | Removed |
| `/api/predefined-course-bins` | Removed |
| `/api/pathways` | `GET /` returns the catalog |
| `/api/tpse-admin` | `/api/amatyc-admin` |
| `courseBinId` on assignments, responses, consensus | `pathwayId` |
| `GET /api/users/by-institution/:id` | Route is `GET /api/users/institution/:id` |
| User patch body `courseBinIds` | Removed |
| User list included `userCourseBins` | Removed. College leads receive a redacted user |

The client hook `useFetchUsersByInstitution` and its test still call `/users/by-institution/:id`. That path is the old one. The route file is `/institution/:id`. Do not treat the client URL as proof that the TPSE path is still supported.

CSV context columns are `pathway_id` and `pathway_name`, plus `respondent_alias_name`.

## Do not bring back

- Course bins, predefined bins, user-to-bin membership, courses nested under bins, or scale-to-bin scoping.
- Nullable general context. General is `GENERAL_PATHWAY_ID`.
- The `FACULTY` role.
- Real names or emails in college-lead user lists, assignment lists, or college-lead CSV exports.
- TPSE admin module names, `tpse.web.portal@gmail.com`, or `/api/tpse-admin`.
- Project EMBER rubric copy as if it were the current seed.

## Leftover TPSE wording

These strings survived the cut. They are stale. They are not the model.

- `Documentation/Design/Design-Document.md` still says institutions have course bins, and that college leads assign users to course bins and manage course mappings.
- `Documentation/Design/Rubric-Assignment.md` still says scales follow the course bin.
- `frontend/src/features/auth/content/privacyNoticeContent.ts` introduces AMATYC in the purpose paragraph, then still calls the platform "EMBER" in later sections. The `platform` field is still `EMBER Self-Assessment Platform`.
- Analytics filter copy, the response-export description, and the AMATYC-admin institution card still say "course bin."
- `ViewAllRubricsTemplateView.tsx` still contains the heading "Project EMBER Introductory Mathematics Self-Assessment."
- The Prisma comment on `ConsensusResponse` still says "local leader."

When a task touches one of those surfaces, use Administrator, College lead, User, and pathway. Do not reintroduce a bin to match the old sentence.
