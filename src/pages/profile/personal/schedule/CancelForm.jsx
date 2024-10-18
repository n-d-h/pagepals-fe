import { useMutation } from '@apollo/client';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { cancelBooking } from '../../../../services/apolo/mutations';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';

const CancelForm = (props) => {
  const { handleClose, id, refetch } = props;
  const [reason, setReason] = React.useState('');

  const [cancelService] = useMutation(cancelBooking, {
    onCompleted: () => {
      showNotification('success', 'Schedule has been cancelled');
      handleClose();
      refetch();
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while cancelling schedule');
    },
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '20px',
      borderRadius: '4px',
      justifyContent: 'center',

    }}>
            <Typography variant="h4" sx={{ textAlign: 'center', margin: '20px 0' }}>
                Are you sure you want to cancel this schedule?
            </Typography>

            <TextField
                label="Reason"
                variant="outlined"
                fullWidth
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />

            <Typography variant="caption" color="GrayText">
                * Please provide a reason for the cancellation
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (reason === '') {
                        showNotification('error', 'Please provide a reason for the cancellation');
                        return;
                      }
                      cancelService({
                        variables: {
                          id,
                          reason,
                        },
                      });
                    }}
                >
                    Yes
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClose}
                >
                    No
                </Button>
            </Box>
        </Box>
  );
};

export default CancelForm;
