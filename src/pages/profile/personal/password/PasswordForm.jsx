import { yupResolver } from '@hookform/resolvers/yup';

import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { decodeVerificationCode, handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import Form from '../../../../components/form/Form';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import Iconify from '../../../../components/iconify';
import { selectUser } from '../../../../redux/slices/authSlice';
import { updatePasswordMutation, verifyChangePassword } from '../../../../services/apolo/mutations';

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const ChangePasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Password is required')
    .default('')
    .matches(
      passwordRegex,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .default('')
    .required('Confirming your password is required'),
  code: Yup.string().required('Code is required').default(''),
});

const PasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockWarning, setCapsLockWarning] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  const userProfile = useSelector(selectUser);

  const methods = useForm({
    defaultValues: {
      ...ChangePasswordValidationSchema.default(),
    },

    resolver: yupResolver(ChangePasswordValidationSchema),
  });

  const { handleSubmit, reset } = methods;

  const [handleGetCode, { loading }] = useMutation(verifyChangePassword, {
    onCompleted: (data) => {
      setVerifyCode(decodeVerificationCode(
        data?.verifyCode));
      showNotification('success', 'Code sent to your email');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Cannot send code');
    },
  });

  const [handleChangePassword, { loading: changePasswordLoading }] = useMutation(updatePasswordMutation, {
    onCompleted: () => {
      showNotification('success', 'Password changed successfully');
      reset();
    },
    onError: (error) => {
      handleFriendlyError(error, 'Cannot change password');
    },
  });

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsLockWarning(true);
    } else {
      setCapsLockWarning(false);
    }
  };

  const onSubmit = async (data) => {
    if (data.code !== verifyCode) {
      showNotification('error', 'Invalid code');
    } else {
      await handleChangePassword({
        variables: {
          id: userProfile?.id,
          password: data.newPassword,
        },
      });
    }
  };

  return (
        <FormProvider {...methods}>
            <Form
                showBackdropWhenLoading
                onSubmit={handleSubmit(onSubmit)}
                style={{ width: '100%' }}
            >
                <Box className="flex">
                    <Paper
                        sx={{
                          borderRadius: 4,
                          p: 4,
                        }}
                    >
                        <Grid container justifyContent={'center'} rowSpacing={4}>
                            <Grid item xs={12}>
                                <Typography variant="h4" component="div" fontWeight={600}>
                                    Change Password
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                container
                                spacing={4}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Grid item xs={12}>
                                <RHFTextField
                                        name="code"
                                        label="Verify Code"
                                        InputProps={{
                                          endAdornment: (
                                                <InputAdornment position="end">
                                                    <LoadingButton loading={loading} onClick={() => {
                                                      handleGetCode({
                                                        variables: {
                                                          id: userProfile?.id,
                                                        },
                                                      });
                                                    }} variant='text' color='primary'>
                                                        Get Code
                                                    </LoadingButton>
                                                </InputAdornment>
                                          ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <RHFTextField
                                        name="newPassword"
                                        label="New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        onKeyDown={onKeyDown}

                                        InputProps={{
                                          endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip
                                                        title={
                                                            capsLockWarning
                                                              ? 'Capslock is on'
                                                              : 'Capslock is off'
                                                        }
                                                    >
                                                        <span>
                                                            <IconButton
                                                                sx={{
                                                                  pointerEvents: 'none',
                                                                }}
                                                                disabled={!capsLockWarning} >
                                                                <Iconify icon="eva:keyboard" size="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                          setShowPassword(!showPassword);
                                                        }}
                                                    >
                                                        {showPassword
                                                          ? <Iconify
                                                                icon="eva:eye-off-outline"
                                                            />
                                                          : <Iconify
                                                                icon="eva:eye-outline"
                                                            />}
                                                    </IconButton>
                                                </InputAdornment>
                                          ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RHFTextField
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type={showPassword ? 'text' : 'password'}

                                        InputProps={{
                                          endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip
                                                        title={
                                                            capsLockWarning
                                                              ? 'Capslock is on'
                                                              : 'Capslock is off'
                                                        }
                                                    >
                                                        <span>
                                                            <IconButton
                                                                sx={{
                                                                  pointerEvents: 'none',
                                                                }}
                                                                disabled={!capsLockWarning}
                                                                className="animate__animated animate__fadeIn"
                                                            >
                                                                <Iconify icon="eva:keyboard" size="small" />

                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                          setShowPassword(!showPassword);
                                                        }}
                                                    >
                                                        {showPassword
                                                          ? <Iconify
                                                                icon="eva:eye-off-outline"
                                                            />
                                                          : <Iconify
                                                                icon="eva:eye-outline"
                                                            />}                          </IconButton>
                                                </InputAdornment>
                                          ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className="flex">
                                    <LoadingButton variant="contained" type="submit" loading={changePasswordLoading}>
                                        Submit
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Form>
        </FormProvider>
  );
};

export default PasswordForm;
