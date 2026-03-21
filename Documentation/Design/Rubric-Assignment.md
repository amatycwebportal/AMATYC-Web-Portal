#Rubric Assignment — Design IdeationWorkflow Options

## Option 1: By Rubric (Recommended)
```mermaid
graph LR
    A[Select Rubric] -->|Choose| B[Select Users]
    B --> C[Assign]
```
Scales are automatically applied based on course bin.

## Option 2: By User
```mermaid
graph LR
    A[Select User] -->|Choose| B[Select Rubrics]
    B --> C[Assign]
```
Scales are automatically applied based on course bin.

--- 

## Recommendation
**Option 1 (By Rubric)** is the more natural funnel because:

There is typically 1 rubric → N assignees, whereas Option 2 implies 1 user → M rubrics
Since N >> M, starting with the rubric reduces selection overhead and better matches the real-world assignment pattern
