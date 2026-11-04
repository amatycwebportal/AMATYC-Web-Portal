import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchUsersByInstitution } from '@utils/hooks/users/useFetchUsersByInstitution';
import { GENERAL_PATHWAY_ID, PATHWAYS } from '@shared/pathways';
import {
  buildPerUserContextAssignments,
  buildUserContextByUserId,
  countUserContexts,
  DEFAULT_USER_CONTEXT_SELECTION,
  hasAtLeastOneContext,
  isPathwayLocked,
  type UserContextSelection,
} from './rubricAssignmentContexts';

const RUBRIC_SELECT_ALL_SENTINEL = '__select_all_rubrics__';

type UserContextsControlProps = {
  pathways: { id: string; name: string }[];
  selection: UserContextSelection;
  onChangeSelection: (next: UserContextSelection) => void;
};

function UserContextsControl({
  pathways,
  selection,
  onChangeSelection,
}: UserContextsControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const contextCount = countUserContexts(selection);

  const selectedContextLabels = useMemo(() => {
    return selection.pathwayIds.map(
      (pathwayId) => pathways.find((pathway) => pathway.id === pathwayId)?.name ?? 'Pathway'
    );
  }, [pathways, selection.pathwayIds]);

  const handleTogglePathway = (pathwayId: string, isChecked: boolean) => {
    const nextSelection = {
      pathwayIds: isChecked
        ? [...selection.pathwayIds, pathwayId]
        : selection.pathwayIds.filter((id) => id !== pathwayId),
    };
    if (!hasAtLeastOneContext(nextSelection)) {
      return;
    }
    onChangeSelection(nextSelection);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ textTransform: 'none', fontWeight: 400, whiteSpace: 'nowrap' }}
      >
        + Contexts ({contextCount})
      </Button>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, minWidth: 260, maxWidth: 360 } } }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
          Assignment contexts
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
          {selectedContextLabels.length > 0
            ? selectedContextLabels.join(', ')
            : 'No contexts selected'}
        </Typography>
        {pathways.map((pathway) => (
          <FormControlLabel
            key={pathway.id}
            control={
              <Checkbox
                size="small"
                checked={selection.pathwayIds.includes(pathway.id)}
                disabled={isPathwayLocked(selection, pathway.id)}
                onChange={(_event, isChecked) => handleTogglePathway(pathway.id, isChecked)}
              />
            }
            label={pathway.name}
            sx={{ display: 'flex', ml: 0 }}
          />
        ))}
      </Popover>
    </>
  );
}

