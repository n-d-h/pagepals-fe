import { Card, CardContent, CardMedia, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router';
import { paths } from '../../../components/router/paths';
import TextTruncate from '../../../components/common_services/TextTruncate';

const BookCardForView = ({ book, isGuest = false }) => {
  const navigate = useNavigate();
  const navigateToBook = () => {
    isGuest
      ? navigate(paths.guest.book(book.id))
      : navigate(paths.main.book(book.id));
  };

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 4,
        padding: 1.5,
        boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
          boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.3)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={navigateToBook}
    >
      <CardMedia
        image={
          book.thumbnailUrl ||
          'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
        }
        sx={{
          borderRadius: '6px',
          width: '100%',
          height: '100%',
          paddingBottom: 'min(75%, 240px)',
          backgroundColor: 'rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 10, left: 10, py: 0.5, px: 1, borderRadius: 1, bgcolor: '#564C4D' }}>
          <Typography variant='body2' fontWeight={200} color={'white'}>
            {_.get(book, 'language')}
          </Typography>
        </Box>
        <Box sx={{ position: 'absolute', top: 10, right: 10, py: 0.5, px: 1, borderRadius: 1, bgcolor: '#564C4D' }}>
          <Typography variant='body2' fontWeight={200} color={'white'}>
            {_.get(book, 'publisher')}
          </Typography>
        </Box>
      </CardMedia>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant='h6' fontWeight={200} color={'GrayText'}>{_.get(book, 'authors[0].name', 'Unknown')}</Typography>

          <Typography variant='h5' fontWeight={400} mt={1}>{book.title}</Typography>
          <Divider sx={{ mt: 2, mb: 2, width: '10%', borderColor: 'black', borderRadius: 2, borderWidth: 1 }} />
          <Typography variant='body1' fontWeight={200} color={'GrayText'}>
            <TextTruncate text={book.description} maxWidth={300} />
          </Typography>
        </Box>
      </CardContent>
    </Card>

  );
};

export default BookCardForView;
