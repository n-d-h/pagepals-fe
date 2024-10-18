import PropTypes from 'prop-types';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';

import { usePathname } from '../../../components/hooks/use-pathname';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Scrollbar from '../../../components/scrollbar';
import NavSectionVertical from '../../../components/shadcn-ui/nav-section/vertical/nav-section-vertical';
import { NAV } from '../../../components/theme/config-layout';
import { selectUser } from '../../../redux/slices/authSlice';
import { useNavDataReader } from './useNavData';
// ----------------------------------------------------------------------

export default function ReaderNavVertical ({ openNav, onCloseNav }) {
  const user = useSelector(selectUser);

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavDataReader();

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

			<NavSectionVertical
				data={navData}
				slotProps={{
				  currentRole: user?.role?.name,
				}}
			/>
		</Scrollbar>
  );

  return (
		<Box
			sx={{
			  flexShrink: { lg: 0 },
			  width: { lg: NAV.W_VERTICAL },
			}}
		>
			{lgUp
			  ? (
					<Stack
						sx={{
						  height: 1,
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

ReaderNavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
