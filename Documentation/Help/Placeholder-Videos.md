# Placeholder videos

These clips are stand-ins. Each file is a short title card. Replace the file at the same path when the finished recording is ready. The player, page, and email link do not need to change.

Regenerate the title cards with `python3 frontend/scripts/generatePlaceholderVideos.py`.

| Video | File | Audience | Where it appears | What the finished recording should cover |
| --- | --- | --- | --- | --- |
| Administrator training | `frontend/public/videos/administrator-training.mp4` | Administrator | Administrator dashboard, Training section | Inviting other administrators, institutions, and publishing rubrics |
| Controlling what people see | `frontend/public/videos/college-lead-access.mp4` | College lead | College lead dashboard, Training section | Choosing pathways and assigning rubrics so each person sees the right work |
| First-time walkthrough | `frontend/public/videos/first-time-walkthrough.mp4` | College lead, with a new user | College lead dashboard, Training section | The session a college lead runs with someone signing in for the first time. This is not a screen recorder |
| Site tour and color coding | `frontend/public/videos/site-tour-color-coding.mp4` | Standard user and college lead | Info button in the main navigation for standard users, and the help icon on the college lead consensus overview | Basic site navigation and what colors mean on institution response summaries |
| Guide to using the rubrics | `frontend/public/videos/rubric-guide.mp4` | Signed-in users | First tab in the main navigation, at `/guide` | Opening an assigned rubric, saving a draft, and submitting |

Catalog constants live in `shared/placeholderVideos.ts`. The shared player is `frontend/src/features/help/PlaceholderVideoCard.tsx`.