export default function RubricAssignment() {
  const { user } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const { users, isLoadingUsers, hasUsersError } = useFetchUsersByInstitution(
    user?.institutionId ?? ''
  );
  const [filterModes, setFilterModes] = useState<Set<'all' | 'user'>>(new Set(['user']));
  const [selectedRubricIds, setSelectedRubricIds] = useState<string[]>([]);
  const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
  const [userContextByUserId, setUserContextByUserId] = useState<
    Record<string, UserContextSelection>
  >({});
  const [manuallyEditedUserIds, setManuallyEditedUserIds] = useState<Set<string>>(new Set());
  const [excludedUserIds, setExcludedUserIds] = useState<string[]>([]);
  const [nameSearch, setNameSearch] = useState('');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const assignablePathways = useMemo(() => {
    const selectedRubrics = (rubrics ?? []).filter((rubric) => selectedRubricIds.includes(rubric.id));
    if (selectedRubrics.length === 0) {
      return PATHWAYS.map((pathway) => ({ id: pathway.id, name: pathway.name }));
    }
    return PATHWAYS.filter((pathway) => {
      if (pathway.id === GENERAL_PATHWAY_ID) {
        return true;
      }
      return selectedRubrics.every((rubric) => (rubric.pathwayIds ?? []).includes(pathway.id));
    }).map((pathway) => ({ id: pathway.id, name: pathway.name }));
  }, [rubrics, selectedRubricIds]);

  const affectedUsers = useMemo(() => {
    let result: typeof users = [];
    if (filterModes.has('all')) {
      result = users ?? [];
    } else {
      result = users?.filter((u) => selectedUsersId.includes(u.id)) ?? [];
    }
    result = result.filter((u) => !excludedUserIds.includes(u.id));
    if (nameSearch.trim()) {
      result = result.filter((u) => u.name.toLowerCase().includes(nameSearch.toLowerCase()));
    }
    return result;
  }, [filterModes, users, selectedUsersId, excludedUserIds, nameSearch]);

  useEffect(() => {
    setUserContextByUserId((previous) =>
      buildUserContextByUserId({
        affectedUsers,
        previousContexts: previous,
        manuallyEditedUserIds,
      })
    );
  }, [affectedUsers, manuallyEditedUserIds]);

  if (!backendUrl) {
    console.error('VITE_BACKEND_URL is not configured.');
    return null;
  }

  const handleAssignRubric = async () => {
    try {
      const userIds = affectedUsers.map((u) => u.id);
      if (selectedRubricIds.length === 0 || userIds.length === 0) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'Please select at least one rubric and one user',
        });
        return;
      }

      const assignments = buildPerUserContextAssignments({
        users: affectedUsers,
        rubricIds: selectedRubricIds,
        userContextByUserId,
      });

      const allUsersHaveContext = assignments.every((row) => row.pathwayIds.length > 0);
      if (!allUsersHaveContext) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'Each user needs at least one assignment context',
        });
        return;
      }

      const response = await fetch(`${backendUrl}/rubrics/assign`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'perUserContexts',
          rubricIds: selectedRubricIds,
          ...(selectedRubricIds.length > 0 ? { rubricId: selectedRubricIds[0] } : {}),
          assignments,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: data.error,
        });
        return;
      }
      const data = await response.json();
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: data.message,
      });
    } catch (error) {
      console.error('Failed to assign rubric:', JSON.stringify(error, null, 2));
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to assign rubric',
      });
    }
  };

  if (isLoadingRubrics || isLoadingUsers)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricsError || hasUsersError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading
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
  if (!users || users.length === 0)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        No users found
      </Box>
    );

  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4, px: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.5 }}>
            Rubric Assignment
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Select rubrics and users, choose assignment contexts per user, then assign.
          </Typography>
        </Box>

        <Box
          sx={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            p: 3,
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: 1, fontSize: 11 }}
          >
            Step 1
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Choose rubrics
          </Typography>
          <Select
            displayEmpty
            fullWidth
            multiple
            value={selectedRubricIds}
            onChange={(e) => {
              const raw = e.target.value;
              const next = typeof raw === 'string' ? raw.split(',') : raw;
              if (next.includes(RUBRIC_SELECT_ALL_SENTINEL)) {
                const isAllSelected = selectedRubricIds.length === rubrics.length;
                setSelectedRubricIds(isAllSelected ? [] : rubrics.map((r) => r.id));
                return;
              }
              setSelectedRubricIds(next);
            }}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return 'Select rubrics…';
              }
              if (selected.length === rubrics.length) {
                return `All rubrics (${rubrics.length})`;
              }
              if (selected.length <= 2) {
                return selected
                  .map((id) => rubrics.find((r) => r.id === id)?.title ?? '')
                  .filter(Boolean)
                  .join(', ');
              }
              return `${selected.length} rubrics selected`;
            }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 360 } } }}
            sx={{ fontSize: 14 }}
          >
            <MenuItem value={RUBRIC_SELECT_ALL_SENTINEL} dense>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={rubrics.length > 0 && selectedRubricIds.length === rubrics.length}
                  indeterminate={
                    selectedRubricIds.length > 0 && selectedRubricIds.length < rubrics.length
                  }
                  size="small"
                />
              </ListItemIcon>
              <ListItemText primary="Select all" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
            {rubrics.map((rubric) => (
              <MenuItem key={rubric.id} value={rubric.id} dense>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={selectedRubricIds.includes(rubric.id)}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={rubric.title}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box
          sx={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            p: 3,
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'text.secondary', letterSpacing: 1, fontSize: 11 }}
          >
            Step 2
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Select users
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            {(['all', 'user'] as const).map((mode) => (
              <Button
                key={mode}
                size="small"
                onClick={() => {
                  setFilterModes((prev) => {
                    const next = new Set(prev);
                    if (next.has(mode)) {
                      next.delete(mode);
                    } else {
                      next.add(mode);
                      if (mode === 'all') {
                        next.delete('user');
                      } else next.delete('all');
                    }
                    return next.size === 0 ? prev : next;
                  });
                }}
                variant={filterModes.has(mode) ? 'contained' : 'outlined'}
                sx={{ textTransform: 'none', fontWeight: 400 }}
              >
                {mode === 'all' ? 'All users' : 'By name'}
              </Button>
            ))}
          </Box>

          {filterModes.has('user') && (
            <>
              <Autocomplete
                multiple
                disableClearable
                size="small"
                forcePopupIcon={false}
                options={users.map((u) => u.id)}
                getOptionLabel={(option) => users.find((u) => u.id === option)?.name ?? ''}
                value={selectedUsersId}
                onChange={(_e, value) => setSelectedUsersId(value)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search users..." size="small" />
                )}
              />
              {selectedUsersId.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
                >
                  {selectedUsersId.length} user{selectedUsersId.length > 1 ? 's' : ''} selected
                </Typography>
              )}
            </>
          )}

          {filterModes.has('all') && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              The selected rubrics will be assigned to all {users.length} users.
            </Typography>
          )}
        </Box>

        {(affectedUsers.length > 0 || excludedUserIds.length > 0) && (
          <Box
            sx={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              p: 3,
              mb: 2,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', letterSpacing: 1, fontSize: 11 }}
            >
              Step 3
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {affectedUsers.length} user{affectedUsers.length !== 1 ? 's' : ''} — choose contexts
              </Typography>
              {excludedUserIds.length > 0 && (
                <Button
                  size="small"
                  sx={{ textTransform: 'none', fontWeight: 400, fontSize: 12 }}
                  onClick={() => setExcludedUserIds([])}
                >
                  Reset ({excludedUserIds.length} removed)
                </Button>
              )}
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Choose pathways for each user. General is selected by default. At least one pathway
              is required per user.
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {affectedUsers.map((affectedUser) => {
                const selection =
                  userContextByUserId[affectedUser.id] ?? DEFAULT_USER_CONTEXT_SELECTION;
                return (
                  <Box
                    key={affectedUser.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      py: 0.75,
                      borderBottom: '0.5px solid var(--color-border-tertiary)',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'var(--color-background-info)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 500,
                          color: 'var(--color-text-info)',
                          flexShrink: 0,
                        }}
                      >
                        {affectedUser.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </Box>
                      <Typography variant="body2" noWrap>
                        {affectedUser.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      <UserContextsControl
                        pathways={assignablePathways}
                        selection={selection}
                        onChangeSelection={(next) => {
                          setManuallyEditedUserIds((previous) => {
                            const updated = new Set(previous);
                            updated.add(affectedUser.id);
                            return updated;
                          });
                          setUserContextByUserId((previous) => ({
                            ...previous,
                            [affectedUser.id]: next,
                          }));
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => {
                          setExcludedUserIds((prev) => [...prev, affectedUser.id]);
                          setManuallyEditedUserIds((prev) => {
                            const updated = new Set(prev);
                            updated.delete(affectedUser.id);
                            return updated;
                          });
                        }}
                        sx={{
                          minWidth: 0,
                          p: 0.5,
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' },
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  </Box>
                );
              })}
              {affectedUsers.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
                  No users match the current filter.
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={
              selectedRubricIds.length === 0 ||
              affectedUsers.length === 0 ||
              (filterModes.has('user') && !filterModes.has('all') && selectedUsersId.length === 0)
            }
            onClick={handleAssignRubric}
            sx={{ px: 4, py: 1.2, fontWeight: 500 }}
          >
            Assign rubrics
          </Button>
        </Box>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </LocalLeaderAuthGuard>
  );
}
