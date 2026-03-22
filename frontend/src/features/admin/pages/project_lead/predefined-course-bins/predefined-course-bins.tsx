import {
  Button,
  Dialog,
  Box,
  Paper,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  Typography,
  TableBody,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { useFetchAllPredefiendCourseBins } from '@utils/hooks/courseBins/useFetchAllPredefiendCourseBins';
import { AdminAuthGuard } from '../../../Middleware/auth';
import { useRef, useState } from 'react';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
export default function PredefinedCourseBins() {
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const {
    predefinedCourseBins,
    isLoadingPredefinedCourseBins,
    hasPredefinedCourseBinsError,
    refetchPredefinedCourseBins,
  } = useFetchAllPredefiendCourseBins();
  const [open, setOpen] = useState(false);
  const [newPredefinedCourseBinName, setNewPredefinedCourseBinName] = useState('');
  const createPredefinedCourseBin = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }
    const response = await fetch(`${backendUrl}/predefined-course-bins/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newPredefinedCourseBinName }),
    });
    if (!response.ok) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to create predefined course bin',
      });
      return;
    }
    const data = await response.json();
    setOpen(false);
    setNewPredefinedCourseBinName('');
    snackbarsRef.current?.enqueue({
      status: MessageStatus.SUCCESS,
      message: data.message,
    });
    refetchPredefinedCourseBins();
  };
  if (isLoadingPredefinedCourseBins) {
    return <div>Loading...</div>;
  }
  if (hasPredefinedCourseBinsError) {
    return <div>Error loading predefined course bins</div>;
  }
  if (!predefinedCourseBins) {
    return <div>No predefined course bins found</div>;
  }
  return (
    <AdminAuthGuard>
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Predefined Course Bins
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Create Predefined Course Bin
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table aria-label="Predefined course bins table" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predefinedCourseBins.map((predefinedCourseBin) => (
                <TableRow key={predefinedCourseBin.id}>
                  <TableCell>{predefinedCourseBin.binName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Predefined Course Bin</DialogTitle>
        <DialogContent sx={{ mt: 1, mb: 1 }}>
          <TextField
            sx={{ mt: 2, mb: 2 }}
            label="Name"
            fullWidth
            value={newPredefinedCourseBinName}
            onChange={(e) => setNewPredefinedCourseBinName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => createPredefinedCourseBin()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </AdminAuthGuard>
  );
}
