import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRubricColumnLabel } from '@shared/rubricNumber';
import type { AssignmentMatrixEntry } from '@shared/types';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { executeUnassignRubric } from '@utils/hooks/rubrics/executeUnassignRubric';
import { useFetchAssignmentMatrix } from '@utils/hooks/rubrics/useFetchAssignmentMatrix';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import {
  buildAssignmentCellKey,
  buildAssignmentContextLabel,
  buildCountMap,
  canUnassignAssignment,
  filterAssignmentsForCell,
  formatAssignmentStatusLabel,
} from './assignmentMatrixUtils';

type SelectedCell = {
  userId: string;
  userName: string;
  rubricId: string;
  rubricNumber: number | null;
  rubricTitle: string;
};

type PendingUnassign = AssignmentMatrixEntry & {
  userName: string;
  rubricNumber: number | null;
  rubricTitle: string;
};

const STICKY_COLUMN_SX = {
  position: 'sticky',
  left: 0,
  zIndex: 2,
  bgcolor: 'background.paper',
  borderRight: 1,
  borderColor: 'divider',
} as const;

const STICKY_HEADER_SX = {
  position: 'sticky',
  left: 0,
  zIndex: 3,
  bgcolor: 'background.paper',
  borderRight: 1,
  borderColor: 'divider',
} as const;

