import { TextField, Typography, Box } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Theme, TypographyStyle } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { useEffect, useMemo, useRef, useState } from 'react';

function getTypographyStyleForVariant(
  theme: Theme,
  variant: TypographyProps['variant'] | undefined
): TypographyStyle {
  const key = variant ?? 'body1';
  const entry = (theme.typography as unknown as Record<string, unknown>)[String(key)];
  if (entry && typeof entry === 'object' && entry !== null && 'fontSize' in entry) {
    return entry as TypographyStyle;
  }
  return theme.typography.body1;
}

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  isEditable?: boolean;
  multiline?: boolean;
  size?: 'small' | 'medium';
  /** Applied to read-only `Typography` and matched on the `TextField` input when editing. */
  typographyProps?: Omit<TypographyProps, 'children'>;
  /**
   * Debounce committing changes to the parent to avoid re-rendering the whole rubric tree
   * on every keystroke.
   */
  debounceMs?: number;
  /** When true, commit the latest value immediately on blur. */
  commitOnBlur?: boolean;
}

export function EditableText({
  value,
  onChange,
  isEditable = false,
  multiline = false,
  size = 'small',
  typographyProps = {},
  debounceMs = 150,
  commitOnBlur = true,
}: EditableTextProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const [localValue, setLocalValue] = useState(value);
  const localValueRef = useRef(value);
  const commitTimerRef = useRef<number | null>(null);

  const inputTypographySx = useMemo(() => {
    const typographySx = typographyProps.sx;
    return {
      ...getTypographyStyleForVariant(theme, typographyProps.variant),
      padding: 0,
      margin: 0,
      ...(typographyProps.color != null ? { color: typographyProps.color } : {}),
      ...(typeof typographySx === 'object' && typographySx !== null && !Array.isArray(typographySx)
        ? typographySx
        : {}),
    } as SystemStyleObject<Theme>;
  }, [theme, typographyProps.color, typographyProps.sx, typographyProps.variant]);

  useEffect(() => {
    // If the parent provides a new value (e.g. refetch after save), keep the input in sync
    // when the user isn't actively typing.
    if (!focused) {
      setLocalValue(value);
      localValueRef.current = value;
    }
  }, [value, focused]);

  const commitChange = (nextValue: string) => {
    if (commitTimerRef.current != null) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
    localValueRef.current = nextValue;
    onChange(nextValue);
  };

  return (
    <Box>
      {isEditable ? (
        <TextField
          fullWidth
          variant="standard"
          value={localValue}
          multiline={multiline}
          size={size}
          onChange={(e) => {
            const nextValue = e.target.value;
            localValueRef.current = nextValue;
            setLocalValue(nextValue);

            if (debounceMs <= 0) {
              onChange(nextValue);
              return;
            }

            if (commitTimerRef.current != null) window.clearTimeout(commitTimerRef.current);
            commitTimerRef.current = window.setTimeout(() => {
              commitTimerRef.current = null;
              onChange(localValueRef.current);
            }, debounceMs);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (commitOnBlur) commitChange(localValueRef.current);
          }}
          InputProps={{
            readOnly: !isEditable,
          }}
          sx={{
            '& .MuiInput-underline:before': {
              borderBottom: 'none', // hide underline when not focused
            },
            '& .MuiInput-underline:after': {
              borderBottom: focused ? `2px solid` : 'none',
              borderColor: 'primary.main',
            },
            '& .MuiInputBase-input': inputTypographySx,
          }}
        />
      ) : (
        <Typography {...typographyProps}>{value}</Typography>
      )}
    </Box>
  );
}

export default EditableText;
