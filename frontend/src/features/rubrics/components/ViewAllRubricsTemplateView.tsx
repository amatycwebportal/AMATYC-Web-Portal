import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { AdminAuthGuard } from '../../admin/Middleware/auth';
import { Rubric, RubricScale } from '@shared/types';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { TPSE_COLORS } from '@theme/themePrimitives';

const LEVEL_LABELS = [
  '(0) Baseline',
  '(1) Beginning',
  '(2) Developing',
  '(3) Accomplished',
  '(4) Exemplar',
] as const;

function getLevelRows(scale: RubricScale) {
  if (!scale.levelDescriptions) return [];
  return Object.entries(scale.levelDescriptions)
    .map(([score, value]) => ({
      score: Number(score),
      label: value.label,
      description: value.description,
    }))
    .sort((a, b) => a.score - b.score);
}

// Groups scales by their section field
function groupBySection(scales: RubricScale[]): { section: string; scales: RubricScale[] }[] {
  const map = new Map<string, RubricScale[]>();
  for (const scale of scales) {
    const key = scale.section ?? 'General';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(scale);
  }
  return Array.from(map.entries()).map(([section, scales]) => ({ section, scales }));
}

// ── Scale row: criterion title + description + 5-column scoring table ────────
function ScaleCard({ scale }: { scale: RubricScale }) {
  const levelRows = getLevelRows(scale);

  return (
    <Box sx={{ mb: 3 }}>
      {/* Criterion header */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderBottom: 'none',
          p: 1.5,
          // bgcolor: 'grey.50',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {scale.prompt}
        </Typography>
      </Box>

      {/* Scoring table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider' }}
      >
        <Table size="small" aria-label={`Scoring levels for criterion`}>
          <TableHead>
            <TableRow>
              {LEVEL_LABELS.map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    // bgcolor: 'grey.100',
                    borderRight: '1px solid',
                    borderRightColor: 'divider',
                    width: '20%',
                    verticalAlign: 'top',
                    '&:last-child': { borderRight: 'none' },
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              {levelRows.length > 0
                ? levelRows.map((level) => (
                    <TableCell
                      key={level.score}
                      sx={{
                        fontSize: '0.75rem',
                        verticalAlign: 'top',
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: 1.5,
                        '&:last-child': { borderRight: 'none' },
                      }}
                    >
                      {level.description}
                    </TableCell>
                  ))
                : // No level descriptions yet — show empty cells
                  LEVEL_LABELS.map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        fontSize: '0.75rem',
                        color: 'text.disabled',
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                        '&:last-child': { borderRight: 'none' },
                      }}
                    >
                      —
                    </TableCell>
                  ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Justification row */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          p: 1,
          // bgcolor: 'grey.50',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <strong>Justification for {scale.prompt.split('.')[0]} Rating:</strong>
        </Typography>
      </Box>
    </Box>
  );
}

// ── Section block: header + its scales ───────────────────────────────────────
function SectionBlock({ section, scales }: { section: string; scales: RubricScale[] }) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Section header — matches the bold section banners in the template */}
      <Box
        sx={{
          bgcolor: TPSE_COLORS.primary.ember_green,
          color: 'common.white',
          px: 2,
          py: 1,
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
          {section.toUpperCase()}
        </Typography>
      </Box>

      {scales.map((scale) => (
        <ScaleCard key={scale.id} scale={scale} />
      ))}
    </Box>
  );
}

// ── Rubric accordion row ──────────────────────────────────────────────────────
function RubricRow({
  rubric,
  isExpanded,
  onToggle,
}: {
  rubric: Rubric[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const sections = groupBySection(rubric.scales ?? ([] as RubricScale[]));

  return (
    <Box
      sx={{
        mb: 2,
        border: '1px solid',
        borderColor: isExpanded ? 'primary.main' : 'divider',
        borderRadius: 1,
      }}
    >
      {/* Rubric title bar */}
      <Paper
        elevation={0}
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          border: '1px solid',
          borderColor: isExpanded ? 'divider' : TPSE_COLORS.primary.blue,
          borderRadius: 1,
          cursor: 'pointer',
          bgcolor: isExpanded ? 'primary.50' : 'background.paper',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={isExpanded ? 'Collapse rubric' : 'Expand rubric'}
          >
            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {rubric.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {rubric.description}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
          <Chip size="small" variant="outlined" label={`${rubric.scales?.length ?? 0} criteria`} />
          <Chip
            size="small"
            variant="filled"
            color={rubric.active ? 'success' : 'default'}
            label={rubric.active ? 'Active' : 'Inactive'}
          />
        </Stack>
      </Paper>

      {/* Rubric expanded content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            p: 3,
          }}
        >
          {sections.map(({ section, scales }) => (
            <SectionBlock key={section} section={section} scales={scales} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ViewAllRubrics() {
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();

  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null);

  if (isLoadingRubrics) return <div>Loading...</div>;
  if (hasRubricsError) return <div>Error loading rubrics</div>;
  if (!rubrics || rubrics.length === 0) return <div>No rubrics found</div>;

  const toggleRubric = (id: string) =>
    setExpandedRubricId((current) => (current === id ? null : id));

  return (
    <AdminAuthGuard>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Rubrics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Project EMBER Introductory Mathematics Self-Assessment
            </Typography>
          </Box>
          <Chip label={`${rubrics.length} rubrics`} variant="outlined" />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {rubrics.map((rubric) => (
          <RubricRow
            key={rubric.id}
            rubric={rubric}
            isExpanded={expandedRubricId === rubric.id}
            onToggle={() => toggleRubric(rubric.id)}
          />
        ))}
      </Box>
    </AdminAuthGuard>
  );
}
