import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState, type ReactNode } from 'react';
import { PLACEHOLDER_VIDEOS } from '@shared/placeholderVideos';
import { PlaceholderVideoCard } from './PlaceholderVideoCard';

type SiteTourDialogProps = {
  extraContent?: ReactNode;
};

export function SiteTourDialog({ extraContent }: SiteTourDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const executeOpen = () => {
    setIsOpen(true);
  };

  const executeClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Tooltip title="Site tour and color coding">
        <IconButton aria-label="Site tour and color coding" size="small" onClick={executeOpen}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpen} onClose={executeClose} maxWidth="sm" fullWidth>
        <DialogTitle>Site tour and color coding</DialogTitle>
        <DialogContent>
          {extraContent}
          <PlaceholderVideoCard video={PLACEHOLDER_VIDEOS.siteTourColorCoding} />
        </DialogContent>
        <DialogActions>
          <Button onClick={executeClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
