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

    const handleAssignRubric = () => {
        console.log(selectedRubricId, selectedUsersId);
        snackbarsRef.current?.enqueue({
            status: MessageStatus.SUCCESS,
            message: 'Rubric assigned successfully',
        });
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
