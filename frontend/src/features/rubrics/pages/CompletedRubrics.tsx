import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchCompletedRubrics } from '@utils/hooks/rubrics/useFetchCompletedRubrics';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { RubricVersion } from '@shared/types';
import {
  buildRubricAssignmentContextLabel,
  buildRubricTitleWithContext,
} from '../utils/rubricAssignmentLabel';

export default function CompletedRubrics() {
  const navigate = useNavigate();
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
        No submitted rubrics yet
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My submitted rubrics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Open a rubric to review your results. You can move a submission back to in progress if you
        need to edit it.
      </Typography>
      <Stack spacing={2}>
        {rubrics.map((rubric: RubricVersion) => (
          <Card key={`${rubric.id}:${rubric.courseBinId ?? 'global'}`}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{buildRubricTitleWithContext(rubric)}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ flexShrink: 0 }}
                  onClick={() =>
                    (() => {
                      const query = new URLSearchParams({
                        assignmentContext: buildRubricAssignmentContextLabel(rubric),
                      });
                      if (rubric.courseBinId) query.set('courseBinId', rubric.courseBinId);
                      navigate(`/rubrics/${rubric.id}/working?${query.toString()}`);
                    })()
                  }
                >
                  View or edit submission
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
