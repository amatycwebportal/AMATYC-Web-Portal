import { Autocomplete, Button, MenuItem, Select, TextField, Box, Typography } from '@mui/material';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useMemo, useRef, useState } from 'react';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchUsersByInstitution } from '@utils/hooks/users/useFetchUsersByInstitution';

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
  const [selectedRubricId, setSelectedRubricId] = useState<string>('');
  const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
  const [excludedUserIds, setExcludedUserIds] = useState<string[]>([]);
  const [nameSearch, setNameSearch] = useState('');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error('VITE_BACKEND_URL is not configured.');
    return;
  }
  const handleAssignRubric = async () => {
    try {
      const userIds = affectedUsers.map((u) => u.id);
      if (!selectedRubricId || userIds.length === 0) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'Please select a rubric and at least one user',
        });
        return;
      }

      if (!userIds || userIds.length === 0) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'No users to assign',
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
          rubricId: selectedRubricId,
          userIds: userIds,
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
      // Union, deduplicated
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

  if (isLoadingRubrics || isLoadingUsers || isLoadingCourseBins) return <div>Loading...</div>;
  if (hasRubricsError || hasUsersError || hasCourseBinsError) return <div>Error loading</div>;
  if (!rubrics || rubrics.length === 0) return <div>No rubrics found</div>;
  if (!users || users.length === 0) return <div>No users found</div>;
  if (!courseBins || courseBins.length === 0) return <div>No course bins found</div>;
  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4, px: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.5 }}>
            Rubric Assignment
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Select a rubric and assign it to users by name, course bin, or both.
          </Typography>
        </Box>

        {/* Step 1 — Rubric */}
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
            Choose a rubric
          </Typography>
          <Select
            displayEmpty
            fullWidth
            value={selectedRubricId}
            onChange={(e) => setSelectedRubricId(e.target.value)}
            renderValue={(val) =>
              val ? rubrics.find((r) => r.id === val)?.title : 'Select a rubric...'
            }
            sx={{ fontSize: 14 }}
          >
            {rubrics.map((rubric) => (
              <MenuItem key={rubric.id} value={rubric.id}>
                {rubric.title}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Step 2 — Filter mode */}
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
            Filter users by
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
                    return next.size === 0 ? prev : next; // prevent deselecting all
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
              The rubric will be assigned to all {users.length} users.
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
                {affectedUsers.length} user{affectedUsers.length !== 1 ? 's' : ''} will be assigned
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

            <TextField
              fullWidth
              size="small"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {affectedUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 0.75,
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                      {user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Box>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setExcludedUserIds((prev) => [...prev, user.id])}
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
              ))}
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
              !selectedRubricId ||
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
            Assign rubric
          </Button>
        </Box>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </LocalLeaderAuthGuard>
  );
}
