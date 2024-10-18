import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

const RouterLink = forwardRef(function RouterLink ({ href, ...other }, ref) {
  return <Link ref={ref} to={href} {...other} />;
});

RouterLink.propTypes = {
  href: PropTypes.string,
};

RouterLink.displayName = 'RouterLink';

export default RouterLink;
