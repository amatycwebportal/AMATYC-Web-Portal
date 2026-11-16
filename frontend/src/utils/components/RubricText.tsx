import { Link, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import type { MouseEvent } from 'react';
import { parseRubricText, type RubricTextSegment } from '@shared/rubricText';

interface RubricTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
}

// Links sit inside clickable score cells; opening one must not also select the score.
const stopClickPropagation = (event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation();

function renderSegment(segment: RubricTextSegment, index: number) {
  if (segment.kind === 'text') {
    return segment.text;
  }
  return (
    <Link
      key={index}
      href={segment.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={stopClickPropagation}
    >
      {segment.text}
    </Link>
  );
}

/** Displays rubric wording with its line breaks and links. */
export function RubricText({ text, sx, ...typographyProps }: RubricTextProps) {
  return (
    <Typography
      {...typographyProps}
      sx={[
        { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {parseRubricText(text).map(renderSegment)}
    </Typography>
  );
}

export default RubricText;
