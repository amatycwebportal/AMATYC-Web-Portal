import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { AdminAuthGuard } from '../../../Middleware/auth';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchAllPredefiendCourseBins } from '@utils/hooks/courseBins/useFetchAllPredefiendCourseBins';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef, useState } from 'react';

export default function CourseBins() {
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const [open, setOpen] = useState(false);
  const [newCourseBinName, setNewCourseBinName] = useState('');
  const [newPredefinedCourseBinId, setNewPredefinedCourseBinId] = useState('');
  const { courseBins, isLoadingCourseBins, hasCourseBinsError, refetchCourseBins } =
    useFetchInstitutionCourseBins(isLoadingUser ? undefined : user?.institutionId);
  const { predefinedCourseBins, isLoadingPredefinedCourseBins, hasPredefinedCourseBinsError } =
    useFetchAllPredefiendCourseBins();
  if (isLoadingCourseBins || isLoadingUser || isLoadingPredefinedCourseBins) {
    return <div>Loading...</div>;
  }
  if (hasCourseBinsError || hasUserError || hasPredefinedCourseBinsError) {
    return <div>Error loading resources</div>;
  }

  if (!courseBins || !user || !predefinedCourseBins) {
    return <div>No resources found</div>;
  }
  const createCourseBin = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }
    const response = await fetch(`${backendUrl}/course-bins/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newCourseBinName,
        predefinedCourseBinId: newPredefinedCourseBinId,
        institutionId: user?.institutionId,
      }),
    });
    if (!response.ok) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to create course bin',
      });
      return;
    }
    const data = await response.json();
    snackbarsRef.current?.enqueue({
      status: MessageStatus.SUCCESS,
      message: data.message,
    });
    setOpen(false);
    setNewCourseBinName('');
    setNewPredefinedCourseBinId('');
    refetchCourseBins();
  };

  return (
    <AdminAuthGuard>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Course Bins
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Create Course Bin
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table aria-label="Course bins table" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Predefined Course Bin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseBins.map((courseBin) => (
                <TableRow key={courseBin.id}>
                  <TableCell>{courseBin.displayName}</TableCell>
                  <TableCell>
                    {
                      predefinedCourseBins.find(
                        (predefinedCourseBin) =>
                          predefinedCourseBin.id === courseBin.predefinedBinId
                      )?.binName
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Course Bin</DialogTitle>
        <DialogContent sx={{ mt: 2, mb: 2 }}>
          <TextField
            sx={{ mb: 2, mt: 1 }}
            label="Name"
            fullWidth
            value={newCourseBinName}
            onChange={(e) => setNewCourseBinName(e.target.value)}
          />
          <Autocomplete
            options={predefinedCourseBins}
            getOptionLabel={(option) => option.binName}
            onChange={(e, value) => setNewPredefinedCourseBinId(value?.id ?? '')}
            renderInput={(params) => <TextField {...params} label="Predefined Course Bin" />}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => createCourseBin()}>
            Create
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </AdminAuthGuard>
  );
}
