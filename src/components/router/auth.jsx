/* eslint-disable no-unused-vars */
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import forgotPassword from '../../assets/auth/forgot_password.png';
import internalSignInIllustration from '../../assets/auth/internal_sign_in.png';
import signUpIllustration from '../../assets/auth/sign_up.png';
import AuthClassicLayout from '../../pages/auth_page/AuthLayoutPage';
import ForgotPasswordPage from '../../pages/auth_page/ForgotPasswordPage';
import InternalLoginPage from '../../pages/auth_page/InternalLoginPage';
import LoginPage from '../../pages/auth_page/LoginPage';
import RegisterPage from '../../pages/auth_page/RegisterPage';
import ResetPasswordPage from '../../pages/auth_page/ResetPasswordPage';
import Verify from '../../pages/auth_page/Verify';
// ----------------------------------------------------------------------

// JWT
// const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
// const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
			<Suspense fallback={<></>}>
				<Outlet />
			</Suspense>
    ),
    children: [
      {
        path: 'login',
        element: (
					<AuthClassicLayout>
						<LoginPage />
					</AuthClassicLayout>
        ),
      },
      {
        path: 'register',
        element: (
					<AuthClassicLayout image={signUpIllustration}>
						<RegisterPage />
					</AuthClassicLayout>
        ),
      },
      {
        path: 'internal-login',
        element: (
					<AuthClassicLayout image={internalSignInIllustration}>
						<InternalLoginPage />
					</AuthClassicLayout>
        ),
      },
      {
        path: 'forgot-password',
        element: (
					<AuthClassicLayout image={forgotPassword}>
						<ForgotPasswordPage />
					</AuthClassicLayout>
        ),
      },
      {
        path: 'reset-password',
        element: (
					<AuthClassicLayout image={forgotPassword}>
						<ResetPasswordPage />
					</AuthClassicLayout>
        ),
      },
      {
        path: 'verify',
        element: (
          <AuthClassicLayout>
            <Verify />
          </AuthClassicLayout>
        ),
      },
    ],
  },
];
