import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Box } from '@mui/material';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router';
import PasswordIcon from '../../assets/auth/password-icon';
import MotionContainer from '../../components/animate/motion-container';
import { varBounce } from '../../components/animate/variants';
import FormProvider from '../../components/hook-form/form-provider';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import Iconify from '../../components/iconify';
import { paths } from '../../components/router/paths';
import RouterLink from '../../components/router/router-link';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage () {
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate(paths.auth.resetPassword, {
        state: {
          email: data.email,
        },
      });
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
		<m.div
			variants={varBounce().inUp}
			style={{
			  width: '100%',
			}}
		>
			<Box
				sx={{
				  display: 'flex',
				  flexDirection: 'column',
				  alignItems: 'center',
				  justifyContent: 'center',
				  gap: 4,
				  width: '100%',
				}}
			>
				<RHFTextField name="email" label="Email address" fullWidth />

				<LoadingButton
					fullWidth
					size="large"
					type="submit"
					variant="contained"
					loading={isSubmitting}
					endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
					sx={{ justifyContent: 'center', pl: 2, pr: 1.5 }}
				>
					Send Request
				</LoadingButton>

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
			</Box>
		</m.div>
  );

  const renderHead = (
		<m.div variants={varBounce().inDown}>
			<Box
				sx={{
				  display: 'flex',
				  flexDirection: 'column',
				  alignItems: 'center',
				  justifyContent: 'center',
				}}
			>
				<PasswordIcon sx={{ height: 96 }} />

				<Stack
					spacing={1}
					sx={{
					  my: 5,
					  display: 'flex',
					  flexDirection: 'column',
					  justifyContent: 'center',
					  alignItems: 'center',
					}}
				>
					<Typography variant="h3">Forgot your password?</Typography>

					<Typography
						variant="body2"
						sx={{ color: 'text.secondary' }}
						textAlign={'center'}
					>
						Please enter the email address associated with your account and We
						will email you a link to reset your password.
					</Typography>
				</Stack>
			</Box>
		</m.div>
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
					}}
				>
					{renderHead}

					{renderForm}
				</Box>
			</MotionContainer>
		</FormProvider>
  );
}
