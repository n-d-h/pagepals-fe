import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { selectUser } from '../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { useNavData } from './config-navigation';
import { NAV } from '../../components/theme/config-layout';

import { hideScroll } from '../../components/theme/css';
import Iconify from '../../components/iconify';
import NavSectionMini from '../../components/shadcn-ui/nav-section/mini/nav-section-mini';
import NavToggleButton from '../../components/shadcn-ui/nav-section/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini () {
  const user = useSelector(selectUser);

  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        {/* <Logo sx={{ mx: 'auto', my: 2 }} /> */}
        <Iconify icon="eva:menu-outline" width={20} height={20} />

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role?.name,
          }}
        />
      </Stack>
    </Box>
  );
}
