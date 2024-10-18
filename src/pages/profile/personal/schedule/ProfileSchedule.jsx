import { Box } from '@mui/material';
import React from 'react';
import TableSchedule from './TableSchedule';

const ProfileSchedule = () => {
  return (
		<Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>
				<TableSchedule />
		</Box>
  );
};

export default ProfileSchedule;
