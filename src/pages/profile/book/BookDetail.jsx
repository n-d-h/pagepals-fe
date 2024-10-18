import { useQuery } from '@apollo/client';
import { Box, Chip, Grid, Typography } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import { getBookDetail } from '../../../services/apolo/queries';
import { LoadingPage } from '../../LoadingPage';

const BookDetail = () => {
  const { id } = useParams();

  const { data, loading } = useQuery(getBookDetail, {
    variables: {
      id,
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while getting book detail');
    },
  });

  if (loading) return <LoadingPage height={'60vh'} />;

  const book = _.get(data, 'getBookById', {});

  return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <Typography variant="h3" fontWeight={800} gutterBottom>
                    {book.title}
                </Typography>
                <Typography variant="h5" fontWeight={800} color={'GrayText'}>
                    {_.get(book, 'authors[0].name')}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Typography variant="h6" fontWeight={400} color={'GrayText'}>
                        Genres:{' '}

                        <Chip
                            key={_.get(book, 'categories[0].id')}
                            variant="outlined"
                            size="small"
                            label={_.get(book, 'categories[0].name', 'Unknown')}
                            sx={{ mr: 1 }}
                        />

                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Typography variant="body1" gutterBottom color={'GrayText'}>
                        Publisher: {book.publisher}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Typography variant="body1" gutterBottom color={'GrayText'}>
                        Language: {book.language}
                    </Typography>
                </Box>
                <Typography variant="body2" gutterBottom fontWeight={400}>
                    {book.description}
                </Typography>
            </Grid>
            <Grid item flexGrow={1} />
            <Grid item xs={12} lg={4}>
                <img
                    src={book.thumbnailUrl || book.cover}
                    alt="book"
                    style={{ width: '100%', objectFit: 'cover' }}
                />
            </Grid>
        </Grid>
  );
};

BookDetail.propTypes = {};

export default BookDetail;
