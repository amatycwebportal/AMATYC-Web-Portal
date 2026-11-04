import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import type {
  InstitutionResponseContextOption,
  ResponseGraphFilterValue,
} from './responseGraphFilterTypes';

type InstitutionResponseContextCheckboxesProps = {
  value: ResponseGraphFilterValue;
  onChange: (next: ResponseGraphFilterValue) => void;
  institutionResponseContextOptions: InstitutionResponseContextOption[];
  isLoadingInstitutionContexts: boolean;
  hasInstitutionContextsError: boolean;
  /** Shown when loading finished and there are no completion contexts. */
  emptyMessage: string;
  title?: string;
  description?: string;
};

export default function InstitutionResponseContextCheckboxes({
  value,
  onChange,
  institutionResponseContextOptions,
  isLoadingInstitutionContexts,
  hasInstitutionContextsError,
  emptyMessage,
  title = 'Institution response contexts',
  description = 'Limit charts and exports to specific course bins (and/or general). When all are checked, all listed contexts are included.',
}: InstitutionResponseContextCheckboxesProps) {
  const institutionContextKeys = useMemo(
    () => institutionResponseContextOptions.map((row) => row.key),
    [institutionResponseContextOptions]
  );

  const handleInstitutionContextToggle = (contextKey: string) => {
    if (institutionContextKeys.length === 0) {
      return;
    }
    const allKeysSorted = [...institutionContextKeys].sort().join('|');
    let nextKeys: string[] | null;
    if (value.responseContextKeys === null) {
      const without = institutionContextKeys.filter((key) => key !== contextKey);
      nextKeys = without.length === 0 ? [] : without;
    } else {
      const hasKey = value.responseContextKeys.includes(contextKey);
      const toggled = hasKey
        ? value.responseContextKeys.filter((key) => key !== contextKey)
        : [...value.responseContextKeys, contextKey];
      if (toggled.length === 0) {
        nextKeys = [];
      } else {
        const toggledSorted = [...toggled].sort().join('|');
        nextKeys = toggledSorted === allKeysSorted ? null : toggled;
      }
    }
    onChange({
      ...value,
      responseContextKeys: nextKeys,
    });
  };

  const isInstitutionContextChecked = (contextKey: string): boolean => {
    if (value.responseContextKeys === null) {
      return true;
    }
    return value.responseContextKeys.includes(contextKey);
  };

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        {description}
      </Typography>
      {isLoadingInstitutionContexts ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            Loading contexts…
          </Typography>
        </Stack>
      ) : hasInstitutionContextsError ? (
        <Typography variant="body2" color="error">
          Could not load completion contexts.
        </Typography>
      ) : institutionResponseContextOptions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : (
        <FormGroup sx={{ pl: 0.5 }}>
          {institutionResponseContextOptions.map((row) => (
            <FormControlLabel
              key={row.key}
              control={
                <Checkbox
                  size="small"
                  checked={isInstitutionContextChecked(row.key)}
                  onChange={() => handleInstitutionContextToggle(row.key)}
                />
              }
              label={row.label}
            />
          ))}
        </FormGroup>
      )}
    </Stack>
  );
}
