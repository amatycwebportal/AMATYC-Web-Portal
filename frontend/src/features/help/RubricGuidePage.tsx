import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { PLACEHOLDER_VIDEOS } from '@shared/placeholderVideos';
import AppTheme from '../../theme/AppTheme';
import { PlaceholderVideoCard } from './PlaceholderVideoCard';

export default function RubricGuidePage() {
  const navigate = useNavigate();

  return (
    <AppTheme>
      <Box sx={{ maxWidth: 720, mx: 'auto', p: 3 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Guide to using the rubrics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Open an assigned rubric, save your progress, and submit when every scale is scored.
              This page is linked from invitation emails.
            </Typography>
          </Stack>
          <PlaceholderVideoCard video={PLACEHOLDER_VIDEOS.rubricGuide} />
          <Button variant="contained" onClick={() => navigate('/sign-in')} sx={{ alignSelf: 'flex-start' }}>
            Sign in
          </Button>
        </Stack>
      </Box>
    </AppTheme>
  );
}
