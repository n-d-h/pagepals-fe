import { Avatar, Box, Divider, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';
import Iconify from '../../../components/iconify';

const ServiceInfo = ({ data }) => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      alignItems: 'start',
      gap: 2,
    }}>

      <Typography variant="h4" fontWeight={600}>
        {_.get(data, 'serviceById.serviceType.name', 'No title available')} -  {_.get(
          data,
          'serviceById.book.title',
        )}
      </Typography>

      <Box sx={{ position: 'relative', mr: 2 }}>
        <ListItem sx={{
          gap: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Avatar
            src={
              _.get(data, 'serviceById.reader.avatarUrl', null) ||
              'https://fiverr-res.cloudinary.com/image/upload/t_profile_original,q_auto,f_auto/v1/attachments/profile/photo/b1fa5bce1f8fb97201c5b52ef7de0a17-1588188368295/b670461f-3aa2-46c9-8732-4377b5818816.png'}
            sx={{
              width: 78,
              height: 78,
              color: 'text.secondary',
              bgcolor: 'background.neutral',
            }}
          />
          <ListItemText
            primary={_.get(
              data,
              'serviceById.reader.nickname',
            )}
            secondary={
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                <Iconify icon="eva:star-fill" width={24} color="#FFAB00" />
                <Typography variant="h6" fontWeight={500} color="#FFAB00">
                  {_.get(data, 'serviceById.reader.rating', 0)}
                </Typography>
                <Typography variant="h6" fontWeight={500} color={'GrayText'}>
                  ({_.get(data, 'serviceById.reader.totalOfReviews', 0)})
                </Typography>

                <Divider orientation="vertical" flexItem sx={{
                  mx: 2,
                  borderColor: 'GrayText',
                }} />

                <Typography variant="body1" fontWeight={400} color="GrayText">
                  {_.get(data, 'serviceById.reader.totalOfBookings', 0)} people booked this reader
                </Typography>
              </Box>
            }
            primaryTypographyProps={{
              component: 'span',
              typography: 'h5',
              fontWeight: 400,
              mb: 1,
              color: 'text.primary',
            }} />
        </ListItem>
      </Box>

      <Box
        sx={{
          height: 550,
          width: '100%',
          alignSelf: 'start',
          borderRadius: 3,
          transition: 'transform 0.3s ease', // Add transition for smooth scaling
          overflow: 'hidden', // Hide overflow to prevent the image from overflowing its container
          boxShadow: '0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)', // Add a subtle shadow to the image
        }}
        component={'img'}
        alt="book cover"
        src={
          _.get(data, 'serviceById.imageUrl', null) ||
          'https://fiverr-res.cloudinary.com/image/upload/t_profile_original,q_auto,f_auto/v1/attachments/profile/photo/b1fa5bce1f8fb97201c5b52ef7de0a17-1588188368295/b670461f-3aa2-46c9-8732-4377b5818816.png'

        } ></Box>

    </Box>
  );
};

export default ServiceInfo;
