import PropTypes from 'prop-types';

import { useTheme } from '@emotion/react';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useResponsive } from '../../components/hooks/use-responsive';
import AccountPopover from '../profile/account/AccountPopover';

import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HEADER, NAV } from '../../components/theme/config-layout';
import { bgBlur } from '../../components/theme/css';
import { useOffSetTop } from '../../components/theme/use-off-set-top';

import logo from '../../assets/logo.png';

// ----------------------------------------------------------------------

export default function Header ({ onOpenNav }) {
  const theme = useTheme();

  // const settings = useSettingsContext();

  const isNavHorizontal = false;

  const isNavMini = false;

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const navigate = useNavigate();

  const renderContent = (
		<>
			{lgUp && isNavHorizontal && (
				<IconButton
					sx={{
					  mr: 1,
					  ...(offsetTop && {
					    bgcolor: 'background.default',
					    color: 'text.primary',
					    boxShadow: (theme) => theme.customShadows.z8,
					    '&:hover': { bgcolor: 'background.default' },
					  }),
					}}
					onClick={onOpenNav}
				>
					<Box
						onClick={() => {
						  navigate('/');
						}}
						component="img"
						alt="auth"
						src={logo}
						sx={{
						  cursor: 'pointer',
						}}
						loading="lazy"
					/>
				</IconButton>
			)}

			{!lgUp && (
				<IconButton onClick={onOpenNav}>
					<Box
						onClick={() => {
						  navigate('/');
						}}
						component="img"
						alt="auth"
						src={logo}
						sx={{
						  cursor: 'pointer',
						}}
						loading="lazy"
					/>
				</IconButton>
			)}

			{/* <Searchbar /> */}

			<Stack
				flexGrow={1}
				direction="row"
				alignItems="center"
				justifyContent="flex-end"
				spacing={{ xs: 0.5, sm: 1 }}
				paddingTop={{ xs: 1, sm: 3 }}
			>
				{/* <LanguagePopover /> */}

				{/* <NotificationsPopover /> */}

				{/* <ContactsPopover /> */}

				{/* <SettingsButton /> */}

				<AccountPopover />
			</Stack>
		</>
  );

  return (
		<AppBar
			sx={{
			  height: HEADER.H_MOBILE,
			  zIndex: theme.zIndex.appBar + 1,
			  ...bgBlur({
			    color: theme.palette.background.default,
			  }),
			  transition: theme.transitions.create(['height'], {
			    duration: theme.transitions.duration.shorter,
			  }),
			  ...(lgUp && {
			    width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
			    height: HEADER.H_DESKTOP,
			    ...(offsetTop && {
			      height: HEADER.H_DESKTOP_OFFSET,
			    }),
			    ...(isNavHorizontal && {
			      width: 1,
			      bgcolor: 'background.default',
			      height: HEADER.H_DESKTOP_OFFSET,
			      borderBottom: `dashed 1px ${theme.palette.divider}`,
			    }),
			    ...(isNavMini && {
			      width: `calc(100% - ${NAV.W_MINI + 1}px)`,
			    }),
			  }),
			}}
		>
			<Toolbar
				sx={{
				  height: 1,
				  px: { lg: 5 },
				}}
			>
				{renderContent}
			</Toolbar>
		</AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
