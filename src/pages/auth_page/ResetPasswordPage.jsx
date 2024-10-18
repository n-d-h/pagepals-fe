import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';
import SentIcon from '../../assets/auth/sent-icon';
import FormProvider from '../../components/hook-form/form-provider';
import RHFCode from '../../components/hook-form/rhf-code';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import { useBoolean } from '../../components/hooks/use-boolean';
import { useCountdownSeconds } from '../../components/hooks/use-countdown';
import { useRouter } from '../../components/hooks/use-router';
import Iconify from '../../components/iconify';
import { paths } from '../../components/router/paths';
import RouterLink from '../../components/router/router-link';
import MotionContainer from '../../components/animate/motion-container';
import { m } from 'framer-motion';
import { varBounce } from '../../components/animate/variants';

// ----------------------------------------------------------------------

export default function ResetPasswordPage () {
  const location = useLocation();
  const { email } = location.state;

  const router = useRouter();

  const password = useBoolean();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    code: Yup.string()
      .min(6, 'Code must be at least 6 characters')
      .required('Code is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    code: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      // await newPassword?.(data.email, data.code, data.password);

      router.push(paths.auth.login);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      // await forgotPassword?.(values.email);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const renderForm = (
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
					<RHFTextField
						name="email"
						label="Email"
						placeholder="example@gmail.com"
						InputLabelProps={{ shrink: true }}
					/>
				</m.div>

				<m.div
					variants={varBounce().in}
					style={{
					  width: '100%',
					}}
				>
					<RHFCode name="code" />
				</m.div>

				<m.div
					variants={varBounce().in}
					style={{
					  width: '100%',
					}}
				>
					<RHFTextField
						name="password"
						label="Password"
						type={password.value ? 'text' : 'password'}
						InputProps={{
						  endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={password.onToggle} edge="end">
										<Iconify
											icon={
												password.value
												  ? 'solar:eye-bold'
												  : 'solar:eye-closed-bold'
											}
										/>
									</IconButton>
								</InputAdornment>
						  ),
						}}
					/>
				</m.div>
				<m.div
					variants={varBounce().in}
					style={{
					  width: '100%',
					}}
				>
					<RHFTextField
						name="confirmPassword"
						label="Confirm New Password"
						type={password.value ? 'text' : 'password'}
						InputProps={{
						  endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={password.onToggle} edge="end">
										<Iconify
											icon={
												password.value
												  ? 'solar:eye-bold'
												  : 'solar:eye-closed-bold'
											}
										/>
									</IconButton>
								</InputAdornment>
						  ),
						}}
					/>
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
						type="submit"
						variant="contained"
						loading={isSubmitting}
					>
						Update Password
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
						  display: 'inline-flex',
						}}
					>
						<Iconify icon="eva:arrow-ios-back-fill" width={16} />
						Return to sign in
					</Link>
				</m.div>
			</Stack>
		</Box>
  );

  return (
		<FormProvider methods={methods} onSubmit={onSubmit}>
			<MotionContainer>
				<Box
					sx={{
					  width: '100%',
					  display: 'flex',
					  alignItems: 'center',
					  justifyContent: 'center',
					  flexDirection: 'column',
					  mt: -10,
					}}
				>
					<HeaderVerify />

					{renderForm}
				</Box>
			</MotionContainer>
		</FormProvider>
  );
}

export const HeaderVerify = () => {
  return (
		<Box
			sx={{
			  display: 'flex',
			  flexDirection: 'column',
			  alignItems: 'center',
			  justifyContent: 'center',
			}}
		>
			<m.div
				variants={varBounce().in}
				style={{
				  width: '100%',
				}}
			>
				<SentIcon sx={{ height: 96 }} />
			</m.div>

			<m.div
				variants={varBounce().in}
				style={{
				  width: '100%',
				}}
			>
				<Stack
					spacing={1}
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: 'center',
					  justifyContent: 'center',
					  my: 5,
					}}
				>
					<Typography variant="h3">Request sent successfully!</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						We&apos;ve sent a 6-digit confirmation email to your email.
						<br />
						Please enter the code in below box to verify your email.
					</Typography>
				</Stack>
			</m.div>
		</Box>
  );
};
