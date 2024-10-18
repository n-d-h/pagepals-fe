/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import RouterLink from '../../components/router/router-link';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import Iconify from '../../components/iconify';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/form-provider';
import { useBoolean } from '../../components/hooks/use-boolean';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { paths } from '../../components/router/paths';
import MotionContainer from '../../components/animate/motion-container';
import { m } from 'framer-motion';
import { varBounce, varFade } from '../../components/animate/variants';
import {
  loginWithFacebookThunk,
  loginWithGoogleThunk,
} from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { registerAccount } from '../../services/apolo/mutations';
import BackdropLoading from '../backdrop_loading/BackdropLoading';
import { decodeVerificationCode, handleFriendlyError, showNotification } from '../../components/common_services/CommonServices';

const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
      'Password must contain at least 8 characters, one uppercase letter, one number, and one special character',
    ),
  username: yup.string().required('Username is required'),
});

const RegisterPage = () => {
  const password = useBoolean();
  const methods = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(RegisterSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginWithGoogle = async () => {
    const result = await dispatch(loginWithGoogleThunk());

    if (result) {
      navigate(paths.main.root);
    }
  };

  const handleLoginWithFacebook = async () => {
    const result = dispatch(loginWithFacebookThunk());

    if (result) {
      navigate(paths.main.root);
    }
  };

  const [register, { loading }] = useMutation(registerAccount, {
    onError: (e) => {
	  handleFriendlyError(e, 'Register failed');
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await register({
        variables: {
          register: {
            email: data.email,
            password: data.password,
            username: data.username,
          },
        },
      });

	  if (res.data.verifyEmailRegister) {
        navigate(paths.auth.verify, {
          state: {
			  email: data.email,
			  password: data.password,
            	username: data.username,
			  code: decodeVerificationCode(res.data.verifyEmailRegister),
          },
		  });
	  }
    } catch (error) {
      reset();
      // setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
		<Stack spacing={2} sx={{ mb: 5 }}>
			<Typography variant="h3">Register to PagePals</Typography>

			<Stack direction="row" spacing={0.5}>
				<Typography variant="body2">Already have an account?</Typography>

				<Link
					component={RouterLink}
					href={paths.auth.login}
					variant="subtitle2"
				>
					Login an account
				</Link>
			</Stack>
		</Stack>
  );

  const renderForm = (
		<Stack spacing={2.5}>
			<m.div variants={varBounce().in}>
				<RHFTextField name="username" label="Username" />
			</m.div>

			<m.div variants={varBounce().in}>
				<RHFTextField name="email" label="Email address" />
			</m.div>

			<m.div variants={varBounce().in}>
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

				<m.div variants={varBounce().in}>
					<FormControlLabel
						control={<Checkbox name="terms" />}
						label={
							<Typography variant="body2">
								I agree to the {' '}
								<Link component={RouterLink} to={paths.termsOfService}>
									terms of service
								</Link>
							</Typography>
						}
					/>
				</m.div>

			<m.div variants={varBounce().in}>
				<LoadingButton
					fullWidth
					color="primary"
					size="large"
					variant="contained"
					type="submit"
					loading={loading || isSubmitting}
				>
					Register
				</LoadingButton>
			</m.div>

			<m.div variants={varBounce().in}>
				<LoadingButton
					startIcon={<Iconify icon="devicon:google" />}
					fullWidth
					color="primary"
					size="large"
					variant="outlined"
					loading={false}
					onClick={handleLoginWithGoogle}
				>
					Register with Google
				</LoadingButton>
			</m.div>
		</Stack>
  );

  return (
		<FormProvider methods={methods} onSubmit={onSubmit}>
			<MotionContainer>
				<m.div variants={varFade().in}>
					<Box
						sx={{
						  display: 'flex',
						  flexDirection: 'column',
						  justifyContent: 'center',
						  borderRadius: 1,
						  boxShadow: 3,
						  border: '1px solid',
						  borderColor: 'primary.main',
						  p: 5,
						}}
					>
						{renderHead}

						{renderForm}
					</Box>
				</m.div>
			</MotionContainer>
		</FormProvider>
  );
};

export default RegisterPage;