export default function ManageRubricAssignments() {
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const { matrix, isLoadingMatrix, hasMatrixError, refetchMatrix } = useFetchAssignmentMatrix();
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [pendingUnassign, setPendingUnassign] = useState<PendingUnassign | null>(null);
  const [isUnassigning, setIsUnassigning] = useState(false);

  const countMap = useMemo(() => buildCountMap(matrix?.assignments ?? []), [matrix?.assignments]);

  const selectedCellAssignments = useMemo(() => {
    if (!selectedCell || !matrix) {
      return [];
    }
    return filterAssignmentsForCell(selectedCell.userId, selectedCell.rubricId, matrix.assignments);
  }, [matrix, selectedCell]);

  const handleOpenCell = (cell: SelectedCell, count: number) => {
    if (count <= 0) {
      return;
    }
    setSelectedCell(cell);
  };

  const handleCloseCellDialog = () => {
    setSelectedCell(null);
  };

  const handleConfirmUnassign = async () => {
    if (!pendingUnassign) {
      return;
    }

    setIsUnassigning(true);
    const result = await executeUnassignRubric({
      rubricId: pendingUnassign.rubricId,
      userId: pendingUnassign.userId,
      courseBinId: pendingUnassign.courseBinId,
    });
    setIsUnassigning(false);

    if (!result.isSuccess) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: result.error,
      });
      return;
    }

    snackbarsRef.current?.enqueue({
      status: MessageStatus.SUCCESS,
      message: result.message,
    });
    setPendingUnassign(null);
    refetchMatrix();

    const remainingAssignments = selectedCellAssignments.filter(
      (assignment) =>
        !(
          assignment.courseBinId === pendingUnassign.courseBinId &&
          assignment.isGeneralAssignment === pendingUnassign.isGeneralAssignment
        )
    );
    if (remainingAssignments.length === 0) {
      setSelectedCell(null);
    }
  };

  if (isLoadingMatrix) {
    return (
      <LocalLeaderAuthGuard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </LocalLeaderAuthGuard>
    );
  }

  if (hasMatrixError || !matrix) {
    return (
      <LocalLeaderAuthGuard>
        <Box sx={{ maxWidth: 960, mx: 'auto', mt: 4, px: 2 }}>
          <Typography color="error">Failed to load rubric assignments.</Typography>
        </Box>
      </LocalLeaderAuthGuard>
    );
  }

  const rubricNumberLabel =
    selectedCell?.rubricNumber !== null && selectedCell?.rubricNumber !== undefined
      ? `Rubric ${selectedCell.rubricNumber}`
      : selectedCell?.rubricTitle;

  const pendingUnassignLabel =
    pendingUnassign?.rubricNumber !== null && pendingUnassign?.rubricNumber !== undefined
      ? `Rubric ${pendingUnassign.rubricNumber}`
      : pendingUnassign?.rubricTitle;

  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2, pb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/local-leader')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back to dashboard
        </Button>

        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            Manage rubric assignments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review assignment counts by user and rubric. Click a number to view contexts, status,
            and unassign assigned or in-progress work.
          </Typography>
        </Stack>

        {matrix.users.length === 0 ? (
          <Typography color="text.secondary">No users found for your institution.</Typography>
        ) : matrix.rubrics.length === 0 ? (
          <Typography color="text.secondary">No active rubrics found.</Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ overflow: 'auto' }}>
            <Table stickyHeader size="small" aria-label="Rubric assignment matrix">
              <TableHead>
                <TableRow>
                  <TableCell sx={STICKY_HEADER_SX}>User</TableCell>
                  {matrix.rubrics.map((rubric) => (
                    <TableCell key={rubric.id} align="center" sx={{ minWidth: 56 }}>
                      <Tooltip title={rubric.title} arrow>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {formatRubricColumnLabel(rubric.rubricNumber, rubric.title)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {matrix.users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={STICKY_COLUMN_SX}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {user.email}
                      </Typography>
                    </TableCell>
                    {matrix.rubrics.map((rubric) => {
                      const count = countMap.get(buildAssignmentCellKey(user.id, rubric.id)) ?? 0;
                      return (
                        <TableCell key={rubric.id} align="center">
                          {count > 0 ? (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() =>
                                handleOpenCell(
                                  {
                                    userId: user.id,
                                    userName: user.name,
                                    rubricId: rubric.id,
                                    rubricNumber: rubric.rubricNumber,
                                    rubricTitle: rubric.title,
                                  },
                                  count
                                )
                              }
                              sx={{ minWidth: 32, fontWeight: 600 }}
                            >
                              {count}
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              0
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={Boolean(selectedCell)}
          onClose={handleCloseCellDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {selectedCell ? `${selectedCell.userName} — ${rubricNumberLabel}` : ''}
          </DialogTitle>
          <DialogContent dividers>
            {selectedCellAssignments.length === 0 ? (
              <Typography color="text.secondary">No assignments in this cell.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {selectedCellAssignments.map((assignment) => {
                  const contextLabel = buildAssignmentContextLabel(assignment);
                  const assignmentKey = `${assignment.userId}:${assignment.rubricId}:${assignment.courseBinId ?? 'general'}`;
                  return (
                    <Box
                      key={assignmentKey}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        py: 0.5,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {contextLabel}
                        </Typography>
                        <Chip
                          size="small"
                          label={formatAssignmentStatusLabel(assignment.status)}
                          color={
                            assignment.status === 'COMPLETED'
                              ? 'success'
                              : assignment.status === 'IN_PROGRESS'
                                ? 'warning'
                                : 'default'
                          }
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      {canUnassignAssignment(assignment.status) && selectedCell ? (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() =>
                            setPendingUnassign({
                              ...assignment,
                              userName: selectedCell.userName,
                              rubricNumber: selectedCell.rubricNumber,
                              rubricTitle: selectedCell.rubricTitle,
                            })
                          }
                        >
                          Unassign
                        </Button>
                      ) : null}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCellDialog}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(pendingUnassign)} onClose={() => setPendingUnassign(null)}>
          <DialogTitle>Unassign rubric?</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Unassign {pendingUnassignLabel} (
              {pendingUnassign ? buildAssignmentContextLabel(pendingUnassign) : ''}) from{' '}
              {pendingUnassign?.userName}? Their draft work will remain in the system but they will
              no longer see this assignment.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPendingUnassign(null)} disabled={isUnassigning}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmUnassign}
              disabled={isUnassigning}
            >
              {isUnassigning ? 'Unassigning…' : 'Unassign'}
            </Button>
          </DialogActions>
        </Dialog>

        <ConsecutiveSnackbars ref={snackbarsRef} />
      </Box>
    </LocalLeaderAuthGuard>
  );
}
