import { Fragment, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
import { RubricScale } from '@shared/types';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import CircularProgress from '@mui/material/CircularProgress';

const RUBRIC_VERSION = 0; // TODO: Implement versioning

function getLevelRows(scale: RubricScale) {
  console.log(scale);
  if (!scale.levelDescriptions) return [];
  return Object.entries(scale.levelDescriptions)
    .map(([score, value]) => ({
      score: Number(score),
      label: value.label,
      description: value.description,
    }))
    .sort((a, b) => a.score - b.score);
}

export default function ViewAllRubrics() {
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  console.log(rubrics);
  // All hooks must come first
  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null);
  const [expandedScaleId, setExpandedScaleId] = useState<string | null>(null);
  const [editingRubricId, setEditingRubricId] = useState<string | null>(null);

  const editingRubric = useMemo(
    () => rubrics?.find((r) => r.id === editingRubricId) ?? null,
    [rubrics, editingRubricId]
  );

  // Early returns are fine down here, after all hooks
  if (isLoadingRubrics)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricsError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading rubrics
      </Box>
    );
  if (!rubrics || rubrics.length === 0)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        No rubrics found
      </Box>
    );

  const toggleRubricExpansion = (rubricId: string) => {
    setExpandedRubricId((currentRubricId) => {
      const nextRubricId = currentRubricId === rubricId ? null : rubricId;
      // When switching rubrics, collapse any open scale details.
      setExpandedScaleId(null);
      return nextRubricId;
    });
  };

  const toggleScaleExpansion = (scaleId: string) => {
    setExpandedScaleId((currentScaleId) => (currentScaleId === scaleId ? null : scaleId));
  };

  return (
    <AdminAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Rubrics
        </Typography>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table aria-label="All rubrics table" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Rubric</TableCell>
                <TableCell width={140}>Version</TableCell>
                <TableCell width={160} align="right">
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rubrics.map((rubric) => {
                const isExpanded = rubric.id === expandedRubricId;

                return (
                  <Fragment key={rubric.id}>
                    <TableRow
                      hover
                      selected={isExpanded}
                      onClick={() => toggleRubricExpansion(rubric.id)}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            aria-label={isExpanded ? 'Collapse rubric' : 'Expand rubric'}
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleRubricExpansion(rubric.id);
                            }}
                          >
                            {isExpanded ? (
                              <ExpandLess fontSize="small" />
                            ) : (
                              <ExpandMore fontSize="small" />
                            )}
                          </IconButton>

                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 700, lineHeight: 1.2 }}
                            >
                              {rubric.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {rubric.active ? 'Active' : 'Inactive'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip size="small" variant="outlined" label={`Version ${RUBRIC_VERSION}`} />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(event) => {
                            event.stopPropagation();
                            setEditingRubricId(rubric.id);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={3} sx={{ p: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                              {rubric.description}
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Table size="small" aria-label={`Rubric scales for ${rubric.title}`}>
                              <TableHead>
                                <TableRow>
                                  <TableCell width={80}>Order</TableCell>
                                  <TableCell>Section</TableCell>
                                  <TableCell>Prompt</TableCell>
                                  <TableCell width={120}>Editable</TableCell>
                                  <TableCell width={110}>Global</TableCell>
                                  <TableCell width={160} align="right">
                                    Levels
                                  </TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {rubric.scales.map((scale) => {
                                  const isScaleExpanded = expandedScaleId === scale.id;
                                  const levelRows = getLevelRows(scale);
                                  const levelsCount = levelRows.length;

                                  return (
                                    <Fragment key={scale.id}>
                                      <TableRow hover>
                                        <TableCell>{scale.orderIndex}</TableCell>
                                        <TableCell
                                          sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                                        >
                                          {scale.section}
                                        </TableCell>
                                        <TableCell
                                          sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                                        >
                                          {scale.prompt}
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            size="small"
                                            variant="outlined"
                                            color={scale.editable ? 'success' : 'default'}
                                            label={scale.editable ? 'Editable' : 'Locked'}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            size="small"
                                            variant="outlined"
                                            color={scale.isGlobal ? 'success' : 'default'}
                                            label={scale.isGlobal ? 'Global' : 'Local'}
                                          />
                                        </TableCell>
                                        <TableCell align="right">
                                          <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => toggleScaleExpansion(scale.id)}
                                            endIcon={
                                              isScaleExpanded ? (
                                                <ExpandLess fontSize="small" />
                                              ) : (
                                                <ExpandMore fontSize="small" />
                                              )
                                            }
                                          >
                                            {levelsCount} level{levelsCount === 1 ? '' : 's'}
                                          </Button>
                                        </TableCell>
                                      </TableRow>

                                      <TableRow>
                                        <TableCell colSpan={6} sx={{ p: 0 }}>
                                          <Collapse
                                            in={isScaleExpanded}
                                            timeout="auto"
                                            unmountOnExit
                                          >
                                            <Box sx={{ p: 2 }}>
                                              <Table size="small">
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell width={80}>Score</TableCell>
                                                    <TableCell width={160}>Level</TableCell>
                                                    <TableCell>Description</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {levelRows.map((level) => (
                                                    <TableRow key={level.score}>
                                                      <TableCell>{level.score}</TableCell>
                                                      <TableCell>{level.label}</TableCell>
                                                      <TableCell
                                                        sx={{
                                                          whiteSpace: 'normal',
                                                          wordBreak: 'break-word',
                                                        }}
                                                      >
                                                        {level.description}
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            </Box>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    </Fragment>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={Boolean(editingRubric)}
          onClose={() => setEditingRubricId(null)}
          aria-labelledby="edit-rubric-title"
        >
          <DialogTitle id="edit-rubric-title">Edit rubric</DialogTitle>
          <DialogContent>
            {editingRubric ? (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  <strong>{editingRubric.title}</strong>
                  <Box component="span" sx={{ ml: 1 }}>
                    (Version {RUBRIC_VERSION})
                  </Box>
                </DialogContentText>
                <Typography variant="body2" color="text.secondary">
                  Editing UI is not implemented yet. This button is wired for when the rubric editor
                  route is added.
                </Typography>
              </>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setEditingRubricId(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminAuthGuard>
  );
}
