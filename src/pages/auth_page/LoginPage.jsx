import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import MotionContainer from '../../components/animate/motion-container';
import { varBounce, varFade } from '../../components/animate/variants';
import { handleFriendlyError } from '../../components/common_services/CommonServices';
import FormProvider from '../../components/hook-form/form-provider';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import { useBoolean } from '../../components/hooks/use-boolean';
import Iconify from '../../components/iconify';
import { paths } from '../../components/router/paths';
import RouterLink from '../../components/router/router-link';
import {
  loginWithFacebookThunk,
  loginWithGoogleThunk,
  setLoginInternal,
} from '../../redux/slices/authSlice';
import { LOGIN_MUTATION } from '../../services/apolo/mutations';

const LoginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const password = useBoolean();
  const methods = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(LoginSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginWithGoogle = async () => {
    const result = await dispatch(loginWithGoogleThunk());

    if (result) {
      navigate(paths.main.root);
    }
  };

  const {
    handleSubmit,
  } = methods;

  const [loginInternal, { loading }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      console.log(error, _.get(error, 'graphQLErrors[0].extensions.status'));
      handleFriendlyError(error, 'Login failed');
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Execute the mutation
      const response = await loginInternal({
        variables: {
          username: data.username,
          password: data.password,
        },
      });

      if (response) {
        const { login } = response.data;

        if (login) {
          await dispatch(setLoginInternal(login));
          navigate(paths.main.root);
        }
      }

      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {}
  });

  const renderHead = (
		<Stack spacing={2} sx={{ mb: 5 }}>
			<Typography variant="h3">Sign in to PagePals</Typography>

			<Stack direction="row" spacing={0.5}>
				<Typography variant="body2">New user?</Typography>

				<Link
					component={RouterLink}
					href={paths.auth.register}
					variant="subtitle2"
				>
					Create an account
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

			<m.div variants={varFade().in}>
				<Link
					variant="body2"
					component={RouterLink}
					href={paths.auth.forgotPassword}
					color="inherit"
					underline="always"
					sx={{ alignSelf: 'flex-end' }}
				>
					Forgot password?
				</Link>
			</m.div>

			<m.div variants={varBounce().in}>
				<LoadingButton
					fullWidth
					color="primary"
					size="large"
					type="submit"
					variant="contained"
					loading={loading}
				>
					Login
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
					Login with Google
				</LoadingButton>
			</m.div>

			<m.div variants={varFade().in}>
				<Stack direction="row" spacing={0.5}>
					<Typography variant="body2">Internal user?</Typography>

					<Link
						component={RouterLink}
						href={paths.auth.internalLogin}
						variant="subtitle2"
					>
						Login Here
					</Link>
				</Stack>
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

export default LoginPage;
