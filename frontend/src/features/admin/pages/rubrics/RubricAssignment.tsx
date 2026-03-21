import { Autocomplete, Button, MenuItem, Select, TextField, Box, Typography } from '@mui/material';
import { AdminAuthGuard } from '../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef, useState } from 'react';


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
            <Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Rubric Assignment
                </Typography>
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Rubric
                    </Typography>
                    <Select
                        label="Rubric"
                        value={selectedRubricId}
                        onChange={(e) => setSelectedRubricId(e.target.value)}
                        labelId="rubric-label"

                    >
                        {rubrics.map((rubric) => (
                            <MenuItem key={rubric.id} value={rubric.id}>{rubric.title}</MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        User
                    </Typography>
                    <Autocomplete
                        multiple
                        options={users.map((user) => user.id)}
                        getOptionLabel={(option) => users.find((user) => user.id === option)?.name ?? ''}
                        value={selectedUsersId}
                        onChange={(_event, value) => setSelectedUsersId(value)}
                        renderInput={(params) => <TextField {...params} label="User" />}
                    />
                </Box>
                <Button variant="contained" color="primary" onClick={() => {
                    handleAssignRubric();
                }}>Assign Rubric</Button>
            </Box>
            <ConsecutiveSnackbars ref={snackbarsRef} />
        </AdminAuthGuard>
    );
}
