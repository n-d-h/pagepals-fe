import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { usePathname } from '../../components/hooks/use-pathname';
import { useResponsive } from '../../components/hooks/use-responsive';
import NavToggleButton from '../../components/shadcn-ui/nav-section/nav-toggle-button';
import NavSectionVertical from '../../components/shadcn-ui/nav-section/vertical/nav-section-vertical';
import Scrollbar from '../../components/shadcn-ui/scrollbar';
import { NAV } from '../../components/theme/config-layout';
import { selectUser } from '../../redux/slices/authSlice';
import { useNavData } from './config-navigation';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo.png';
import { paths } from '../../components/router/paths';
import { Avatar, Typography } from '@mui/material';
// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
	const user = useSelector(selectUser);

	const pathname = usePathname();

	const lgUp = useResponsive('up', 'lg');

	const navData = useNavData();

	const navigate = useNavigate();

	useEffect(() => {
		if (openNav) {
			onCloseNav();
		}
	}, [pathname]);

	const renderContent = (
		<Scrollbar
			sx={{
				height: 1,
				'& .simplebar-content': {
					height: 1,
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			{/* <Logo sx={{ mt: 3, ml: 4, mb: 1 }} /> */}
			<Box
				onClick={() => {
					navigate(paths.dashboard.root);
				}}
				// component="img"
				// alt="auth"
				// src={logo}
				sx={{
					cursor: 'pointer',
					mt: 3,
					ml: 4,
					mb: 1,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'start',
					gap: 2
					//   width: 60,
					//   height: 60,
				}}
			// loading="lazy"
			>
				<Avatar
					// component="img"
					alt="auth"
					src={logo}
					variant="circular"
					bgcolor="#1DBF73"
					sx={{
						width: 60,
						height: 60,
					}}
				/>
				<Typography
					sx={{
						fontSize: 30,
						fontWeight: '600',
						color: '#1DBF73',
						fontFamily: 'Lilita One, cursive',
						textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)',
					}}
				>
					PagePals
				</Typography>
			</Box>

			<NavSectionVertical
				data={navData}
				slotProps={{
					currentRole: user?.role?.name,
				}}
			/>

			{/* <Box sx={{ flexGrow: 1 }} /> */}
		</Scrollbar>
	);

	return (
		<Box
			sx={{
				flexShrink: { lg: 0 },
				width: { lg: NAV.W_VERTICAL },
			}}
		>
			{/* <NavToggleButton /> */}

			{lgUp
				? (
					<Stack
						sx={{
							height: 1,
							position: 'fixed',
							width: NAV.W_VERTICAL,
							borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
						}}
					>
						{renderContent}
					</Stack>
				)
				: (
					<Drawer
						open={openNav}
						onClose={onCloseNav}
						PaperProps={{
							sx: {
								width: NAV.W_VERTICAL,
							},
						}}
					>
						{renderContent}
					</Drawer>
				)}
		</Box>
	);
}

NavVertical.propTypes = {
	openNav: PropTypes.bool,
	onCloseNav: PropTypes.func,
};
