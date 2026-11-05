import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PLACEHOLDER_VIDEOS } from '@shared/placeholderVideos';
import { PlaceholderVideoCard } from './PlaceholderVideoCard';

export default function RubricGuidePage() {
  return (
    <Box sx={{ maxWidth: 720 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Guide to using the rubrics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Open an assigned rubric, save your progress, and submit when every scale is scored.
          </Typography>
        </Stack>
        <PlaceholderVideoCard video={PLACEHOLDER_VIDEOS.rubricGuide} />
      </Stack>
    </Box>
  );
}
