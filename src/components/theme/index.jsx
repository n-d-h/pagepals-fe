import merge from 'lodash/merge';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';

// system
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
// options
import { customShadows } from './custom-shadows';
import { createContrast } from './options/contrast';
import { createPresets } from './options/presets';
import RTL from './options/right-to-left';
import { componentsOverrides } from './overrides';

// ----------------------------------------------------------------------

export default function ThemeProvider ({ children }) {
  const presets = createPresets('default');

  const contrast = createContrast('bold', 'light');

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette('light'),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows('light'),
        ...presets.customShadows,
      },
      direction: 'ltr',
      shadows: shadows('light'),
      shape: { borderRadius: 8 },
      typography,
    }),
    [presets.palette, presets.customShadows, contrast.palette],
  );

  const theme = createTheme(memoizedValue);

  theme.components = merge(componentsOverrides(theme), contrast.components);

  return (
		<MuiThemeProvider theme={theme}>
			<RTL themeDirection={'ltr'}>
				<CssBaseline />
				{children}
			</RTL>
		</MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
