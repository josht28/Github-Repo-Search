import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
type AlertUser = {
  isOpen: boolean;
  onCloseAlert: () => void;
};

export default function CustomizedSnackbar({
  isOpen,
  onCloseAlert,
}: AlertUser) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onCloseAlert();
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          Something went wrong. Please refresh page!
        </Alert>
      </Snackbar>
    </Stack>
  );
}
