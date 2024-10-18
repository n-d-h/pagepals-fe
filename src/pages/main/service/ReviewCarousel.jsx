import { Avatar, Box, Paper, Rating, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import moment from 'moment';
import React from 'react';
import Carousel, { CarouselArrows, useCarousel } from '../../../components/carousel';

const ReviewCarousel = ({ data }) => {
  const carousel = useCarousel({
    autoplay: true,
  });

  const filteredRatings = _.get(data, 'serviceById.bookings').filter((booking) => booking.rating !== null || booking.review !== null);

  if (filteredRatings?.length === 0) {
    return (
            <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  height: 50,
                  width: '100%',
                }}
            >
                <Typography variant="h5" fontWeight={600} color="text.secondary">
                    No reviews yet 🙁
                </Typography>
            </Box>
    );
  }

  if (filteredRatings?.length === 1) {
    return (<CarouselItem review={filteredRatings[0]} />);
  }

  return (
        <Box
            sx={{
              position: 'relative',
              maxHeight: 400,
              width: '100%',
            }}
        >
            <CarouselArrows filled shape="rounded" onNext={carousel.onNext} onPrev={carousel.onPrev}>
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                    {filteredRatings.map((review) => (
                            <CarouselItem key={review.id} review={review} />
                    ))}
                </Carousel>
            </CarouselArrows>
        </Box>
  );
};

export default ReviewCarousel;

const CarouselItem = ({ review }) => {
  return (
        <Paper
            elevation={1}
            sx={{
              width: '100%',
              py: 2,
              px: 10,
              mx: 'auto', // Center the card on the page
              bgcolor: 'background.paper',
              mb: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        sx={{ bgcolor: deepOrange[500], mr: 2 }}
                        src={_.get(review, 'customer.imageUrl') || 'https://fiverr-res.cloudinary.com/image/upload/t_profile_original,q_auto,f_auto/v1/attachments/profile/photo/b1fa5bce1f8fb97201c5b52ef7de0a17-1588188368295/b670461f-3aa2-46c9-8732-4377b5818816.png'}
                        alt={'Customer Name'}
                    >
                        {_.get(review, 'customer?.fullName', '#').charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" component="div">
                            {_.get(review, 'customer.fullName', 'Customer Name')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {moment(_.get(
                              review,
                              'startAt',
                            )).format('LL')}
                        </Typography>
                    </Box>
                </Box>

                <Rating name="read-only" value={_.get(
                  review,
                  'rating',
                )} precision={0.1} readOnly />

            </Box>
            <Typography variant="body2" color="text.secondary">
                {_.get(review, 'review', 'No review')}
            </Typography>
        </Paper>
  );
};
