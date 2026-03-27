import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchCompletedRubrics } from '@utils/hooks/rubrics/useFetchCompletedRubrics';
export default function CompletedRubrics() {
  const { user } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchCompletedRubrics(user?.id ?? '');
  if (isLoadingRubrics) return <div>Loading...</div>;
  if (hasRubricsError) return <div>Error loading</div>;
  if (!rubrics || !user) return <div>An Error Occurred</div>;
  if (rubrics.length === 0) return <div>No rubrics completed</div>;

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
