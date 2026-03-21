import { Autocomplete, Button, MenuItem, Select, TextField, Box, Typography } from '@mui/material';
import { AdminAuthGuard } from '../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef, useState } from 'react';
import { TPSE_COLORS } from '@theme/themePrimitives';


export default function RubricAssignment() {
    const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
    const { users, isLoadingUsers, hasUsersError } = useFetchAllUsers();
    const [selectedRubricId, setSelectedRubricId] = useState<string>('');
    const [selectedUsersId, setSelectedUsersId] = useState<string[]>([]);
    const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        return;
      }
    const handleAssignRubric = async () => {
        try {
            if (!selectedRubricId || selectedUsersId.length === 0) {
                snackbarsRef.current?.enqueue({
                    status: MessageStatus.ERROR,
                    message: 'Please select a rubric and at least one user',
                });
                return;
            }
            console.log(selectedRubricId, selectedUsersId);
            const response = await fetch(`${backendUrl}/rubrics/assign`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rubricId: selectedRubricId,
                    userIds: selectedUsersId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to assign rubric');
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

    if (isLoadingRubrics || isLoadingUsers) return <div>Loading...</div>;
    if (hasRubricsError || hasUsersError) return <div>Error loading</div>;
    if (!rubrics || rubrics.length === 0) return <div>No rubrics found</div>;
    if (!users || users.length === 0) return <div>No users found</div>;

    return (
        <AdminAuthGuard>
            <Box sx={{ maxWidth: 680, mx: 'auto', mt: 4, px: 2 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.5 }}>
                        Rubric Assignment
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Select a rubric and assign it to one or more users.
                    </Typography>
                </Box>
    
                {/* Rubric Selection */}
                <Box
                    sx={{
                        background: 'var(--color-background-primary)',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-lg)',
                        p: 3,
                        mb: 2,
                    }}
                >
                    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1, fontSize: 11 }}>
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
    
                {/* User Selection */}
                <Box
                    sx={{
                        background: 'var(--color-background-primary)',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-lg)',
                        p: 3,
                        mb: 3,
                    }}
                >
                    <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1, fontSize: 11 }}>
                        Step 2
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                        Assign users
                    </Typography>
                    <Autocomplete
                        multiple
                        size="small"
                        disableClearable
                        forcePopupIcon={false}
                        options={users.map((user) => user.id)}
                        getOptionLabel={(option) => users.find((user) => user.id === option)?.name ?? ''}
                        value={selectedUsersId}
                        onChange={(_event, value) => setSelectedUsersId(value)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Search users..." size="small" />
                        )}
                    />
                    {selectedUsersId.length > 0 && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                            {selectedUsersId.length} user{selectedUsersId.length > 1 ? 's' : ''} selected
                        </Typography>
                    )}
                </Box>
    
                {/* Action */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!selectedRubricId || selectedUsersId.length === 0}
                        onClick={handleAssignRubric}
                        sx={{ px: 4, py: 1.2, fontWeight: 500 }}
                    >
                        Assign rubric
                    </Button>
                </Box>
            </Box>
            <ConsecutiveSnackbars ref={snackbarsRef} />
        </AdminAuthGuard>
    );
}
