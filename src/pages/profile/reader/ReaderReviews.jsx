import { useQuery } from '@apollo/client';
import { Avatar, Box, Button, Paper, Rating, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import { getReaderReviews } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const ReviewCard = ({ review }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        p: 2,
        mx: 'auto', // Center the card on the page
        bgcolor: 'background.paper',
        borderRadius: 3,
        mb: 2,
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
        <Avatar
          sx={{ bgcolor: deepOrange[500], mr: 2 }}
          src={review?.customer?.imageUrl}
          alt={review?.customer?.fullName}
        >
          {review?.customer?.fullName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" component="div">
            {review?.customer?.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {moment(review.date).format('LL')}
          </Typography>
        </Box>
      </Box>
      <Rating name="read-only" value={review.rating} precision={0.1} readOnly />
      <Typography variant="body2" color="text.secondary">
        {review.review}
      </Typography>
    </Paper>
  );
};

const ReaderReviews = props => {
  // calls api to get reader reviews

  const [pageSize, setPageSize] = useState(3);

  const { data, loading, error, fetchMore } = useQuery(getReaderReviews, {
    variables: {
      id: props.readerId,
      page: 0,
      pageSize,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Cannot get reader reviews');
    },
  });

  const showMoreReviews = () => {
    setPageSize(pageSize + 3);
    fetchMore({
      variables: {
        pageSize,
      },
    });
  };

  if (error) {
    return <Box sx={{ height: '100%' }}>Error</Box>;
  }

  return (
    <Box sx={{
      height: '100%',
      borderRadius: 3,
    }}>
      {
        data?.getReaderReviews?.list?.length > 0
          ? data.getReaderReviews.list.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
          : (
            <Typography variant="body1" color="text.secondary">
              No reviews yet
            </Typography>
            )
      }

      {loading
        ? <BackdropLoading />
        : (
            data?.getReaderReviews?.pagination?.totalOfElements > pageSize && (
          <Button onClick={showMoreReviews}>Show More</Button>
            )
          )}

    </Box>
  );
};

ReaderReviews.propTypes = {};

export default ReaderReviews;
