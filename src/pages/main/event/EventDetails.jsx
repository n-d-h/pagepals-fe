import { useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Chip, Divider, Grid, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import openDeleteDialog from '../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import Iconify from '../../../components/iconify';
import Markdown from '../../../components/markdown/MarkDown';
import Image from '../../../components/shadcn-ui/image';
import { selectUser } from '../../../redux/slices/authSlice';
import { bookEventMutation } from '../../../services/apolo/mutations';
import { getEventDetails } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import { paths } from '../../../components/router/paths';

const EventDetails = () => {
  const { id } = useParams();

  const { data, loading, refetch } = useQuery(getEventDetails, {
    variables: {
      id,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting event details');
    },
  });

  const location = useLocation();
  const isGuest = location.pathname.includes('guest');
  const userProfile = useSelector(selectUser);

  const navigate = useNavigate();

  const [openDialog, closeDialog] = useDialog();

  const [bookEvent, { loading: bookLoading }] = useMutation(bookEventMutation, {
    variables: {
      customerId: _.get(userProfile, 'customer.id'),
      eventId: id,
    },

    onCompleted: () => {
      showNotification('success', 'Booking successful');
      navigate(paths.main.root);
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while booking event');
    },
  });

  const handleBooking = async (data) => {
    if (isGuest) {
      showNotification('warning', 'Please login to book');
      return;
    }

    openDeleteDialog({
      title: 'Book Seminar',
      content: (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
          <Typography variant="body1" fontWeight={400} textAlign={'center'}>
            Are you sure you want to book this seminar?
          </Typography>
          <Typography variant="body2" fontWeight={400} fontStyle={'italic'} color={'red'}>
            Note: You cannot cancel this seminar booking once confirmed.
          </Typography>
        </Box>
      ),
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
        refetch();
      }
    });
  };

  if (loading || bookLoading) {
    return <BackdropLoading />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
        mx: 'auto',
        width: '80%',
        mt: '2%',
        mb: '2%',
      }}
    >
      <Grid container spacing={2}>

        {/* <Grid item xs={12}>
          <Typography variant="h3" fontWeight={600}>
            Seminar Details
          </Typography>
        </Grid> */}

        <Grid item container rowSpacing={2} xs={12}>
          <Grid item xs={12} container columnSpacing={4}>
            <Grid item xs={12} lg={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  width: '100%',
                  height: 'fit-content',
                  borderRadius: 2,
                  px: 2,
                  py: 2,
                  border: '1px solid #e0e0e0',
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
              >
                <Grid container columnSpacing={5}>
                  <Grid item xs={5} md={5}>
                    <Box sx={{
                      width: '100%',
                      // borderRadius: 1,
                    }}>
                      <Image src={
                        _.get(data, 'getEventById.seminar.imageUrl')
                      } alt="event" width='100%' borderRadius={1.5} />
                    </Box>
                  </Grid>
                  <Grid item xs={7} md={7}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'start',
                      alignItems: 'start',
                      gap: 2,
                      width: '100%',
                      py: 2,
                      pl: 2,
                      pr: 4,
                    }}>

                      <Typography variant="h3" fontWeight={800}>
                        {_.get(data, 'getEventById.seminar.title', 'No title available')}
                      </Typography>

                      <Divider sx={{
                        borderColor: 'gray.300',
                        width: '100%',
                      }} />

                      <Box sx={{ position: 'relative', pl: 0 }}>
                        <ListItem sx={{
                          gap: 2,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                          <Avatar
                            src={_.get(
                              data,
                              'getEventById.seminar.reader.avatarUrl',

                            )}
                            sx={{
                              width: 78,
                              height: 78,
                              color: 'text.secondary',
                              bgcolor: 'background.neutral',
                              border: '4px solid #e0e0e0',
                              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                            }}
                          />
                          <ListItemText
                            primary={_.get(
                              data,
                              'getEventById.seminar.reader.nickname',
                              'nickname not available',
                            )}
                            secondary={
                              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                <Iconify icon="eva:star-fill" width={20} color="#ffb300" />
                                <Typography variant="h6" fontWeight={500} color="#ffb300">
                                  {_.get(
                                    data,
                                    'getEventById.seminar.reader.rating',
                                    0,
                                  )}.0
                                </Typography>
                                <Typography variant="body1" fontWeight={200} color={'grey'} sx={{ opacity: 0.7 }}>
                                  ({_.get(
                                    data,
                                    'getEventById.seminar.reader.totalOfReviews',
                                    0,
                                  )})
                                </Typography>

                                <Divider orientation="vertical" flexItem sx={{
                                  mx: 2,
                                  borderColor: 'GrayText',
                                }} />

                                <Typography variant="body1" fontWeight={400} color="GrayText">
                                  {_.get(
                                    data,
                                    'getEventById.seminar.reader.totalOfBookings',
                                    0,
                                  )} people booked this reader
                                </Typography>
                              </Box>
                            }
                            primaryTypographyProps={{
                              component: 'span',
                            }}
                          />
                        </ListItem>
                      </Box>

                      <Divider sx={{
                        borderColor: 'gray.300',
                        width: '100%',
                      }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', pl: 5 }}>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                          <Box sx={{ width: 200 }}>
                            <ListItem sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: 'fit-content',
                              pl: 0,
                            }}>
                              <ListItemIcon sx={{
                                mr: 1,
                              }}>
                                <Iconify icon="noto:pushpin" width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText variant="overline">
                                <Typography variant="body1" fontWeight={500} color={'GrayText'}>
                                  Start Date:
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          </Box>

                          {/* <Chip variant="filled" color="info" size='small' label={ */}
                          <Typography variant="body1" fontWeight={500}>
                            {moment(_.get(data, 'getEventById.startAt')).format('MMM DD, YYYY - hh:mm A')}
                          </Typography>
                          {/* } /> */}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                          <Box sx={{ width: 200 }}>
                            <ListItem sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: 'fit-content',
                              pl: 0,
                            }}>
                              <ListItemIcon sx={{
                                mr: 1,
                              }}>
                                <Iconify icon="fluent-emoji:hourglass-not-done" width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText variant="overline" >

                                <Typography variant="body1" fontWeight={500} color={'GrayText'}>
                                  Duration
                                </Typography>
                              </ListItemText>

                            </ListItem>
                          </Box>

                          <Typography variant="body1" fontWeight={500}>
                            {_.get(data, 'getEventById.seminar.duration')} minutes
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                          <Box sx={{ width: 200 }}>
                            <ListItem sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: 'fit-content',
                              pl: 0,
                            }}>
                              <ListItemIcon sx={{
                                mr: 1,
                              }}>
                                <Iconify icon="fluent-emoji:dollar-banknote" width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText variant="overline" >

                                <Typography variant="body1" fontWeight={500} color={'GrayText'}>
                                  Price
                                </Typography>
                              </ListItemText>

                            </ListItem>
                          </Box>

                          <Typography variant="body1" fontWeight={500}>
                            {_.get(
                              data,
                              'getEventById.price',

                            )} pals
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                          <Box sx={{ width: 200 }}>
                            <ListItem sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: 'fit-content',
                              pl: 0,
                            }}>
                              <ListItemIcon sx={{
                                mr: 1,
                              }}>
                                <Iconify icon="emojione:admission-tickets" width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText variant="overline" >

                                <Typography variant="body1" fontWeight={500} color={'GrayText'}>
                                  Active Slot
                                </Typography>
                              </ListItemText>

                            </ListItem>
                          </Box>

                          <Typography variant="body1" fontWeight={500}>
                            {' ' + ((_.get(data, 'getEventById.activeSlot'))) + '/' + _.get(data, 'getEventById.limitCustomer')}
                          </Typography>
                        </Box>

                        <Box
                          onClick={handleBooking}
                          sx={{
                            mt: 5,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'fit-content',
                            px: 6,
                            py: 2,
                            gap: 1,
                            backgroundColor: '#00c853',
                            borderRadius: 0.5,
                            border: '1px solid #00a152',
                            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                            color: 'white',
                            ':hover': {
                              cursor: 'pointer',
                              backgroundColor: '#6fbf73',
                              color: 'black',
                            },
                          }}>

                          <Typography variant="body1" fontWeight={600}>Book Now</Typography>
                        </Box>
                      </Box>

                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{
              borderRadius: 2,
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              p: 4,
              height: 'fit-content',
            }}>
              <Box sx={{ mb: 2, alignSelf: 'center' }}>
                <Typography variant="h5" fontWeight={600} sx={{ textAlign: 'center' }}>
                  Seminar Description
                </Typography>
              </Box>
              <Divider sx={{
                borderColor: 'gray.300',
                width: '100%',
                mb: 2,
              }} />
              <Markdown>
                {_.get(data, 'getEventById.seminar.description', 'No description available')}
              </Markdown>
            </Box>
          </Grid>

          <Grid item xs={12} lg={12} container sx={{
            borderRadius: 2,
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            p: 4,
            mt: 2,
            mb: 4,
            height: 'fit-content',
          }}>
            <Grid item xs={12} mb={2} pt={2}>
              <Typography variant="h5" fontWeight={600}>
                Book Description
              </Typography>
            </Grid>

            <Grid container spacing={0}>
              <Grid item xs={12} lg={2}>
                <Box
                  sx={{
                    height: 320,
                    width: '100%',
                    alignSelf: 'center',
                    // borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    transition: 'transform 0.3s ease', // Add transition for smooth scaling
                    overflow: 'hidden', // Hide overflow to prevent the image from overflowing its container
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  }}
                  component={'img'}
                  alt="book cover"
                  src={
                    _.get(data, 'getEventById.seminar.book.thumbnailUrl')
                  } ></Box>

              </Grid>
              <Grid item xs={12} lg={10} pl={4}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {_.get(
                    data,
                    'getEventById.seminar.book.title',
                  )}
                </Typography>
                <Typography variant="h6" fontWeight={800} color={'GrayText'}>
                  {_.get(data, 'getEventById.seminar.book.authors[0].name')}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                  <Typography variant="body1" fontWeight={400} color={'GrayText'}>
                    Category:{' '}

                    <Chip
                      key={_.get(data, 'getEventById.seminar.book.categories[0].id')}
                      variant="outlined"
                      size="small"
                      label={_.get(data, 'getEventById.seminar.book.categories[0].name', 'Unknown')}
                      sx={{ mr: 1 }}
                    />

                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                  <Typography variant="body2" gutterBottom color={'GrayText'}>
                    Publisher: {_.get(data, 'getEventById.seminar.book.publisher')} {' '} ({_.get(data, 'getEventById.seminar.book.publishedDate')})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                  <Typography variant="body2" gutterBottom color={'GrayText'}>
                    Language: {_.get(data, 'getEventById.seminar.book.language')}
                  </Typography>
                </Box>
                <Typography variant="caption" gutterBottom fontWeight={400}>
                  {_.get(data, 'getEventById.seminar.book.description')}
                </Typography>
              </Grid>
              <Grid item flexGrow={1} />

            </Grid>
          </Grid>

        </Grid>
      </Grid >

    </Box >
  );
};

export default EventDetails;
