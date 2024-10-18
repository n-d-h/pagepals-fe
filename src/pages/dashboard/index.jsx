import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { useResponsive } from '../../components/hooks/use-responsive';
import { useBoolean } from '../../components/hooks/use-boolean';
import Header from './header';
import Main from './main';
import NavMini from './nav-mini';
import NavHorizontal from './nav-horizontal';
import NavVertical from './nav-vertical';

// ----------------------------------------------------------------------

export default function DashboardLayout ({ children }) {
  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = false;

  const isMini = false;

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
		<NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
  );

  if (isHorizontal) {
    return (
			<>
				<Header onOpenNav={nav.onTrue} />

				{lgUp ? renderHorizontal : renderNavVertical}

				<Main>{children}</Main>
			</>
    );
  }

  if (isMini) {
    return (
			<>
				<Header onOpenNav={nav.onTrue} />

				<Box
					sx={{
					  minHeight: 1,
					  display: 'flex',
					  flexDirection: { xs: 'column', lg: 'row' },
					}}
				>
					{lgUp ? renderNavMini : renderNavVertical}

					<Main>{children}</Main>
				</Box>
			</>
    );
  }

  return (
		<>
			<Header onOpenNav={nav.onTrue} />

			<Box
				sx={{
				  minHeight: 1,
				  display: 'flex',
				  flexDirection: { xs: 'column', lg: 'row' },
				}}
			>
				{renderNavVertical}

				<Main>{children}</Main>
			</Box>
		</>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
