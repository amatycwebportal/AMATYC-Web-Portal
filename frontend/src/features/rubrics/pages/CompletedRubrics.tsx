import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchCompletedRubrics } from '@utils/hooks/rubrics/useFetchCompletedRubrics';
import CircularProgress from '@mui/material/CircularProgress';
export default function CompletedRubrics() {
  const { user } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchCompletedRubrics(user?.id ?? '');
  if (isLoadingRubrics)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricsError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading
      </Box>
    );
  if (!rubrics || !user)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        An Error Occurred
      </Box>
    );
  if (rubrics.length === 0)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        No rubrics completed
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Completed Rubrics
      </Typography>
      {rubrics.map((rubric) => (
        <div key={rubric.id}>
          <Typography variant="h5">{rubric.rubric.title}</Typography>
        </div>
      ))}
    </Box>
  );
}
