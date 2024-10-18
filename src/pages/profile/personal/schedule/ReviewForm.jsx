import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Rating, TextField } from '@mui/material';
import React, { useState } from 'react';
import { reviewBookingMutation } from '../../../../services/apolo/mutations';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
const ReviewForm = (props) => {
  const { bookingId, closeDialog, refetch } = props;

  const [reviewBooking, { loading: reviewLoading }] = useMutation(reviewBookingMutation, {
    onCompleted: () => {
      showNotification('success', 'Submit review successfully');
      refetch();
      closeDialog();
    },
    onError: (e) => {
      handleFriendlyError(e, 'Cannot submit review. Please try again later');
      refetch();
    },
  });

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('Good');

  return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3, py: 2 }}>
            <Rating
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                }} />

            <TextField label="Review" multiline value={review} onChange={(e) => setReview(e.target.value)} rows={3} fullWidth />

            <LoadingButton
                variant="contained"
                color="primary"
                onClick={() => {
                  reviewBooking({
                    variables: {
                      id: bookingId,
                      review: {
                        rating: parseInt(rating),
                        review,
                      },
                    },
                  });
                }}
                loading={reviewLoading}
            >
                Review
            </LoadingButton>
        </Box>
  );
};

export default ReviewForm;
