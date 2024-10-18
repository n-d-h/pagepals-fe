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
import * as yup from 'yup';
import MotionContainer from '../../components/animate/motion-container';
import { varBounce, varFade } from '../../components/animate/variants';
import FormProvider from '../../components/hook-form/form-provider';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import { useBoolean } from '../../components/hooks/use-boolean';
import Iconify from '../../components/iconify';
import { paths } from '../../components/router/paths';
import RouterLink from '../../components/router/router-link';
import { gql, useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { setLoginInternal } from '../../redux/slices/authSlice';
import { setActive } from '../../redux/slices/loadingSlice';
import { showNotification } from '../../components/common_services/CommonServices';
import { useNavigate } from 'react-router';

const LOGIN_MUTATION = gql`
	mutation LoginInternally($username: String!, $password: String!) {
		login(account: { username: $username, password: $password }) {
			accessToken
			refreshToken
		}
	}
`;

const InternalLoginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const InternalLoginPage = () => {
  const password = useBoolean();
  const methods = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(InternalLoginSchema),
  });

  const dispatch = useDispatch();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const navigate = useNavigate();

  const [loginInternal, { loading }] = useMutation(LOGIN_MUTATION);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Execute the mutation
      const response = await loginInternal({
        variables: {
          username: data.username,
          password: data.password,
        },
      });

      if (loading) {
        dispatch(setActive(true));
      }

      if (response) {
        const { login } = response.data;

        if (login) {
          await dispatch(setLoginInternal(login));
          navigate(paths.dashboard.root);
        }
      }

      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      showNotification('error', 'Login failed');
      reset();
      // setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
		<Stack spacing={2} sx={{ mb: 5 }}>
			<Typography variant="h3">Staff Sign In</Typography>
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

			<m.div variants={varBounce().in}>
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
					loading={isSubmitting}
				>
					Login
				</LoadingButton>
			</m.div>

			<Stack direction="row" spacing={0.5}>
				<Typography variant="body2">Not a staff here?</Typography>

				<Link
					component={RouterLink}
					href={paths.auth.login}
					variant="subtitle2"
				>
					Login Here
				</Link>
			</Stack>
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

export default InternalLoginPage;
