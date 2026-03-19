import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AssignedRubrics() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Assigned Rubrics
      </Typography>
      <Typography color="text.secondary">
        This is where your assigned rubrics will appear.
      </Typography>
    </Box>
  );
}
