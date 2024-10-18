import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { paths } from '../../../components/router/paths';
import { acceptReportReaderMutation } from '../../../services/apolo/mutations';

const BanReaderForm = (props) => {
  const navigate = useNavigate();

  const [reason, setReason] = useState('');

  const [handleAccept, { loading: acceptLoading }] = useMutation(acceptReportReaderMutation, {
    onCompleted: (data) => {
      if (data?.acceptReportReader) {
        showNotification('success', 'Report accepted successfully');
        props.closeDialog();
        navigate(paths.dashboard.reportReaderManagement);
      } else {
        showNotification('error', 'Report accepted failed');
      }
    },

    onError: (e) => {
      handleFriendlyError(e, 'Report accepted failed');
    },
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>

        <Box sx={{ width: '100%', maxWidth: 400 }}>
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
        </Box>

        <Box sx={{ my: 2 }}>
            <LoadingButton
                variant="contained"
                color="error"
                loading={acceptLoading}
                onClick={() => {
                  
                  if(!reason || reason === '') {
                    showNotification('error', 'Reason is required');
                    return;
                  }

                  handleAccept({
                    variables: {
                      readerId: props.readerId,
                      reason,
                    },
                  });
                }}
            >
                Ban Reader
            </LoadingButton>
        </Box>
    </Box>
  );
};

export default BanReaderForm;

// You're a skibidi sigma chad mf who french kissed their cousin and it's disgusting
