import { Box } from '@mui/material';
import React from 'react';
import ReaderProfile from './reader/ReaderProfile';

const UserProfile = ({ role, isGuest = false }) => {
  switch (role) {
    case 'reader':
      return <ReaderProfile isGuest={isGuest}/>;
    default:
      return <ReaderProfile isGuest={isGuest}/>;
  }
};

const UserProfilePage = () => {
  // const userRole = useSelector(selectUserRole || "reader");
  const userRole = 'reader';

  return <Box sx={{ height: '100%' }}>{UserProfile(userRole)}</Box>;
};

export default UserProfilePage;
