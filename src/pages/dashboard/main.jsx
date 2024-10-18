import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { useResponsive } from '../../components/hooks/use-responsive';
import { HEADER, NAV } from '../../components/theme/config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main ({ children, sx, ...other }) {
  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = 'horizontal';

  const isNavMini = 'mini';

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          pb: 10,
          ...(lgUp && {
            pb: 15,
            pt: 10,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 2,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
