export type PlaceholderVideo = {
  id: string;
  title: string;
  src: string;
  summary: string;
  audience: string;
  placement: string;
  replaces: string;
};

export const PLACEHOLDER_VIDEOS = {
  administratorTraining: {
    id: "administrator-training",
    title: "Administrator training",
    src: "/videos/administrator-training.mp4",
    summary:
      "How an administrator invites other administrators, manages institutions, and publishes rubrics.",
    audience: "Administrator",
    placement: "Administrator dashboard, Training section",
    replaces: "A recorded walkthrough of the administrator dashboard and user administration.",
  },
  collegeLeadAccess: {
    id: "college-lead-access",
    title: "Controlling what people see",
    src: "/videos/college-lead-access.mp4",
    summary:
      "How a college lead chooses pathways and rubric assignments so each person sees the right work.",
    audience: "College lead",
    placement: "College lead dashboard, Training section",
    replaces: "A recorded walkthrough of pathway selection and rubric assignment.",
  },
  firstTimeWalkthrough: {
    id: "first-time-walkthrough",
    title: "First-time walkthrough",
    src: "/videos/first-time-walkthrough.mp4",
    summary:
      "A stand-in for the session a college lead runs with a new user the first time they sign in.",
    audience: "College lead, with a first-time user",
    placement: "College lead dashboard, Training section",
    replaces: "A recording made while a college lead walks a new user through the site.",
  },
  siteTourColorCoding: {
    id: "site-tour-color-coding",
    title: "Site tour and color coding",
    src: "/videos/site-tour-color-coding.mp4",
    summary:
      "A basic tour of the site and what the colors mean on institution response summaries.",
    audience: "Standard user and college lead",
    placement:
      "Info button in the main navigation for standard users, and the help icon on the college lead consensus overview",
    replaces: "A short orientation that explains navigation and summary colors.",
  },
  rubricGuide: {
    id: "rubric-guide",
    title: "Guide to using the rubrics",
    src: "/videos/rubric-guide.mp4",
    summary: "How to open an assigned rubric, save a draft, and submit responses.",
    audience: "Anyone who receives an invitation",
    placement: "Public /guide page, linked from the invitation email",
    replaces: "A guide invited people can open before they start scoring.",
  },
} as const satisfies Record<string, PlaceholderVideo>;

export type PlaceholderVideoKey = keyof typeof PLACEHOLDER_VIDEOS;
