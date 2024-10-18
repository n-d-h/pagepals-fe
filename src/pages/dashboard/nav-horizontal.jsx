import { memo } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { useNavData } from './config-navigation';
import { HEADER } from '../../components/theme/config-layout';

import { bgBlur } from '../../components/theme/css';
import Scrollbar from '../../components/shadcn-ui/scrollbar';
import NavSectionHorizontal from '../../components/shadcn-ui/nav-section/horizontal/nav-section-horizontal';
import HeaderShadow from '../../components/shadcn-ui/nav-section/header-shadow';

// ----------------------------------------------------------------------

function NavHorizontal () {
  const theme = useTheme();

  const user = useSelector(selectUser);

  const navData = useNavData();

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData}
            slotProps={{
              currentRole: user?.role?.name,
            }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
