import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LocalLeaderAuthGuard } from '../../Middleware/auth';

type LocalLeaderStubToolProps = {
  title: string;
  description: string;
};

export default function LocalLeaderStubTool({ title, description }: LocalLeaderStubToolProps) {
  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 720, mx: 'auto', py: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </LocalLeaderAuthGuard>
  );
}
