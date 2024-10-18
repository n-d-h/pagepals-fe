import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../components/router/paths';
import PropTypes from 'prop-types';

const ReaderBookCard = ({ book, option, wrapperStyles }) => {
  const navigate = useNavigate();
  const navigateToBook = () => {
    navigate(paths.main.book(book.id));
  };
  return (
		<Box
			sx={{
			  width: '100%',
			  height: '100%',
			  display: 'flex',
			  justifyContent: 'space-between',
			  alignItems: 'center',
			  p: 4,
			  ...wrapperStyles,
			}}
		>
			<Box
				sx={{
				  display: 'flex',
				  flexDirection: 'row',
				  justifyContent: 'flex-start',

				}}
			>
				<Box
					sx={{
					  height: 100,
					  alignSelf: 'start',
					}}
					component={'img'}
					alt="book cover"
					src={_.get(book, 'cover') || _.get(book, 'thumbnailUrl')}
				></Box>
				<Box
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: 'flex-start',
					  ml: 2,
					}}
				>
					<Typography variant="h4" fontWeight={500}>
						{_.get(book, 'title')}
					</Typography>
					<Typography variant="body2" fontWeight={400} color={'GrayText'}>
						{_.get(book, 'language')}
					</Typography>
				</Box>
			</Box>

			{option === 'view' && (<Button variant="contained" color="primary" onClick={navigateToBook}>
				View
			</Button>)}

		</Box>
  );
};

export default ReaderBookCard;

ReaderBookCard.propTypes = {
  book: PropTypes.object,
  option: PropTypes.string,
  wrapperStyles: PropTypes.object,
};

ReaderBookCard.defaultProps = {
  option: 'view',
};
