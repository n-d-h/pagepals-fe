import { Box, Rating, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import { paths } from '../../../components/router/paths';
import RouterLink from '../../../components/router/router-link';

const ServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isGuest = location.pathname.includes('guest');

  return (

    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        p: 2,
        gap: 1,
        border: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        borderRadius: 3,
        position: 'relative', // Required for absolute positioning of overlay
        ':hover': {
          cursor: 'pointer',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    ><Link
      component={RouterLink}
      to={isGuest
        ? paths.guest.service(service.id)
        : paths.main.service(service.id)}
      underline="none"
    >
        <Box sx={{
          height: 220,
          width: '100%',
          alignSelf: 'start',
          borderRadius: 3,
          overflow: 'hidden', // Hide overflow to prevent the image from overflowing its container

        }}>
          <Box
            sx={{
              height: 220,
              width: '100%',
              alignSelf: 'start',
              borderRadius: 3,
              transition: 'transform 0.3s ease', // Add transition for smooth scaling
              transform: isHovered ? 'scale(1.1)' : 'scale(1)', // Scale the image on hover
              overflow: 'hidden', // Hide overflow to prevent the image from overflowing its container
            }}
            component={'img'}
            alt="book cover"
            src={_.get(service, 'imageUrl', 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') || _.get(service, 'thumbnailUrl')}
          /></Box>
        <Typography variant="h6" fontWeight={500} color={'#000'}>
          {_.get(service, 'serviceType.name')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{
            height: 45,
          }}>
            <Typography
              variant="body2"
              fontWeight={400}
              color={'GrayText'}
              sx={{
                opacity: 0.7,
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}>
              {_.get(service, 'shortDescription', '')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 1 }}>
            {/* <Iconify icon='mdi:star' color={'#FFAB00'} /> */}
            <Rating value={_.get(service, 'rating', 0)} readOnly precision={0.5} />
            <Typography variant="body1" fontWeight={800} color={'#FFAB00'}>
              {_.get(service, 'rating')}
            </Typography>

            <Typography variant="body2" fontWeight={400} color={'GrayText'} sx={{ opacity: 0.7 }}>
              ({_.get(service, 'totalOfBooking')})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', width: '100%', gap: 0.5, mt: 0.7 }}>
            <Iconify icon='noto:money-bag' />
            <Typography variant="body2" fontWeight={700} color={'green'} sx={{ opacity: 0.7 }}>
              {_.get(service, 'price')} pals
            </Typography>
          </Box>
        </Box>

      </Link>
    </Box>
  );
};

export default ServiceCard;
