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
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchUsersByInstitution } from '@utils/hooks/users/useFetchUsersByInstitution';
import type { User } from '@shared/types';

const RUBRIC_SELECT_ALL_SENTINEL = '__select_all_rubrics__';

type UserContextSelection = {
  includeGeneral: boolean;
  courseBinIds: string[];
};

const DEFAULT_USER_CONTEXT_SELECTION: UserContextSelection = {
  includeGeneral: true,
  courseBinIds: [],
};

function countUserContexts(selection: UserContextSelection): number {
  return (selection.includeGeneral ? 1 : 0) + selection.courseBinIds.length;
}

function hasAtLeastOneContext(selection: UserContextSelection): boolean {
  return countUserContexts(selection) > 0;
}

function isGeneralContextLocked(selection: UserContextSelection): boolean {
  return selection.includeGeneral && selection.courseBinIds.length === 0;
}

function isCourseBinContextLocked(selection: UserContextSelection, courseBinId: string): boolean {
  return (
    selection.courseBinIds.includes(courseBinId) &&
    !selection.includeGeneral &&
    selection.courseBinIds.length === 1
  );
}

function buildPerUserContextAssignments(args: {
  users: User[];
  rubricIds: string[];
  userContextByUserId: Record<string, UserContextSelection>;
}): Array<{
  userId: string;
  rubricId: string;
  includeGeneral: boolean;
  courseBinIds: string[];
}> {
  return args.users.flatMap((targetUser) => {
    const selection = args.userContextByUserId[targetUser.id] ?? DEFAULT_USER_CONTEXT_SELECTION;
    return args.rubricIds.map((rubricId) => ({
      userId: targetUser.id,
      rubricId,
      includeGeneral: selection.includeGeneral,
      courseBinIds: selection.courseBinIds,
    }));
  });
}

type UserContextsControlProps = {
  user: User;
  courseBinNameById: Map<string, string>;
  selection: UserContextSelection;
  onChangeSelection: (next: UserContextSelection) => void;
};

