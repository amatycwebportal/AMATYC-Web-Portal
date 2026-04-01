import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchInProgressRubrics } from '@utils/hooks/rubrics/useFetchInProgressRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { Button, Card, CardContent, Stack } from '@mui/material';
import ConsecutiveSnackbars, {
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RubricVersion } from '@shared/types';
export default function InProgressRubrics() {
  const navigate = useNavigate();
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchInProgressRubrics(user?.id ?? '');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  if (isLoadingRubrics || isLoadingUser) return <div>Loading...</div>;
  if (hasRubricsError || hasUserError) return <div>Error loading</div>;
  if (!rubrics || !user) return <div>An Error Occurred</div>;
  if (rubrics.length === 0) return <div>No rubrics in progress</div>;
  const handleContinueAssessment = async (rubricVersionId: string) => {
    navigate(`/rubrics/${rubricVersionId}/working`);
  };
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Assigned Rubrics
      </Typography>
      <Typography color="text.secondary">
        This is where your assigned rubrics will appear.
      </Typography>
      <Box>
        {rubrics.map((rubric: RubricVersion) => (
          <Card key={rubric.rubric.id}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {rubric.rubric.title}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ padding: '10px' }}
                  onClick={() => handleContinueAssessment(rubric.id)}
                >
                  Continue Assessment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </Box>
  );
}
