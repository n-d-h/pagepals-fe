/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React from 'react';
import { useResponsive } from '../../../components/hooks/use-responsive';
import TopReader from '../reader/TopReader';
import BookDetail from './BookDetail';
import RecommendBooks from './RecommendBooks';

const BookView = (props) => {
  const lg = useResponsive('up', 'lg');
  // call api so that it call the book detail
  return (
		<Box p={2} mx={lg ? 50 : 5} my={10}>
			<BookDetail />

			<Box
				sx={{
				  width: '100%',
				  mt: 5,
				}}
			>
				<TopReader />
			</Box>
		</Box>
  );
};

BookView.propTypes = {};

export default BookView;
