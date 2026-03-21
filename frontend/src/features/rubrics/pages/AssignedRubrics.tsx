import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchAssignedRubrics } from '@utils/hooks/rubrics/useFetchAssignedRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { Card, CardContent } from '@mui/material';
  export default function AssignedRubrics() {
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAssignedRubrics(user?.id ?? '');
  if (isLoadingRubrics || isLoadingUser) return <div>Loading...</div>;
  if (hasRubricsError || hasUserError) return <div>Error loading</div>;
  if (!rubrics || rubrics.length === 0 || !user) return <div>An Error Occurred</div>;
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Assigned Rubrics
      </Typography>
      <Typography color="text.secondary">
        This is where your assigned rubrics will appear.
      </Typography>  
     <Box>
      {rubrics.map((rubric) => (
        <Card key={rubric.id}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>{rubric.title}</Typography>
          </CardContent>
        </Card>
      ))}
     </Box>
    </Box>
  );
}
