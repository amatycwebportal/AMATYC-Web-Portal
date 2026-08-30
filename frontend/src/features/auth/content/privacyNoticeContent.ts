export interface PrivacyNoticeSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  important_note?: string;
  closing_text?: string;
  contact?: {
    email: string;
  };
}

export interface PrivacyNoticePopup {
  title: string;
  type: string;
  platform: string;
  intro: {
    heading: string;
    text: string;
  };
  consent_notice: {
    text: string;
  };
  sections: PrivacyNoticeSection[];
  participant_consent: {
    heading: string;
    instruction: string;
    acknowledgements: string[];
  };
  actions: {
    agree: {
      label: string;
      required_for_consent: boolean;
    };
  };
}

export const PRIVACY_NOTICE_POPUP: PrivacyNoticePopup = {
  title: 'Privacy Notice and Consent',
  type: 'privacy_consent',
  platform: 'EMBER Self-Assessment Platform',

  intro: {
    heading: 'Purpose',
    text: 'The EMBER Self-Assessment Platform is provided by TPSE Math to support participating institutions in evaluating departmental practices, identifying opportunities for improvement, and developing institutional action plans as part of the EMBER project.',
  },

  consent_notice: {
    text: 'By accessing and using this platform, you acknowledge that you have read and understand this Privacy Notice and consent to the collection and use of information as described below.',
  },

  sections: [
    {
      heading: 'Information We Collect',
      paragraphs: [
        'The EMBER Self-Assessment Platform collects information that users voluntarily provide while participating in the self-assessment process, including:',
      ],
      bullets: [
        'User account information necessary to access the platform (e.g., name, institutional affiliation, and email address).',
        'Responses to self-assessment questions regarding departmental structures, policies, and practices.',
        'Administrative information necessary to support project participation.',
        'Limited system information, such as login activity and timestamps.',
      ],
      important_note:
        'The platform is not intended to collect student-level educational records or personally identifiable student information.',
    },

    {
      heading: 'Purpose of Data Collection',
      paragraphs: ['Information collected through the platform will be used to:'],
      bullets: [
        'Facilitate departmental self-assessment and institutional reflection.',
        'Support participating departments in identifying strengths, challenges, and opportunities for improvement.',
        'Inform the development and implementation of institutional action plans.',
        'Support coaching conversations and technical assistance provided through the EMBER project.',
        'Monitor project participation and progress.',
        'Evaluate and improve the EMBER model, self-assessment process, and related project resources.',
        'Produce aggregate summaries or reports describing overall project findings and trends.',
      ],
      important_note:
        'Individual responses will not be used for employee performance evaluations, personnel decisions, or purposes unrelated to the EMBER project.',
    },

    {
      heading: 'Who Will Have Access to Responses',
      paragraphs: [
        'Access to information submitted through the EMBER Self-Assessment Platform is limited to individuals with a legitimate project-related need and may include:',
      ],
      bullets: [
        'The submitting participant, as permitted by the platform.',
        "The institution's designated project lead(s).",
        'Assigned EMBER consultants and coaches supporting the institution.',
        'Authorized TPSE Math project staff responsible for project administration, technical support, and evaluation.',
        'Authorized project partners, when necessary for project administration, reporting, or evaluation.',
      ],
      closing_text:
        'Access is limited to individuals authorized to support implementation of the EMBER project.',
    },

    {
      heading: 'Confidentiality',
      paragraphs: [
        'TPSE Math will make reasonable efforts to maintain the confidentiality of participant responses.',
        'Whenever practical, information shared outside the immediate project team will be presented in summary or aggregate form rather than identifying individual participants.',
      ],
      important_note:
        'Because departmental implementation teams are typically small, complete anonymity cannot be guaranteed. Participants should understand that institutional project leads, assigned EMBER consultants, and authorized project staff may have access to identifiable responses when necessary to support coaching, project implementation, and institutional planning.',
    },

    {
      heading: 'Data Stewardship and Security',
      paragraphs: [
        'TPSE Math serves as the administrator and steward of the EMBER Self-Assessment Platform and is responsible for maintaining information collected through the system.',
        'Reasonable administrative and technical safeguards are used to protect information from unauthorized access, disclosure, alteration, or destruction.',
        'Information will be retained only as long as necessary to support project administration, evaluation, reporting obligations, and applicable record-retention requirements.',
      ],
    },

    {
      heading: 'Voluntary Participation',
      paragraphs: [
        'Participation in the EMBER Self-Assessment is voluntary.',
        'By submitting information through the platform, participants consent to the collection, storage, and use of their information for the purposes described in this Privacy Notice.',
      ],
    },

    {
      heading: 'Questions',
      paragraphs: [
        'Questions regarding this Privacy Notice or the EMBER Self-Assessment Platform may be directed to the TPSE Math project team via admin@tpsemath.org.',
      ],
      contact: {
        email: 'admin@tpsemath.org',
      },
    },
  ],

  participant_consent: {
    heading: 'Participant Consent',
    instruction:
      'By selecting "I Agree" or by accessing and using the EMBER Self-Assessment Platform, you acknowledge that:',
    acknowledgements: [
      'You have read and understand this Privacy Notice.',
      'You understand who may access your responses.',
      'You understand how your information will be used.',
      'You understand that complete anonymity cannot be guaranteed because institutional implementation teams are small.',
      'You voluntarily consent to the collection, storage, and use of your information for the purposes described above.',
    ],
  },

  actions: {
    agree: {
      label: 'I Agree',
      required_for_consent: true,
    },
  },
};

export const PRIVACY_NOTICE_TITLE = PRIVACY_NOTICE_POPUP.title;
