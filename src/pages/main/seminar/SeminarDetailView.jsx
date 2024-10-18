/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import { AccordionSummary, Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Grid, Icon, ListItem, ListItemText, MenuItem, Pagination, Select, TextField, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import Editor from '../../../components/editor/editor';
import Label from '../../../components/label';
import Upload from '../../../components/shadcn-ui/upload/upload';
import { selectUser } from '../../../redux/slices/authSlice';
import { createEventMutation, deleteEventMutation, updateEventMutation } from '../../../services/apolo/mutations';
import { getEventBySeminarId, getSeminarRequestDetail } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import CreateEventForm from './CreateEventForm';
import Iconify from '../../../components/iconify';
import ReaderBookCardV2 from '../../profile/reader/ReaderBookCardV2';
import SeminarUpdate from './update/SeminarUpdate';

const StateLabelENUM = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

const StateColorENUM = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'error',
};

const SeminarDetailView = ({ editable }) => {
  const { id } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const userProfile = useSelector(selectUser);
  const { data, loading, error } = useQuery(getSeminarRequestDetail, {
    variables: {
      id,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while getting seminar data');
    },
  });

  const { data: eventData, loading: eventLoading, refetch } = useQuery(getEventBySeminarId, {
    variables: {
      id,
      page,
      pageSize: 5,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while getting event data');
    },
  });

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [duration, setDuration] = React.useState(30);
  const [expanded, setExpanded] = React.useState({});
  const [book, setBook] = React.useState({});

  const handleDropSingleFile = (acceptedFiles) => { };

  useEffect(() => {
    setTitle(_.get(data, 'getSeminarRequest.title', ''));
    setDescription(_.get(data, 'getSeminarRequest.description', ''));
    setFile(_.get(data, 'getSeminarRequest.imageUrl', null));
    setDuration(_.get(data, 'getSeminarRequest.duration', 30));
    setBook(_.get(data, 'getSeminarRequest.book', {}));
    refetch();
  }, [data]);

  const [updateEventMutate, { loading: updateEventLoading }] = useMutation(updateEventMutation, {
    onCompleted: (data) => {
      refetch();
      showNotification('success', 'Event updated successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while updating event');
    },
  });

  const [deleteEventMutate, { loading: deleteEventLoading }] = useMutation(deleteEventMutation, {
    onCompleted: (data) => {
      refetch();
      showNotification('success', 'Event deleted successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while deleting event');
    },
  });

  const handleEditEvent = (event) => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (eventData) => {
      await updateEventMutate({
        variables: {
          input: {
            limitCustomer: eventData.limitCustomer,
            price: eventData.price,
            startAt: moment(eventData.startAt).format('YYYY-MM-DD HH:mm:ss'),
          },
          id: event.id,
        },
      });

      closeDialog();
    };

    const deleteConfig = async () => {
      await deleteEventMutate({
        variables: {
          id: event.id,
        },
      });

      closeDialog();
    };

    openDialog({
      maxWidth: 'sm',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Edit Event"
          form={CreateEventForm}
          assetForm={{
            refetch,
            callBackDialog,
            loading: updateEventLoading || deleteEventLoading,
            update: updateConfig,
            delete: deleteConfig,
            data: event,
            isCreating: false
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  const [createEventMutate, { loading: createEventLoading }] = useMutation(createEventMutation, {
    onCompleted: (data) => {
      refetch();
      showNotification('success', 'Event created successfully');
    },
    onError: (e) => {
      showNotification('error', 'Exceed the maximum number of events allowed for this seminar');
    },
  });

  const [openDialog, closeDialog] = useDialog();
  const createEvent = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (eventData) => {
      await createEventMutate({
        variables: {
          input: {
            seminarId: _.get(data, 'getSeminarRequest.id'),
            ...eventData,
            startAt: moment(eventData.startAt).format('YYYY-MM-DD HH:mm:ss'),
          },
          readerId: _.get(userProfile, 'reader.id'),
        },
      });

      closeDialog();
    };

    openDialog({
      maxWidth: 'sm',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Create Event"
          form={CreateEventForm}
          assetForm={{
            refetch,
            callBackDialog,
            loading: createEventLoading,
            update: updateConfig,
            isCreating: true
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  if (loading || eventLoading || createEventLoading || isDeleting || updateEventLoading) {
    return <BackdropLoading />;
  }

  if (error) {
    return <Box className="flex" sx={{
      width: '100%',
      minHeight: '70vh',
      height: '100%',
    }}>
      <NothingTooSeePage />
    </Box>;
  }
  function parseDuration(duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  return (
    <Grid container spacing={2} alignItems={'start'} sx={{ width: '100%', height: '100%', mt: 2 }}>
      {_.get(data, 'getSeminarRequest.state') === 'PENDING' && (
        <Grid item xs={12}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

            <Typography variant="h3" textAlign={'center'} fontWeight={600}>{
              'Edit Seminar Request'
            }</Typography>

            <SeminarUpdate
              seminarId={id}
              title={title}
              duration={duration}
              description={description}
              imageFile={file}
              setReload={setIsDeleting}
              isAccepted={false} />

          </Box>

        </Grid>
      )}

      <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          width: '70%',
        }}>
          <Box sx={{
            py: 1,
            width: '30%',
            borderRadius: 1,
            border: '1px solid #70b4d2',
            boxShadow: 'rgba(0, 184, 217, 0.16) 0px 7px 29px 0px',
            backgroundColor: 'rgba(0, 184, 217, 0.16)',
          }}>
            <Typography variant="body1" color={'#006C9C'} textAlign={'center'} fontWeight={600}>
              Seminar Info
            </Typography>

          </Box>

          {_.get(data, 'getSeminarRequest.state') !== 'PENDING'
            ? (
              <Box sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center',
              }}>
                <Iconify icon="bi:clock" width={20} height={20} color="black" />
                <Typography variant="body1" color={'black'} textAlign={'center'} fontWeight={600}>{parseDuration(duration)}</Typography>
              </Box>
            )
            : (<Box sx={{
              width: '20%',
              borderRadius: 1,
              bgcolor: '#fff',
              boxShadow: 'rgba(34, 197, 94, 0.16) 0px 7px 29px 0px',
            }}>
              <Select disabled={
                _.get(data, 'getSeminarRequest.state') === 'ACCEPTED' ||
                _.get(data, 'getSeminarRequest.state') === 'REJECTED'
              }
                value={duration} onChange={(e) => setDuration(e.target.value)} fullWidth>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={90}>1 hour 30 minutes</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
                <MenuItem value={150}>2 hours 30 minutes</MenuItem>
                <MenuItem value={180}>3 hours</MenuItem>
              </Select>
            </Box>
            )}
        </Box>

        <Box sx={{
          width: '40%',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center', 
          flexDirection: 'row',
          gap: 3,
        }}>

          <Label color={StateColorENUM[_.get(data, 'getSeminarRequest.state')]}>
            {StateLabelENUM[_.get(data, 'getSeminarRequest.state')]}
          </Label>

          {_.get(data, 'getSeminarRequest.state') === 'ACCEPTED' && (
            <SeminarUpdate
              seminarId={id}
              title={title}
              duration={duration}
              description={description}
              imageFile={file}
              setReload={setIsDeleting}
              isAccepted={true} />
          )}
        </Box>

      </Grid>
      {_.get(data, 'getSeminarRequest.state') === 'REJECTED' && (
        <Grid item xs={12} md={12}>
          <Box sx={{
            width: '100%',
            borderRadius: 1,
            border: '1px solid #FF0000',
            backgroundColor: 'rgba(255, 86, 48, 0.16)',
            boxShadow: 'rgba(255, 86, 48, 0.16) 0px 7px 29px 0px',
            p: 3,
          }}>
            <Typography variant="subtitle1" color={'#FF0000'} textAlign={'center'} fontWeight={600}>
              Reject Reason: {_.get(data, 'getSeminarRequest.rejectReason')}
            </Typography>
          </Box>
        </Grid>
      )}
      {_.get(data, 'getSeminarRequest.state') === 'REJECTED' && (
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
        }}>
          <SeminarUpdate
            seminarId={id}
            setReload={setIsDeleting}
            isRejected={true} />
        </Box>
      )}
      <Grid item xs={12} md={12}>
        <AccordionSummary
          expanded={
            expanded[book.id]
          }
          onClick={() => {
            setExpanded({
              ...expanded,
              [book.id]: !expanded[book.id],
            });
          }}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: 'white',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            p: 2,
          }}
        >
          <ReaderBookCardV2
            book={book} option={'noView'} wrapperStyles={{
              p: 0,
            }}
            open={expanded[book.id]}
            seeMore={true}
          />
        </AccordionSummary>
      </Grid>

      <Grid item xs={12} md={8}>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Seminar Description" />
            <CardContent>
              <Editor
                id="full-editor"
                disabled={_.get(data, 'getSeminarRequest.state') === 'ACCEPTED' ||
                  _.get(data, 'getSeminarRequest.state') === 'REJECTED'}
                initialValue={description}
                setValue={setDescription}
              />
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Seminar Title" />
            <CardContent>
              {_.get(data, 'getSeminarRequest.state') === 'PENDING'
                ? (
                  <TextField fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                )
                : (<TextField disabled={true} fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />)}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Seminar Image" />
            <CardContent>
              <Upload
                disabled={_.get(data, 'getSeminarRequest.state') === 'ACCEPTED' ||
                  _.get(data, 'getSeminarRequest.state') === 'REJECTED'}
                file={file}
                maxSize={3145728}
                onDrop={handleDropSingleFile}
                onDelete={() => {
                  if (_.get(data, 'getSeminarRequest.state') !== 'ACCEPTED' &&
                    _.get(data, 'getSeminarRequest.state') !== 'REJECTED') {
                    setFile(null);
                  }
                }
                } />
            </CardContent>
          </Card>
        </Box>

      </Grid>

      {_.get(
        data,
        'getSeminarRequest.state',
      ) === 'ACCEPTED' && (
          <Grid item xs={12}>
            <Divider sx={{ width: '100%', my: 2 }} />

          </Grid>
        )}

      {_.get(
        data,
        'getSeminarRequest.state',
      ) === 'ACCEPTED' && (
          <Grid item xs={12} container gap={2}>

            {_.get(
              data,
              'getSeminarRequest.state',
            ) === 'ACCEPTED' && (
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={createEvent}>
                    {'Add Event'}
                  </Button>
                </Grid>
              )}

            {/* <pre>{JSON.stringify(eventData, null, 2)}</pre> */}
            {_.get(eventData, 'getAllEventBySeminarId.list.length') > 0
              ? _.get(eventData, 'getAllEventBySeminarId.list').map((event, index) => (
                <Grid item xs={12} md={2} key={event.id}>
                  <Box sx={{
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#e0e0e0',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    transition: 'box-shadow 0.3s ease',
                    ':hover': {
                      boxShadow: _.get(
                        data,
                        'getSeminarRequest.state',
                      ) && 'rgba(100, 100, 111, 0.5) 0px 7px 29px 0px',
                      cursor: _.get(
                        data,
                        'getSeminarRequest.state',
                      ) === 'ACCEPTED' && 'pointer',
                    },
                  }}
                    onClick={() => {
                      handleEditEvent(event);
                    }}
                  >
                    <Card>
                      <CardHeader title={`Event ${(index + 1)}`} sx={{ pr: 0 }} />
                      <CardContent sx={{ py: 0 }}>
                        <ListItem sx={{
                          gap: 2,
                          px: 0,
                        }}>
                          {/* <Avatar
                        src={event.seminar.imageUrl}
                        sx={{
                          width: 40,
                          height: 40,
                          color: 'text.secondary',
                          bgcolor: 'background.neutral',
                        }}
                      /> */}
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                <Typography variant="body2" fontWeight={400} color="GrayText">Start At:</Typography>
                                <Typography variant="body2" fontWeight={400} color="Highlight">
                                  {moment(event.startAt).format('DD/MM/YYYY HH:mm')}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box >
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                  <Typography variant="body2" fontWeight={400} color="GrayText">Limit:</Typography>
                                  <Typography variant="body2" fontWeight={400} color="black">
                                    {event.limitCustomer} customers
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                  <Typography variant="body2" fontWeight={400} color="GrayText">Booked:</Typography>
                                  <Typography variant="body2" fontWeight={400} color="black">
                                    {(event.limitCustomer - event.activeSlot)} customers
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                  <Typography variant="body2" fontWeight={400} color="GrayText">Status:</Typography>
                                  <Typography variant="body2" fontWeight={400} color="black">
                                    {event.state}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                  <Iconify icon='noto:money-bag' />
                                  <Typography variant="body2" fontWeight={600} color="#3e9c35">
                                    {event.price} pals
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            primaryTypographyProps={{
                              component: 'span',
                              typography: 'body1',
                              fontWeight: 400,
                            }}
                          />
                        </ListItem>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))
              : (
                <Typography variant="h6" color={'#000'} fontWeight={600}>No events available</Typography>
              )}
            {_.get(eventData, 'getAllEventBySeminarId.list.length') > 0 && (
              <Grid Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center', my: 5 }}>
                  <Pagination count={_.get(data, 'getAllEventBySeminarId.pagination.totalOfPages', 1)}
                    page={page + 1}
                    onChange={(e, value) => setPage(value - 1)}
                  />
                </Box>
              </Grid>
            )}
          </Grid>

        )
      }
    </Grid >
  );
};

export default SeminarDetailView;
