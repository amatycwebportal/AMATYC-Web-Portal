import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export const MessageStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

export interface SnackbarMessage {
  message: string;
  status: MessageStatus;
  key: number;
}

export type ConsecutiveSnackbarsHandle = {
  enqueue: (payload: { message: string; status: MessageStatus }) => void;
};

const ConsecutiveSnackbars = React.forwardRef<ConsecutiveSnackbarsHandle, object>(
  function ConsecutiveSnackbars(_props, ref) {
    const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
    const [open, setOpen] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
      undefined,
    );

    React.useImperativeHandle(ref, () => ({
      enqueue: ({ message, status }) => {
        setSnackPack((previous) => [
          ...previous,
          { message, status, key: Date.now() },
        ]);
      },
    }));

    React.useEffect(() => {
      if (snackPack.length > 0 && !messageInfo) {
        setMessageInfo({ ...snackPack[0] });
        setSnackPack((previous) => previous.slice(1));
        setOpen(true);
      } else if (snackPack.length > 0 && messageInfo && open) {
        setOpen(false);
      }
    }, [snackPack, messageInfo, open]);

    const handleClose = (
      _event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const handleExited = () => {
      setMessageInfo(undefined);
    };

    return (
      <Snackbar
        key={messageInfo?.key}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        slotProps={{ transition: { onExited: handleExited } }}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo?.status as AlertColor}
          sx={{ width: '100%' }}
          variant="filled"
          color={messageInfo?.status as AlertColor}
          key={messageInfo?.key}
        >
          <AlertTitle>{messageInfo?.status.toUpperCase()}</AlertTitle>
          {/*Not changing colors with severity*/}
          {messageInfo?.status } 
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    );
  },
);

export default ConsecutiveSnackbars;
