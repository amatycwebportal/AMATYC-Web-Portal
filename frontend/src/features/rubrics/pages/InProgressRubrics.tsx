import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function InProgressRubrics() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Rubrics in Progress
      </Typography>
      <Typography color="text.secondary">
        This is where your in-progress rubrics will appear.
      </Typography>
    </Box>
  );
}

