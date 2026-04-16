import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchInProgressRubrics } from '@utils/hooks/rubrics/useFetchInProgressRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { Button, Card, CardContent, Stack, CircularProgress } from '@mui/material';
import ConsecutiveSnackbars, {
  type ConsecutiveSnackbarsHandle,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RubricVersion } from '@shared/types';
import { buildRubricTitleWithContext } from '../utils/rubricAssignmentLabel';
import { buildWorkingRubricPathFromRubricVersion } from '../utils/rubricWorkingNavigation';
export default function InProgressRubrics() {
  const navigate = useNavigate();
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchInProgressRubrics(user?.id ?? '');
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
        No rubrics in progress
      </Box>
    );
  const handleContinueAssessment = async (rubricVersion: RubricVersion) => {
    const workingPath = buildWorkingRubricPathFromRubricVersion(rubricVersion);
    navigate(workingPath);
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
        {rubrics.map((rubricVersion: RubricVersion) => (
          <Card key={`${rubricVersion.id}:${rubricVersion.courseBinId ?? 'global'}`}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {buildRubricTitleWithContext(rubricVersion)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ padding: '10px' }}
                  onClick={() => handleContinueAssessment(rubricVersion)}
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
