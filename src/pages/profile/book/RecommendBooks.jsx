import { Box, Typography } from '@mui/material';
import React from 'react';
import ReaderBookCard from '../reader/ReaderBookCard';

const RecommendBooks = (props) => {
  return (
		<>
			<Typography variant="h4">Similar Books</Typography>
			{/* <Box
				sx={{
				  width: '100%',
				  display: 'flex',
				  flexDirection: 'row',
				  justifyContent: 'center',
				  alignItems: 'center',
				  mt: 2,
				  gap: 2,
				  flexWrap: 'wrap',
				}}
			>
				{recommendBooks.map((book) => (
					<Box
						key={book}
						sx={{
						  width: '100%',
						  height: '100%',
						  bgcolor: 'white',
						  borderRadius: 3,
						}}
					>
						<ReaderBookCard book={book} />
					</Box>
				))}
			</Box> */}
		</>
  );
};

RecommendBooks.propTypes = {};

export default RecommendBooks;
