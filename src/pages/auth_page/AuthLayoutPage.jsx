import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import signInIllustration from '../../assets/auth/sign_in_illustration.png';

import { Button, Grid } from '@mui/material';
import { m } from 'framer-motion';
import logo from '../../assets/logo.png';
import { varBounce } from '../../components/animate/variants';
import { useResponsive } from '../../components/hooks/use-responsive';
import { useSelector } from 'react-redux';
import { selectUser, selectUserAuthenticated } from '../../redux/slices/authSlice';
import { useRouter } from '../../components/hooks/use-router';
import { paths } from '../../components/router/paths';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function AuthClassicLayout ({ children, image }) {
  const lgUp = useResponsive('up', 'lg');

  const isAuthenticated = useSelector(selectUserAuthenticated);

  const userProfile = useSelector(selectUser);

  const isStaffOrAdmin = userProfile?.role?.name === 'STAFF' || userProfile?.role?.name === 'ADMIN';

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
	  if (isStaffOrAdmin) {
        router.replace(paths.dashboard.root);
	  } else {
        router.replace(paths.main.root);
	  }
    }
  }
  , [isAuthenticated]);

  const renderContent = (
		<Stack
			sx={{
			  width: 1,
			  mx: 'auto',
			  maxWidth: 600,
			  px: { xs: 2, md: 8 },
			  pt: { xs: 15, md: 20 },
			  pb: { xs: 15, md: 0 },
			}}
		>
			{children}
		</Stack>
  );

  const renderSection = (
		<Box
			component="img"
			alt="auth"
			src={image || signInIllustration}
			loading="lazy"
		/>
  );

  return (
		<Box
			sx={{
			  bgcolor: 'white',
			}}
		>
			<Grid container>
				<Grid item xs={12}>
					<Box
						sx={{
						  height: '10vh',
						  display: 'flex',
						  alignItems: 'center',
						  justifyContent: 'space-between',
						  px: 10,
						}}
					>
						<Box
							onClick={() => {
							  window.location.href = '/';
							}}
							component="img"
							alt="auth"
							src={logo}
							sx={{
							  cursor: 'pointer',
							}}
							loading="lazy"
						/>
						<Box
							sx={{
							  display: 'flex',
							  alignItems: 'center',
							  gap: 2,
							}}
						>
							<Button
								color="primary"
								size="large"
								sx={{
								  fontSize: '1.1rem',
								}}
							>
								Contact
							</Button>
						</Box>
					</Box>
				</Grid>
				{lgUp && (
					<Grid
						item
						xs={12}
						md={7}
						sx={{
						  display: 'flex',
						  alignItems: 'center',
						  justifyContent: 'center',
						  height: '90vh',
						}}
					>
						<m.div variants={varBounce().in}>{renderSection}</m.div>
					</Grid>
				)}
				<Grid
					item
					xs={12}
					lg={5}
					sx={{
					  display: 'flex',
					  alignItems: 'center',
					  flexDirection: 'column',
					  height: '90vh',
					}}
				>
					{renderContent}
				</Grid>
			</Grid>
		</Box>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
