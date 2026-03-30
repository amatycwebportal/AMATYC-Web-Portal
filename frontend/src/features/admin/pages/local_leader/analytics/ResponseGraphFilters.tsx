import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Rubric } from '@shared/types';
import {
  RESPONSE_FILTER_ALL_SCALES,
  RESPONSE_FILTER_ALL_SECTIONS,
  type ResponseGraphFilterValue,
} from './responseGraphFilterTypes';
import {
  collectSectionKeys,
  filterScalesBySection,
  formatSectionMenuLabel,
} from './responseGraphFilterSummary';

type ResponseGraphFiltersProps = {
  rubrics: Rubric[];
  isLoadingRubrics: boolean;
  hasRubricsError: boolean;
  value: ResponseGraphFilterValue;
  onChange: (next: ResponseGraphFilterValue) => void;
};

function truncateScaleLabel(prompt: string, maxLength: number): string {
  const singleLine = prompt.replace(/\s+/g, ' ').trim();
  if (singleLine.length <= maxLength) {
    return singleLine;
  }
  return `${singleLine.slice(0, maxLength - 1)}…`;
}

export default function ResponseGraphFilters({
  rubrics,
  isLoadingRubrics,
  hasRubricsError,
  value,
  onChange,
}: ResponseGraphFiltersProps) {
  const selectedRubric = rubrics.find((r) => r.id === value.rubricId);
  const sectionKeys = selectedRubric ? collectSectionKeys(selectedRubric.scales) : [];
  const scalesInScope = selectedRubric
    ? filterScalesBySection(selectedRubric.scales, value.sectionKey)
    : [];

  const handleRubricChange = (rubricId: string) => {
    onChange({
      rubricId,
      sectionKey: RESPONSE_FILTER_ALL_SECTIONS,
      scaleId: RESPONSE_FILTER_ALL_SCALES,
    });
  };

  const handleSectionChange = (sectionKey: string) => {
    onChange({
      ...value,
      sectionKey,
      scaleId: RESPONSE_FILTER_ALL_SCALES,
    });
  };

  const handleScaleChange = (scaleId: string) => {
    onChange({
      ...value,
      scaleId,
    });
  };

  if (isLoadingRubrics) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
        <CircularProgress size={22} />
        <Typography variant="body2" color="text.secondary">
          Loading rubrics…
        </Typography>
      </Stack>
    );
  }

  if (hasRubricsError) {
    return (
      <Typography variant="body2" color="error">
        Could not load rubrics. Response filters are unavailable.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
        Response chart scope
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }}>
        <FormControl size="small" sx={{ minWidth: 220, flex: { md: '1 1 0' } }}>
          <InputLabel id="response-filter-rubric-label">Rubric</InputLabel>
          <Select
            labelId="response-filter-rubric-label"
            label="Rubric"
            value={value.rubricId}
            onChange={(event) => handleRubricChange(event.target.value)}
          >
            <MenuItem value="">
              <em>Select a rubric…</em>
            </MenuItem>
            {[...rubrics]
              .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
              .map((rubric) => (
                <MenuItem key={rubric.id} value={rubric.id}>
                  {rubric.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: 200, flex: { md: '1 1 0' } }}
          disabled={!value.rubricId}
        >
          <InputLabel id="response-filter-section-label">Section</InputLabel>
          <Select
            labelId="response-filter-section-label"
            label="Section"
            value={value.sectionKey}
            onChange={(event) => handleSectionChange(event.target.value)}
          >
            <MenuItem value={RESPONSE_FILTER_ALL_SECTIONS}>All sections</MenuItem>
            {sectionKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {formatSectionMenuLabel(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ minWidth: 240, flex: { md: '1 1 0' } }}
          disabled={!value.rubricId || scalesInScope.length === 0}
        >
          <InputLabel id="response-filter-scale-label">Scale</InputLabel>
          <Select
            labelId="response-filter-scale-label"
            label="Scale"
            value={value.scaleId}
            onChange={(event) => handleScaleChange(event.target.value)}
          >
            <MenuItem value={RESPONSE_FILTER_ALL_SCALES}>All scales (in section scope)</MenuItem>
            {scalesInScope.map((scale) => (
              <MenuItem key={scale.id} value={scale.id}>
                {truncateScaleLabel(scale.prompt, 72)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
