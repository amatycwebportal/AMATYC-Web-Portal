import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PlaceholderVideo } from '@shared/placeholderVideos';

type PlaceholderVideoCardProps = {
  video: PlaceholderVideo;
};

export function PlaceholderVideoCard({ video }: PlaceholderVideoCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h3">
            {video.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {video.summary}
          </Typography>
          <Box
            component="video"
            controls
            preload="metadata"
            src={video.src}
            aria-label={video.title}
            sx={{
              width: '100%',
              borderRadius: 1,
              bgcolor: 'grey.900',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Placeholder recording. Replace this clip when the finished video is ready.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
