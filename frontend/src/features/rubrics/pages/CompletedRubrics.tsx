import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CompletedRubrics() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Completed Rubrics
      </Typography>
      <Typography color="text.secondary">
        This is where your completed rubrics will appear.
      </Typography>
    </Box>
  );
}
