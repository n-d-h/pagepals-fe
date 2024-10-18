import { useMutation } from '@apollo/client';
import { Badge, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import { readNotificationMutation } from '../../../services/apolo/mutations';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const NotificationItem = ({ notification, readAll }) => {
  const [isRead, setIsRead] = useState(notification.isRead);

  const [readNotification, { loading }] = useMutation(readNotificationMutation, {
    onCompleted: () => {
      setIsRead(true);
    },

    onError: (e) => {
      handleFriendlyError(e, 'Error while reading notification');
    },
  });

  return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 2,
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          mx: 3,
          my: 1,
          width: '100%',
          borderRadius: 2,
          ':hover': {
            cursor: 'pointer',
            bgcolor: 'rgba(100, 100, 111, 0.1)',
          },
        }}
            onClick={() => {
              if (!isRead) {
                readNotification({
                  variables: {
                    id: notification.id,
                  },
                });
              }
            }}
        >
            {loading && <BackdropLoading />}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="body1"
                        fontWeight={600}
                    >{notification.title}</Typography>
                    <Typography
                        variant="caption"
                        color="GrayText"
                    >{notification.createdAt}</Typography>
                </Box>
                <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                    fontWeight={300}
                >{notification.content}</Typography>
            </Box>

            {!isRead && !readAll && <Badge badgeContent={0} color="primary">
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }} />
            </Badge>}

        </Box>
  );
};

export default NotificationItem;
