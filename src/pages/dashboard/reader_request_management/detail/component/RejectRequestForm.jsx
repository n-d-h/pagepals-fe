import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError, showNotification } from '../../../../../components/common_services/CommonServices';
import { selectUser } from '../../../../../redux/slices/authSlice';
import { rejectRequestMutation } from '../../../../../services/apolo/mutations';

const RejectRequestForm = (props) => {
  const { data, refetch, closeDialog, user } = props;

  const userProfile = useSelector(selectUser);

  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);

  const [reject, { loading: rejectLoading }] = useMutation(rejectRequestMutation, {
    onCompleted: () => {
      showNotification('success', 'Request rejected');
      refetch();
      closeDialog();
    },
    onError: (e) => {
      handleFriendlyError(e, 'Request rejected failed');
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reason for rejection"
            multiline
            rows={4}
            value={reason}
            error={reasonError}
            helperText={reasonError ? 'Reason is required' : ''}
            onChange={(e) => {
              if (!e.target.value) setReasonError(true);
              setReason(e.target.value);
              setReasonError(false);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <LoadingButton
              loading={rejectLoading}
              variant="outlined"
              color="error"
              onClick={() => {
                if (!reason) {
                  setReasonError(true);
                }

                if (reason && reason !== '') {
                  reject({
                    variables: {
                      requestId: data?.id,
                      staffId: user?.id,
                      reason: reason,
                      description: '',
                    },
                  });
                }
              }}
            >
              Reject
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>

    </Box>
  );
};

export default RejectRequestForm;