function UserContextsControl({
  user,
  courseBinNameById,
  selection,
  onChangeSelection,
}: UserContextsControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const contextCount = countUserContexts(selection);

  const availableCourseBinIds = useMemo(
    () => user.userCourseBins.map((entry) => entry.courseBinId),
    [user.userCourseBins]
  );

  const selectedContextLabels = useMemo(() => {
    const labels: string[] = [];
    if (selection.includeGeneral) {
      labels.push('General');
    }
    for (const courseBinId of selection.courseBinIds) {
      labels.push(courseBinNameById.get(courseBinId) ?? 'Course bin');
    }
    return labels;
  }, [courseBinNameById, selection.courseBinIds, selection.includeGeneral]);

  const handleToggleGeneral = (isChecked: boolean) => {
    const nextSelection = { ...selection, includeGeneral: isChecked };
    if (!hasAtLeastOneContext(nextSelection)) {
      return;
    }
    onChangeSelection(nextSelection);
  };

  const handleToggleCourseBin = (courseBinId: string, isChecked: boolean) => {
    const nextSelection = {
      ...selection,
      courseBinIds: isChecked
        ? [...selection.courseBinIds, courseBinId]
        : selection.courseBinIds.filter((id) => id !== courseBinId),
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
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={selection.includeGeneral}
              disabled={isGeneralContextLocked(selection)}
              onChange={(_event, isChecked) => handleToggleGeneral(isChecked)}
            />
          }
          label="General"
          sx={{ display: 'flex', ml: 0, mb: 0.5 }}
        />
        {availableCourseBinIds.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            No course bins linked to this user.
          </Typography>
        ) : (
          availableCourseBinIds.map((courseBinId) => (
            <FormControlLabel
              key={courseBinId}
              control={
                <Checkbox
                  size="small"
                  checked={selection.courseBinIds.includes(courseBinId)}
                  disabled={isCourseBinContextLocked(selection, courseBinId)}
                  onChange={(_event, isChecked) => handleToggleCourseBin(courseBinId, isChecked)}
                />
              }
              label={courseBinNameById.get(courseBinId) ?? 'Course bin'}
              sx={{ display: 'flex', ml: 0 }}
            />
          ))
        )}
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
  const { courseBins, isLoadingCourseBins, hasCourseBinsError } = useFetchInstitutionCourseBins(
    user?.institutionId
  );
  const [filterModes, setFilterModes] = useState<Set<'all' | 'user' | 'coursebin'>>(
    new Set(['user'])
  );
  const [selectedCourseBinIds, setSelectedCourseBinIds] = useState<string[]>([]);
  const [selectedRubricIds, setSelectedRubricIds] = useState<string[]>([]);
  const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
  const [userContextByUserId, setUserContextByUserId] = useState<
    Record<string, UserContextSelection>
  >({});
  const [excludedUserIds, setExcludedUserIds] = useState<string[]>([]);
  const [nameSearch, setNameSearch] = useState('');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const courseBinNameById = useMemo(
    () => new Map((courseBins ?? []).map((bin) => [bin.id, bin.displayName])),
    [courseBins]
  );

  const affectedUsers = useMemo(() => {
    let result: typeof users = [];
    if (filterModes.has('all')) {
      result = users ?? [];
    } else {
      const byName = filterModes.has('user')
        ? (users?.filter((u) => selectedUsersId.includes(u.id)) ?? [])
        : [];
      const byCoursebin = filterModes.has('coursebin')
        ? (users?.filter((u) =>
            u?.userCourseBins?.some((ucb) => selectedCourseBinIds.includes(ucb.courseBinId))
          ) ?? [])
        : [];
      const seen = new Set<string>();
      for (const u of [...byName, ...byCoursebin]) {
        if (!seen.has(u.id)) {
          seen.add(u.id);
          result.push(u);
        }
      }
    }
    result = result.filter((u) => !excludedUserIds.includes(u.id));
    if (nameSearch.trim()) {
      result = result.filter((u) => u.name.toLowerCase().includes(nameSearch.toLowerCase()));
    }
    return result;
  }, [filterModes, users, selectedUsersId, selectedCourseBinIds, excludedUserIds, nameSearch]);

  useEffect(() => {
    setUserContextByUserId((previous) => {
      const next = { ...previous };
      for (const affectedUser of affectedUsers) {
        if (!next[affectedUser.id]) {
          next[affectedUser.id] = { ...DEFAULT_USER_CONTEXT_SELECTION };
        }
      }
      return next;
    });
  }, [affectedUsers]);

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

      const allUsersHaveContext = assignments.every(
        (row) => row.includeGeneral || row.courseBinIds.length > 0
      );
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

  if (isLoadingRubrics || isLoadingUsers || isLoadingCourseBins)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricsError || hasUsersError || hasCourseBinsError)
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
  if (!courseBins || courseBins.length === 0)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        No course bins found
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
            {(['all', 'user', 'coursebin'] as const).map((mode) => (
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
                        next.delete('coursebin');
                      } else next.delete('all');
                    }
                    return next.size === 0 ? prev : next;
                  });
                }}
                variant={filterModes.has(mode) ? 'contained' : 'outlined'}
                sx={{ textTransform: 'none', fontWeight: 400 }}
              >
                {mode === 'all' ? 'All users' : mode === 'user' ? 'By name' : 'By course bin'}
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

          {filterModes.has('coursebin') && (
            <>
              <Autocomplete
                multiple
                disableClearable
                size="small"
                forcePopupIcon={false}
                options={courseBins.map((cb) => cb.id)}
                getOptionLabel={(option) =>
                  courseBins.find((cb) => cb.id === option)?.displayName ?? ''
                }
                value={selectedCourseBinIds}
                onChange={(_e, value) => setSelectedCourseBinIds(value)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search course bins..." size="small" />
                )}
              />
              {selectedCourseBinIds.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
                >
                  {selectedCourseBinIds.length} course bin
                  {selectedCourseBinIds.length > 1 ? 's' : ''} selected
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
              Choose General and/or course-bin contexts for each user. At least one context is
              required per user.
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
                        user={affectedUser}
                        courseBinNameById={courseBinNameById}
                        selection={selection}
                        onChangeSelection={(next) =>
                          setUserContextByUserId((previous) => ({
                            ...previous,
                            [affectedUser.id]: next,
                          }))
                        }
                      />
                      <Button
                        size="small"
                        onClick={() => setExcludedUserIds((prev) => [...prev, affectedUser.id])}
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
              (filterModes.has('user') &&
                !filterModes.has('coursebin') &&
                !filterModes.has('all') &&
                selectedUsersId.length === 0) ||
              (filterModes.has('coursebin') &&
                !filterModes.has('user') &&
                !filterModes.has('all') &&
                selectedCourseBinIds.length === 0)
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
