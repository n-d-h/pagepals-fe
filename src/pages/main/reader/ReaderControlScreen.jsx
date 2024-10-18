import { Box } from '@mui/material';
import React from 'react';
import { useBoolean } from '../../../components/hooks/use-boolean';
import ReaderNavVertical from './ReaderVerticalNav';
import { Outlet } from 'react-router';

const ReaderControlScreen = () => {
	const nav = useBoolean();

	return (
		<Box
			sx={{
				display: 'flex',
				minHeight: '80vh',
				width: '100%',
			}}
		>
			<Box
				sx={{
					width: '15%',
					height: '100%',
				}}
			>
				<ReaderNavVertical openNav={nav.value} onCloseNav={nav.onFalse} />
			</Box>
			<Box
				sx={{
					width: '85%',
					height: '100%',
					mt: 2,
					px: 4,
					pb: 2,
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};

export default ReaderControlScreen;
