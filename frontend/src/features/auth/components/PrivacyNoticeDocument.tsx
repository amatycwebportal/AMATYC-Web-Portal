import { Box, Link, Typography } from '@mui/material';
import { PRIVACY_NOTICE_POPUP, type PrivacyNoticeSection } from '../content/privacyNoticeContent';

function renderParagraphs(paragraphs: string[] | undefined, email?: string) {
  if (!paragraphs) {
    return null;
  }

  return paragraphs.map((paragraph) => {
    if (email && paragraph.includes(email)) {
      const [before, after] = paragraph.split(email);
      return (
        <Typography key={paragraph} variant="body1" sx={{ mb: 1.5 }}>
          {before}
          <Link href={`mailto:${email}`}>{email}</Link>
          {after}
        </Typography>
      );
    }

    return (
      <Typography key={paragraph} variant="body1" sx={{ mb: 1.5 }}>
        {paragraph}
      </Typography>
    );
  });
}

function renderBullets(bullets: string[] | undefined) {
  if (!bullets) {
    return null;
  }

  return (
    <Box component="ul" sx={{ mt: 0, mb: 1.5, pl: 3 }}>
      {bullets.map((bullet) => (
        <Typography key={bullet} component="li" variant="body1" sx={{ mb: 0.75 }}>
          {bullet}
        </Typography>
      ))}
    </Box>
  );
}

function renderSection(section: PrivacyNoticeSection) {
  return (
    <Box key={section.heading} sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {section.heading}
      </Typography>
      {renderParagraphs(section.paragraphs, section.contact?.email)}
      {renderBullets(section.bullets)}
      {section.important_note ? (
        <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600 }}>
          {section.important_note}
        </Typography>
      ) : null}
      {section.closing_text ? (
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          {section.closing_text}
        </Typography>
      ) : null}
    </Box>
  );
}

export default function PrivacyNoticeDocument() {
  const notice = PRIVACY_NOTICE_POPUP;

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
        {notice.platform}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {notice.intro.heading}
        </Typography>
        <Typography variant="body1">{notice.intro.text}</Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 3, fontWeight: 600 }}>
        {notice.consent_notice.text}
      </Typography>

      {notice.sections.map((section) => renderSection(section))}

      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {notice.participant_consent.heading}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          {notice.participant_consent.instruction}
        </Typography>
        {renderBullets(notice.participant_consent.acknowledgements)}
      </Box>
    </Box>
  );
}
