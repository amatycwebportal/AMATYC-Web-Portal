import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchAssignedRubrics } from '@utils/hooks/rubrics/useFetchAssignedRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { Button, Card, CardContent, Stack } from '@mui/material';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssignedRubrics() {
  const navigate = useNavigate();
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAssignedRubrics(user?.id ?? '');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  if (isLoadingRubrics || isLoadingUser) return <div>Loading...</div>;
  if (hasRubricsError || hasUserError) return <div>Error loading</div>;
  if (!rubrics || !user) return <div>An Error Occurred</div>;
  if (rubrics.length === 0) return <div>No rubrics assigned</div>;

  const handleStartAssessment = async (rubricVersionId: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        return;
      }
      const response = await fetch(`${backendUrl}/rubrics/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rubricVersionId: rubricVersionId,
          userId: user?.id,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        console.error(data.error + ' ' + data.details);
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: data.error,
        });
        return;
      }
      const data = await response.json();
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: data.message,
      });
      navigate(`/rubrics/${rubricVersionId}/working`);
    } catch (error) {
      console.error('Failed to start assessment', error);
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to start assessment: ' + error,
      });
    }
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
        {rubrics.map((rubric) => (
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
                  onClick={() => handleStartAssessment(rubric.id)}
                >
                  Start Assessment
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
