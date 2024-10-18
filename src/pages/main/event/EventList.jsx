import { useQuery } from '@apollo/client';
import { Avatar, Box, Grid, ListItemText, Pagination, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import { selectUser } from '../../../redux/slices/authSlice';
import { getEventList } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Image from '../../../components/shadcn-ui/image';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';
import { paths } from '../../../components/router/paths';

const EventList = () => {
  const userProfile = useSelector(selectUser);

  const [page, setPage] = useState(0);

  const { data, loading, error } = useQuery(getEventList, {
    variables: {
      pageIndex: page,
      id: _.get(userProfile, 'customer.id', ''),
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting event list');
    },
    fetchPolicy: 'no-cache',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = location.pathname.includes('guest');

  const handleNavigate = (id) => {
    isGuest ? navigate(paths.guest.eventDetail(id)) : navigate(paths.main.eventDetail(id));
  };

  if (loading) {
    return <BackdropLoading />;
  }

  if (error || _.get(data, 'getAllEventsNotJoinByCustomer.list', []).length === 0) {
    return <Box sx={{
      height: '100%',
      minHeight: '70vh',
    }}
      className='flex'
    >
      <NothingTooSeePage />
    </Box>;
  }

  return (
    <Box sx={{
      width: '70%',
      mx: 'auto',
      mt: 5,
    }}>

      <Grid container spacing={3} columnSpacing={5}>
        <Grid item xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          {/* <Typography variant="h4" className='' textAlign={'center'} gutterBottom>
            Upcoming Seminars
          </Typography> */}
          <Box sx={{
            py: 2,
            px: 4,
            mb: 2,
            borderRadius: 1,
            border: '1px solid #b3d1b5',
            boxShadow: 'rgba(34, 197, 94, 0.16) 0px 7px 29px 0px',
            backgroundColor: 'rgba(34, 197, 94, 0.16)',
          }}>
            <Typography
              variant="subtitle1"
              color={'#118D57'}
              textAlign={'center'}
              fontWeight={600}
            >
              Upcoming Seminars
            </Typography>
          </Box>
        </Grid>

        {_.get(data, 'getAllEventsNotJoinByCustomer.list', []).map((event, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Paper
              onClick={() => handleNavigate(_.get(event, 'id'))}
              sx={{
                // mx: 1.5,
                borderRadius: 2,
                position: 'relative',
                bgcolor: 'white',
                transition: 'transform 0.2s',
                border: '1px solid #e0e0e0',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                ':hover': {
                  cursor: 'pointer',
                  transform: 'translateY(-5px)',
                  border: '1px solid #00a152',
                },
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  px: 2,
                  pb: 1,
                  pt: 2.5,
                }}
              >

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    alt={_.get(event, 'seminar.reader.nickname')}
                    src={_.get(event, 'seminar.reader.avatarUrl')}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '4px solid #e0e0e0',
                      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                    }} />
                  <ListItemText
                    primary={`${_.get(event, 'seminar.title')}`}
                    primaryTypographyProps={{
                      variant: 'subtitle1',
                      style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0,
                        pb: 0,
                      }
                    }}
                    // by ${_.get(event, 'seminar.reader.nickname')}
                    secondary={
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'start',
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          host: {_.get(event, 'seminar.reader.nickname')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {moment(_.get(event, 'startAt')).format('MMM DD, YYYY - hh:mm A')}
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{
                      mt: 0,
                      component: 'span',
                      typography: 'caption',
                      color: 'text.disabled',
                    }}
                  />
                </Stack>

                <Stack
                  rowGap={1.5}
                  columnGap={3}
                  flexWrap="wrap"
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'text.secondary', typography: 'caption' }}
                >
                  <Stack direction="row" alignItems="center">
                    <Iconify width={16} icon="game-icons:duration" sx={{ mr: 0.5, flexShrink: 0 }} />
                    {_.get(event, 'seminar.duration')} minutes
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Iconify
                      width={16}
                      icon="solar:users-group-rounded-bold"
                      sx={{ mr: 0.5, flexShrink: 0 }}
                    />
                    {_.get(event, 'limitCustomer') - _.get(event, 'activeSlot')} / {_.get(event, 'limitCustomer')}
                  </Stack>
                </Stack>
              </Stack>

              <Label
                variant="filled"
                sx={{
                  right: 16,
                  zIndex: 9,
                  bottom: 16,
                  position: 'absolute',
                }}
              >
                {'🔥'} {_.get(event, 'price')} pals
              </Label>

              <Box sx={{ p: 1, position: 'relative' }}>
                <Image alt={_.get(event, 'price')} src={_.get(event, 'seminar.imageUrl')} ratio="1/1" sx={{ borderRadius: 1.5 }} />
              </Box>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <Pagination count={_.get(data, 'getAllEventsNotJoinByCustomer.pagination.totalOfPages')}
              page={page + 1}
              onChange={(e, value) => setPage(value - 1)}
            />
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default EventList;
