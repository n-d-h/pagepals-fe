/* eslint-disable no-unused-vars */
import { Navigate, useRoutes } from 'react-router-dom';

import { Page404 } from '../../pages/Page404';
import LandingPage from '../../pages/landing_page/LandingPage';
import MeetingZoomScreen from '../../pages/main/meeting/MeetingZoomScreen';
import { authRoutes } from './auth';
import { guestRoutes } from './customer';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------

export const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/landing" replace />,
    },

    // Main routes
    ...mainRoutes,

    // No match 404

    {
      path: 'landing',
      element: <LandingPage />,
    },

    ...guestRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Auth routes
    ...authRoutes,

    {
      path: 'meeting-zoom',
      children: [
        { path: ':id/:role/detail', element: <MeetingZoomScreen /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
    { path: '404', element: <Page404 /> },
  ]);
};
