import { Avatar, Badge, Box, Button, IconButton, SwipeableDrawer, Typography } from '@mui/material';
import React, { useState } from 'react';
import logo from '../../../assets/logo.png';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Iconify from '../../../components/iconify';
import AccountPopover from '../../profile/account/AccountPopover';
import NotificationView from '../notification/NotificationView';
import MainNavbar from './navbar/MainNavbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/authSlice';
import { useQuery } from '@apollo/client';
import { getNotificationByUser } from '../../../services/apolo/queries';
import { useNavigate } from 'react-router';
import { paths } from '../../../components/router/paths';

const MainHeader = () => {
	const mdUp = useResponsive('up', 'md');

	const [drawerState, setDrawerState] = useState(false);

	const openDrawer = () => {
		setDrawerState(true);
	};

	const closeDrawer = () => {
		refetch();
		setDrawerState(false);
	};

	const userProfile = useSelector(selectUser);
	const isAuthenticated = !!userProfile;
	const isReader = _.get(userProfile, 'role.name') === 'READER';
	const { data, refetch } = useQuery(getNotificationByUser, {
		variables: {
			id: _.get(userProfile, 'id', ''),
			role: isReader ? 'READER' : 'CUSTOMER',
			page: 1,
			pageSize: 1,
		},
		fetchPolicy: 'no-cache',
	});

	const navigate = useNavigate();

	return (
		<Box sx={{
			// borderBottom: 1,
			// borderColor: 'divider',
			// borderStyle: 'solid',
			// boxShadow: '0px 3px 0px 0px rgba(0,0,0,0.2)',
			// backgroundColor: 'darkslategray',
			background: 'linear-gradient(90deg, darkslategray, #1DBF73)',
			py: 2,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row'
		}}>
			<SwipeableDrawer
				anchor="right"
				open={drawerState}
				sx={{
					zIndex: (theme) => theme?.zIndex?.drawer + 100,
					height: '100%',
				}}
				ModalProps={{
					keepMounted: false,
				}}
				onClose={closeDrawer}
				onOpen={openDrawer}
			>
				<NotificationView />
			</SwipeableDrawer>
			<Box
				sx={{
					width: '90%',
					height: '10vh',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					px: 8,
					py: 4,
					// bgcolor: 'white',
				}}
			>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'start',
						gap: 2,
						cursor: 'pointer',
					}}
					onClick={() => {
						isAuthenticated ? window.location.href = '/main' : window.location.href = '/guest';
					}}
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
							textShadow: '2px 2px 2px #000000',
						}}
					>
						PagePals
					</Typography>
				</Box>

				{mdUp && <MainNavbar />}

				{isAuthenticated
					? (
						<Box sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 4,
						}}>

							<IconButton
								onClick={() => {
									openDrawer();
								}}
								sx={{
									color: '#1DBF73',
									backgroundColor: 'white',
									boxShadow: '0px 3px 0px 0px rgba(0,0,0,0.2)',
								}}>
								<Badge
									badgeContent={
										_.get(data, 'getAllNotificationsByAccountId.total', 0)
									}
									color="error"
								>
									<Iconify icon="bx:bxs-bell" width={24} height={24} />
								</Badge>
							</IconButton>

							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<AccountPopover />
							</Box>
						</Box>
					)
					: (
						<Button variant='contained' color='primary' onClick={() => {
							navigate(paths.auth.login);
						}}>
							Log in
						</Button>

					)}

			</Box>
		</Box>
	);
};

const MemoizedMainHeader = React.memo(MainHeader);
export default MemoizedMainHeader;
