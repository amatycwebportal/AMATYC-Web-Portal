import Box from '@mui/material/Box';
import { ProjectLeadAuthGuard } from '../../Middleware/auth';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
export default function CreateInstitution() {
  const navigate = useNavigate();
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const [localLeaderName, setLocalLeaderName] = useState('');
  const [localLeaderEmail, setLocalLeaderEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [academicSchoolYear, setAcademicSchoolYear] = useState('');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const academicSchoolYearOptions = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    return Array.from({ length: 8 }, (_, index) => {
      const startYear = (currentYear + index) % 100;
      const endYear = (startYear + 1) % 100;
      return `${String(startYear).padStart(2, '0')}/${String(endYear).padStart(2, '0')}`;
    });
  }, []);
  if (isLoadingUser) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (hasUserError) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading user
      </Box>
    );
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error('VITE_BACKEND_URL is not configured.');
    return;
  }

  const handleCreateInstitution = async () => {
    try {
      const response = await fetch(`${backendUrl}/institutions/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: institutionName,
          academicSchoolYear,
          localLeaderName: localLeaderName,
          localLeaderEmail: localLeaderEmail,
          invitedByuser: user,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'Failed to create institution: ' + data.error,
        });
        return;
      }
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'Institution created successfully',
      });
    } catch (error) {
      console.error('Failed to create institution:', JSON.stringify(error, null, 2));
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to create institution',
      });
    }
  };
  return (
    <ProjectLeadAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Create Institution
        </Typography>
      </Box>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/admin/institutions/manage')}>
            Manage institutions
          </Button>
        </Box>
        <TextField
          label="Institution Name"
          variant="outlined"
          fullWidth
          required
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
        />
        <FormControl fullWidth required sx={{ mt: 2 }}>
          <InputLabel id="academic-school-year-label">Academic School Year</InputLabel>
          <Select
            labelId="academic-school-year-label"
            label="Academic School Year"
            value={academicSchoolYear}
            onChange={(e) => setAcademicSchoolYear(e.target.value)}
          >
            {academicSchoolYearOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Local Leader
          </Typography>
          <TextField
            label="Local Leader Name"
            variant="outlined"
            sx={{ mb: 2 }}
            value={localLeaderName}
            onChange={(e) => setLocalLeaderName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Local Leader Email"
            variant="outlined"
            fullWidth
            required
            value={localLeaderEmail}
            onChange={(e) => setLocalLeaderEmail(e.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCreateInstitution()}
          disabled={!institutionName || !academicSchoolYear || !localLeaderName || !localLeaderEmail}
        >
          Create Institution
        </Button>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </ProjectLeadAuthGuard>
  );
}
