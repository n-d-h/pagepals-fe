import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router';
import MemoizedLandingFooter from '../../landing_page/LandingFooter';
import MemoizedMainHeader from './MainHeader';

const MainPageLayout = () => {
  const currentPath = window.location.pathname;

  if (currentPath.includes('/main/meeting-zoom')) {
    return (
      <Outlet />
    );
  }

  return (
    <Box
      bgcolor={'white'}
    >
      <MemoizedMainHeader />
      <Box sx={{ minHeight: '80vh' }}>
        <Outlet /> {/* This is where the child routes will render */}
      </Box>
      <MemoizedLandingFooter />
    </Box>
  );
};

export default MainPageLayout;

MainPageLayout.propTypes = {
  children: PropTypes.node,
};

MainPageLayout.defaultProps = {};
