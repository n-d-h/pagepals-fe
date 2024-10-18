/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getNoneText } from '../../../components/common_services/GetNoneText';
import Iconify from '../../../components/iconify';
import { selectUser } from '../../../redux/slices/authSlice';
import { getNotificationByUser } from '../../../services/apolo/queries';
import NotificationItem from './NotificationItem';
import { readAllNotification, readNotificationMutation } from '../../../services/apolo/mutations';
import { LoadingButton } from '@mui/lab';

const NotificationView = () => {
  const userProfile = useSelector(selectUser);

  const isReader = _.get(userProfile, 'role.name') === 'READER';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [readAll, setReadAll] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const { data, loading, refetch } = useQuery(getNotificationByUser, {
    variables: {
      id: _.get(userProfile, 'id', ''),
      role: isReader ? 'READER' : 'CUSTOMER',
      page,
      pageSize: rowsPerPage,
    },
    fetchPolicy: 'no-cache',
  });

  const [readNotification, { loading: readAllLoading }] = useMutation(readAllNotification, {
    onCompleted: () => {
      refetch();
    },
  });

  return (
        <Box sx={{
          width: '20vw',
          minHeight: '100vh',
          pb: 5,
        }}>
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
                Notifications
            </Typography>

            <Box sx={{ textAlign: 'end', mr: 2, my: 2 }}>
                <LoadingButton variant="contained" color="primary" size='small'
                    onClick={(e) => {
                      setReadAll(true);
                      readNotification({
                        variables: {
                          id: _.get(userProfile, 'id', ''),
                        },
                      });
                    }}
                    loading={readAllLoading}
                >Mark all as read</LoadingButton>
            </Box>

            {_.get(data, 'getAllNotificationsByAccountId.pagination.totalOfElements', 0) === 0
              ? <Box sx={{ textAlign: 'center', mt: 2 }}>
                    {getNoneText('No Notifications')}
                </Box>

              : (<Grid container columnSpacing={2}>
                    {_.get(data, 'getAllNotificationsByAccountId.list', []).map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            readAll={readAll}
                            />
                    ))}

                    {_.get(data, 'getAllNotificationsByAccountId.pagination.totalOfElements', 0) > rowsPerPage && (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <Button variant="contained" color="primary"
                                onClick={(e) => setRowsPerPage(rowsPerPage + 5)}
                                endIcon={<Iconify
                                    icon="bi:arrow-down"
                                    color="#fff"
                                />}
                            >See more</Button>
                        </Grid>
                    )}

                    {loading && <Iconify
                        icon="eos-icons:loading"
                        color="#000"
                        width={20}
                        height={20}
                    />
                    }
                </Grid>)}

        </Box>
  );
};

export default NotificationView;
