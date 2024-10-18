import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const Iconify = forwardRef(({ icon, width, sx, ...other }, ref) => (
	<Box
		ref={ref}
		component={Icon}
		className="component-iconify"
		icon={icon}
		sx={{ width, height: width, ...sx }}
		{...other}
	/>
));

Iconify.displayName = 'Iconify';

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  width: PropTypes.number,
};

Iconify.defaultProps = {
  width: 20,
};

export default Iconify;
