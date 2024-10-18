import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';

const RejectForm = (props) => {
  const [rejectReason, setRejectReason] = React.useState('');

  const handleReject = () => {
    props.update({ rejectReason });
  };
  return (
        <Box
            sx={{
              height: '100%',
              bgcolor: 'white',
              borderRadius: 3,
            }}
        >
            <Typography variant="body1" color={'black'} textAlign={'center'} fontWeight={600} gutterBottom>
                Are you sure you want to reject this seminar?
            </Typography>

            <TextField fullWidth label="Reject Reason" multiline rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} required sx={{
              my: 2,
            }}
                error={rejectReason === ''} helperText={rejectReason === '' ? 'Reject reason is required' : ''}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }} >
                <Button variant="outlined" color="error" onClick={handleReject}>
                    Reject
                </Button>

            </Box>
        </Box>
  );
};

export default RejectForm;
