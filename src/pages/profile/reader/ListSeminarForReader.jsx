/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Card, Grid, Stack } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import openDeleteDialog from '../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Iconify from '../../../components/iconify';
import CustomImage from '../../../components/image/CustomImage';
import Label from '../../../components/label';
import { paths } from '../../../components/router/paths';
import TextMaxLine from '../../../components/text-max-line';
import { selectUser } from '../../../redux/slices/authSlice';
import { bookEventMutation } from '../../../services/apolo/mutations';
import { getReaderActiveEvents } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const ListSeminarForReader = ({ readerId }) => {
  const userProfile = useSelector(selectUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const location = useLocation();
  const isGuest = location.pathname.includes('guest');

  const smUp = useResponsive('up', 'sm');

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data, loading, error, refetch } = useQuery(getReaderActiveEvents, {
    variables: {
      id: readerId,
      page,
      pageSize: 2,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting seminar');
    },
    fetchPolicy: 'no-cache',
  });

  const [bookEvent, { loading: bookLoading }] = useMutation(bookEventMutation, {
    variables: {
      customerId: _.get(userProfile, 'customer.id'),
      eventId: '',
    },

    onCompleted: () => {
      showNotification('success', 'Booking successful');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while booking event');
    },
  });

  const [openDialog, closeDialog] = useDialog();
  const handleBooking = async (data) => {
    if (isGuest) {
      showNotification('warning', 'Please login to book');
      return;
    }

    openDeleteDialog({
      title: 'Book Seminar',
      content: 'Are you sure you want to book this seminar?',
      dialog: [openDialog, closeDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        bookEvent();
      }
    });
  };

  if (loading || bookLoading) return <BackdropLoading />;

  if (_.get(data, 'getAllActiveEventsByReader.list.length') === 0 || error) {
    return <div>No seminar found</div>;
  }

  return (
    <Box sx={{
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      borderRadius: 4,
    }}>

      <Grid container spacing={2}>
        {_.get(data, 'getAllActiveEventsByReader.list.length') > 0 && (
          _.get(data, 'getAllActiveEventsByReader.list').map((seminar) => {
            return (
              <Grid item xs={12} lg={6} key={seminar.id} >
                <Stack component={Card} direction="row" sx={{
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}>
                  <Stack
                    sx={{
                      p: (theme) => theme.spacing(3, 3, 2, 3),
                      flexGrow: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Label variant="soft" color={(_.get(seminar, 'state') === 'ACTIVE' && 'info') || 'default'}>
                        {_.get(seminar, 'state')}
                      </Label>

                      <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                        {`${moment(_.get(seminar, 'startAt')).format('LLLL')} - ${moment(_.get(seminar, 'startAt')).add(_.get(seminar, 'seminar.duration'), 'minutes').format('hh:mm A')}`}
                      </Box>
                    </Stack>

                    <Stack spacing={1} flexGrow={1}>
                      <TextMaxLine variant="h5" sx={{ color: 'text.secondary', minWidth: '100%', fontWeight: 800 }}>
                        {_.get(seminar, 'seminar.title')}
                      </TextMaxLine>
                    </Stack>

                    <Stack direction="row" alignItems="center">

                      <Button onClick={() => {
                        handleBooking(seminar);
                      }} variant='outlined'>
                        Join Seminar
                      </Button>

                      <Button onClick={() => {
                        isGuest ? navigate(paths.guest.eventDetail(seminar.id)) : navigate(paths.main.eventDetail(seminar.id));
                      }} variant='contained' sx={{
                        mx: 2,
                      }}>
                        See Details
                      </Button>

                      <Stack
                        spacing={1.5}
                        flexGrow={1}
                        direction="row"
                        flexWrap="wrap"
                        justifyContent="flex-end"
                        sx={{
                          typography: 'caption',
                          color: 'text.disabled',
                        }}
                      >
                        <Stack direction="row" alignItems="center">
                          <Iconify icon="material-symbols:manage-accounts" width={16} sx={{ mr: 0.5 }} />
                          {seminar.limitCustomer - seminar.activeSlot}/{seminar.limitCustomer}
                        </Stack>

                        <Stack direction="row" alignItems="center">
                          <Iconify icon="mdi:cash" width={16} sx={{ mr: 0.5 }} />
                          {_.get(seminar, 'price')}  pals
                        </Stack>

                      </Stack>
                    </Stack>
                  </Stack>

                  {smUp && (
                    <Box
                      sx={{
                        width: 180,
                        height: 240,
                        position: 'relative',
                        flexShrink: 0,
                        p: 1,
                      }}
                    >
                      <CustomImage alt={_.get(seminar, 'seminar.title')} src={_.get(seminar, 'seminar.imageUrl')} sx={{ height: 1, borderRadius: 1.5 }} />
                    </Box>
                  )}
                </Stack>
              </Grid>
            );
          })

        )}
      </Grid>
    </Box>

  );
};

export default ListSeminarForReader;
