import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchAssignedRubrics } from '@utils/hooks/rubrics/useFetchAssignedRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { Button, Card, CardContent, Stack, CircularProgress } from '@mui/material';
import ConsecutiveSnackbars, {
  MessageStatus,
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildRubricTitleWithContext } from '../utils/rubricAssignmentLabel';
import {
  buildWorkingRubricPathFromRubricVersion,
  buildWorkingRubricPathFromContext,
} from '../utils/rubricWorkingNavigation';

export default function AssignedRubrics() {
  const navigate = useNavigate();
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAssignedRubrics(user?.id ?? '');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  if (isLoadingRubrics || isLoadingUser)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricsError || hasUserError)
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
        No rubrics assigned
      </Box>
    );

  const handleStartAssessment = async (rubricVersionId: string, courseBinId: string | null) => {
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
          courseBinId: courseBinId ?? null,
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
      const workingPath = buildWorkingRubricPathFromContext({
        rubricVersionId,
        assignmentContextLabel:
          courseBinId === null ? 'General' : (data.courseBinDisplayName ?? 'Course bin'),
        courseBinId,
      });
      navigate(workingPath);
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
          <Card key={`${rubric.id}:${rubric.courseBinId ?? 'general'}`}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {buildRubricTitleWithContext(rubric)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ padding: '10px' }}
                  onClick={() => handleStartAssessment(rubric.id, rubric.courseBinId ?? null)}
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
