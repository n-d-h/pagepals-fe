/* eslint-disable no-unused-vars */
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { Box, FormHelperText, Stack, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { MuiOtpInput } from 'mui-one-time-password-input';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import MotionContainer from '../../components/animate/motion-container';
import { varBounce } from '../../components/animate/variants';
import { decodeVerificationCode, handleFriendlyError, showNotification } from '../../components/common_services/CommonServices';
import { useCountdownSeconds } from '../../components/hooks/use-countdown';
import Iconify from '../../components/iconify';
import { paths } from '../../components/router/paths';
import RouterLink from '../../components/router/router-link';
import { setAccessToken } from '../../redux/slices/authSlice';
import { registerAccount, verifyAccount } from '../../services/apolo/mutations';
import BackdropLoading from '../backdrop_loading/BackdropLoading';
import { HeaderVerify } from './ResetPasswordPage';

const Verify = () => {
  const location = useLocation();

  const code = _.get(location, 'state.code', '');
  const username = _.get(location, 'state.username', '');
  const email = _.get(location, 'state.email', '');
  const password = _.get(location, 'state.password', '');
  const dispatch = useDispatch();

  const [currentCode, setCurrentCode] = useState(code);

  const [submitCode, setSubmitCode] = useState('');

  const [resendCode, { loading, error }] = useMutation(registerAccount);

  const [errorCode, setErrorCode] = useState(false);

  const [register, { loading: registerLoading, error: registerError }] = useMutation(verifyAccount);

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const navigate = useNavigate();

  const handleResendCode = async () => {
    const res = await resendCode({
      variables: {
        register: {
          email,
          username,
          password,
        },
      },
    });

    showNotification('success', 'Code resent successfully');
    setCurrentCode(decodeVerificationCode(res.data.verifyEmailRegister));
  };

  const handleRegister = async (data) => {
    if (submitCode !== currentCode) {
      setErrorCode(true);
      return;
    }

    setErrorCode(false);
    const res = await register({
      variables: {
        register: {
          email,
          username,
          password,
        },
      },
    });

    if (res.data) {
      localStorage.setItem('accessToken', _.get(res, 'data.register.accessToken', ''));
      dispatch(setAccessToken(_.get(res, 'data.register.accessToken', '')));
      showNotification('success', 'Account verified successfully');
      navigate(paths.main.root);
    } else {
	  handleFriendlyError(registerError, 'Failed to verify account');
    }
  };

  return (
			<MotionContainer>
                {loading && <BackdropLoading/>}
				<Box
					sx={{
					  width: '100%',
					  display: 'flex',
					  alignItems: 'center',
					  justifyContent: 'center',
					  flexDirection: 'column',
					}}
				>
					<HeaderVerify />

                    <Box
			sx={{
			  display: 'flex',
			  flexDirection: 'column',
			  alignItems: 'center',
			  justifyContent: 'center',
			}}
		>
			<Stack spacing={3} alignItems="center">

				<m.div
					variants={varBounce().in}
					style={{
					  width: '100%',
					}}
				>
					<div>
          <MuiOtpInput
            value={submitCode}
            onChange={(value) => setSubmitCode(value)}
            autoFocus
            gap={1.5}
            length={6}
            TextFieldsProps={{
              error: errorCode,
              placeholder: '-',
            }}

          />

          {errorCode && (
            <FormHelperText sx={{ px: 2 }} error>
                Invalid code
            </FormHelperText>
          )}
        </div>
				</m.div>

				<m.div
					variants={varBounce().in}
					style={{
					  width: '100%',
					}}
				>
					<LoadingButton
						fullWidth
						size="large"
                        type="button"
						variant="contained"
						loading={registerLoading}
                        onClick={handleRegister}
					>
						Send Code
					</LoadingButton>
				</m.div>
				<m.div variants={varBounce().in}>
					<Typography variant="body2">
						{'Don’t have a code? '}
						<Link
							variant="subtitle2"
							onClick={handleResendCode}
							sx={{
							  cursor: 'pointer',
							  ...(counting && {
							    color: 'text.disabled',
							    pointerEvents: 'none',
							  }),
							}}
						>
							Resend code {counting && `(${countdown}s)`}
						</Link>
					</Typography>
				</m.div>
				<m.div variants={varBounce().in}>
					<Link
						component={RouterLink}
						href={paths.auth.login}
						color="inherit"
						variant="subtitle2"
						sx={{
						  alignItems: 'center',
						  display: 'flex',
						}}
					>
						<Box sx={{ mr: 1 }} className='flex'>
						<Iconify icon="eva:arrow-ios-back-fill" width={16} />
						<div>Return to sign in</div>
						</Box>
					</Link>
				</m.div>
			</Stack>
		</Box>
				</Box>
			</MotionContainer>
  );
};

export default Verify;
