import { Box, Button, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
import { useResponsive } from '../../components/hooks/use-responsive';
import Iconify from '../../components/iconify/iconify';
import { paths } from '../../components/router/paths';
import RouterLink from '../../components/router/router-link';
import { selectUserAuthenticated } from '../../redux/slices/authSlice';
import { useEffect } from 'react';

const LandingHeader = () => {
  const isAuthenticated = useSelector(selectUserAuthenticated);

  const navigate = useNavigate();

  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    if (isAuthenticated) {
	  navigate(paths.main.root);
    }
  }
  , [isAuthenticated, navigate]);

  return (
		<Box
			sx={{
			  mx: mdUp ? 30 : 2,
			  pb: 2,
			}}
		>
			<Grid
				container
				justifyContent={'space-between'}
				alignItems={'center'}
				spacing={!mdUp && 4}
			>
				<Grid item xs={12} md="auto">
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
				</Grid>
				{mdUp && <Grid item flexGrow={1}></Grid>}

				<Grid item xs={12} md={'auto'}>
					{!isAuthenticated
					  ? (
						<Box
							sx={{
							  display: 'flex',
							  justifyContent: 'space-evenly',
							  alignItems: 'center',
							  gap: 2,
							}}
						>
							<Button color="primary"
							onClick={() => {
							  navigate('/guest');
							  }}
							>View as guests</Button>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => {
								  navigate('/auth/login');
								}}
							>
								Sign In
							</Button>
							<Button
								variant="contained"
								startIcon={<Iconify icon="ion:rocket-outline" width={24} />}
								color="primary"
								onClick={() => {
								  navigate('/auth/register');
								}}
							>
								Sign Up
							</Button>
						</Box>
					    )
					  : (
						<Box
							sx={{
							  display: 'flex',
							  justifyContent: 'space-evenly',
							  alignItems: 'center',
							  gap: 2,
							}}
						>
							<Button color="primary">Contact Us</Button>

							<Button
								variant="contained"
								href={paths.main.root}
								component={RouterLink}
								startIcon={<Iconify icon="ion:rocket-outline" width={24} />}
								color="primary"
								sx={{
								  ':hover': {
								    backgroundColor: 'primary.dark',
								    color: 'primary.contrastText',
								  },
								}}
							>
								Home
							</Button>
						</Box>
					    )}
				</Grid>
			</Grid>
		</Box>
  );
};

export default LandingHeader;
