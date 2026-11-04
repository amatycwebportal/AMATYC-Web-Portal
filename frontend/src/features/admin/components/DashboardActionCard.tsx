import type { ComponentType } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export type DashboardAction = {
  title: string;
  description: string;
  path: string;
  icon: ComponentType<SvgIconProps>;
  iconBackgroundColor: string;
  iconColor: string;
};

type DashboardActionCardProps = {
  action: DashboardAction;
  onSelect: (path: string) => void;
};

export function DashboardActionCard({ action, onSelect }: DashboardActionCardProps) {
  const Icon = action.icon;
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        transition: (theme) =>
          theme.transitions.create(['box-shadow', 'border-color'], {
            duration: theme.transitions.duration.shortest,
          }),
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
        },
      }}
    >
      <CardActionArea
        aria-label={`Open ${action.title}`}
        onClick={() => onSelect(action.path)}
        sx={{ height: '100%', alignItems: 'stretch', display: 'block', textAlign: 'left' }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 1.5,
                flexShrink: 0,
                bgcolor: action.iconBackgroundColor,
                color: action.iconColor,
              }}
            >
              <Icon sx={{ fontSize: 28 }} aria-hidden />
            </Box>
            <Stack spacing={0.75} sx={{ minWidth: 0 }}>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                {action.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600, pt: 0.5 }}>
                Open →
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
