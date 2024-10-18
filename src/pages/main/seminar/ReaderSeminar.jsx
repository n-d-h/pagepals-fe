/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Card, CardContent, CardHeader, Grid, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { selectUser } from '../../../redux/slices/authSlice';
import { getReaderActiveEvents, getReaderEvents, getReaderSeminarRequests } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import SeminarTable from './SeminarTable';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import Iconify from '../../../components/iconify';
import moment from 'moment';
import { deleteEventMutation, updateEventMutation } from '../../../services/apolo/mutations';
import CreateEventForm from './CreateEventForm';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { ref } from 'firebase/storage';

const ReaderSeminar = () => {
  const userProfile = useSelector(selectUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [requestState, setRequestState] = useState('ACCEPTED');
  const [search, setSearch] = useState('');

  const handleRequestState = (state) => {
    setRequestState(state);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data, loading, error, refetch } = useQuery(getReaderSeminarRequests
    , {
      variables: {
        id: _.get(userProfile, 'reader.id', ''),
        pageIndex: page,
        pageSize: rowsPerPage,
        state: requestState,
        search: search,
      },
      onError: (e) => {
        handleFriendlyError(e, 'An error occurred while getting seminar data');
      },
      fetchPolicy: 'no-cache',
    });

  const { data: eventData, loading: eventLoading, refetch: eventRefetch } = useQuery(
    getReaderActiveEvents,
    {
      variables: {
        id: _.get(userProfile, 'reader.id', ''),
        page: 0,
        pageSize: 2
      },
      onError: (e) => {
        handleFriendlyError(e, 'Error while getting seminar');
      },
      fetchPolicy: 'no-cache',
    }
  );

  const [openDialog, closeDialog] = useDialog();
  const [updateEventMutate, { loading: updateEventLoading }] = useMutation(updateEventMutation, {
    onCompleted: (data) => {
      eventRefetch({
        id: _.get(userProfile, 'reader.id', ''),
        page: 0,
        pageSize: 2
      });
      refetch({
        id: _.get(userProfile, 'reader.id', ''),
        pageIndex: page,
        pageSize: rowsPerPage,
        state: requestState,
        search: search,
      });
      showNotification('success', 'Event updated successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while updating event');
    },
  });

  const [deleteEventMutate, { loading: deleteEventLoading }] = useMutation(deleteEventMutation, {
    onCompleted: (data) => {
      eventRefetch({
        id: _.get(userProfile, 'reader.id', ''),
        page: 0,
        pageSize: 2
      });
      refetch({
        id: _.get(userProfile, 'reader.id', ''),
        pageIndex: page,
        pageSize: rowsPerPage,
        state: requestState,
        search: search,
      });
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

  const handleChangeSearch = (value) => {
    setSearch(value);
  };

  if (error) {
    return <Box className="flex" sx={{
      height: '100%',
    }}>
      <NothingTooSeePage />
    </Box>;
  }

  if (updateEventLoading || deleteEventLoading || eventLoading || loading) {
    return <BackdropLoading />
  }

  return (
    <Box sx={{
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      // boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      // borderRadius: 4,
      gap: 3
    }}>

      <Grid container spacing={3}>
        <Grid item xs={12} container gap={2}>
          {/* <pre>{JSON.stringify(eventData, null, 2)}</pre> */}
          {_.get(eventData, 'getAllActiveEventsByReader.list.length') > 0

            && _.get(eventData, 'getAllActiveEventsByReader.list').map((event, index) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Box sx={{
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#e0e0e0',
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  transition: 'box-shadow 0.3s ease',
                  ':hover': {
                    boxShadow: 'rgba(100, 100, 111, 0.5) 0px 7px 29px 0px',
                    cursor: 'pointer',
                  },
                }}
                  onClick={() => {
                    handleEditEvent(event);
                  }}
                >
                  <Card>
                    <CardHeader title={`Upcoming event ${(index + 1)}`} sx={{ pr: 0, color: "grey" }} />
                    <CardContent sx={{ py: 0 }}>
                      <ListItem sx={{
                        gap: 2,
                        px: 0,
                      }}>
                        <Box sx={{
                          width: 110,
                          height: 110,
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                        }}

                          component={'img'}
                          alt="seminar cover"
                          src={event.seminar.imageUrl}

                        ></Box>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant='body1' fontWeight={600}>{event.seminar.title}</Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 0.5 }}>
                                <Typography variant="body2" fontWeight={400} color="GrayText">Start At:</Typography>
                                <Typography variant="body2" fontWeight={400} color="Highlight">
                                  {moment(event.startAt).format('DD/MM/YYYY HH:mm')}
                                </Typography>
                              </Box>
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
                                <Iconify icon='noto:money-bag' />
                                <Typography variant="body2" fontWeight={600} color="#118c4f">
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
            ))}
        </Grid>


        <Grid item xs={12}>
          <Box sx={{
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            borderRadius: 2,
          }}>
            <SeminarTable
              title="Seminar List"
              tableData={_.get(data, 'getAllSeminarRequestsByReaderIdAndState.list', [])}
              refetch={refetch}
              eventRefetch={eventRefetch}
              requestState={requestState}
              handleRequestState={handleRequestState}
              paginationDataCount={_.get(data, 'getAllSeminarRequestsByReaderIdAndState.pagination.totalOfElements', 0)}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              handleChangeSearch={handleChangeSearch}
              searchValue={search}
              setSearchValue={setSearch}
              ReaderSeminarLoading={loading}
              tableLabels={[
                { id: 'title', label: 'Title' },
                { id: 'duration', label: 'Duration' },
                { id: 'events', label: 'Number of Events' },
                { id: 'status', label: 'Status' },
                { id: 'createdAt', label: 'Created At' },
                { id: '' },
              ]}
            />
          </Box>
        </Grid>

        {loading && <Box><BackdropLoading /></Box>}
      </Grid>

    </Box>
  );
};

export default ReaderSeminar;
