import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { storage } from '../../../auth/firebase';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import UploadAvatar from '../../../components/shadcn-ui/upload/upload-avatar';
import { selectUser } from '../../../redux/slices/authSlice';
import { acceptWithdrawalMutation, rejectWithdrawalMutation } from '../../../services/apolo/mutations';

const WithdrawRequestForm = (props) => {
  const { data, refetch, closeDialog } = props;

  const userProfile = useSelector(selectUser);

  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const [loadingScreen, setLoadingScreen] = useState(false);

  const [acceptWithdraw, { loading }] = useMutation(acceptWithdrawalMutation, {
    onCompleted: () => {
      showNotification('success', 'Request accepted');

      refetch();
      closeDialog();
    },

    onError: (e) => {
      handleFriendlyError(e, 'Request accepted failed');
    },
  });

  const handleAccept = async () => {
    setLoadingScreen(true); // Initiate loading screen at the start

    try {
      // Upload files in parallel for efficiency
      const avatarUrl = await
      handleUploadFileToFirebaseAndSetToForm(avatar);

      // Check if any uploads failed
      if (!avatarUrl) {
        showNotification('error', 'Failed to upload one or more files.');
      }

      // Execute the mutation to become a reader
      await acceptWithdraw({
        variables: {
          id: data.id,
          staffId: userProfile.id,
          imageUrl: avatarUrl,
        },
      });
    } catch (error) {
      // Ensure any errors are caught and shown
    } finally {
      // Set loading screen to false only here, after all operations are complete or if an error occurs
      setLoadingScreen(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setAvatar(newFile);
      }
    },
    [setAvatar],
  );

  const handleUploadFileToFirebaseAndSetToForm = async (file) => {
    if (!file) return null;

    try {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      return downloadURL;
    } catch (error) {
      showNotification('error', 'An error occurred during file upload.');
    }
  };

  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);

  const [reject, { loading: rejectLoading }] = useMutation(rejectWithdrawalMutation, {
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Bank Name:</Typography>

                        <Typography variant="body1" fontWeight={600} >{
                            _.get(data, 'bankName', 'N/A')
                        }</Typography>

                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Bank Account:</Typography>

                        <Typography variant="body1" fontWeight={600} >{
                            _.get(data, 'bankAccountName', 'N/A')
                        }</Typography>

                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Bank Number:</Typography>
                        <Typography variant="body1" fontWeight={600} >{
                            _.get(data, 'bankAccountNumber', 'N/A')
                        }</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">Amount:</Typography>
                        <Typography variant="body1" fontWeight={600} >{
                            _.get(data, 'amount', 'N/A')
                        }</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box className="flex" sx={{
                      flexDirection: 'column',
                      gap: 2,
                    }}>
                        <UploadAvatar file={avatar}
                            error={avatarError}
                            disabled={false}
                            onDrop={(file) => {
                              handleDrop(file);
                              setAvatarError(false);
                            }} />

                        <Typography variant="caption" color={
                            avatarError ? 'error' : 'inherit'
                        } textAlign={'center'}>
                            {avatarError ? 'Confirmation photo is required' : 'Required when accepting request'}
                        </Typography>
                    </Box>
                </Grid>

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
                            loading={loading || loadingScreen}
                            variant="outlined"
                            color="success"
                            mr={2}
                            onClick={() => {
                              if (!avatar) {
                                setAvatarError(true);
                                return;
                              }

                              if (avatar) {
                                handleAccept();
                              }
                            }}
                        >
                            Accept
                        </LoadingButton>
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
                                    id: data.id,
                                    staffId: userProfile.id,
                                    rejectReason: reason,
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

export default WithdrawRequestForm;
