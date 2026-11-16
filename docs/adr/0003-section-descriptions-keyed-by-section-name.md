# Section descriptions are a versioned map keyed by section name

A Section is only a label on each scale, not its own record, so Section descriptions are stored as a map from section name to description on the rubric. The map is copied onto each rubric version when it's saved, so people working on an older version keep seeing that version's descriptions. We rejected a real `Section` table because it would mean migrating every scale's label into a relation. We rejected an unversioned description because edits would change older versions people are still working on.

## Consequences

- Renaming a Section must also move its key in the map.
- On save, the map is pruned to Sections that still have live scales and non-blank descriptions.
