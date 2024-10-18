import { useQuery } from '@apollo/client';
import { Box, Button, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import ContentDialog from '../../../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError } from '../../../../../components/common_services/CommonServices';
import { getBookingDetailById } from '../../../../../services/apolo/queries';
import BackdropLoading from '../../../../backdrop_loading/BackdropLoading';
import RecordingForm from '../../../../profile/personal/schedule/RecordingForm';

const BookingStatus = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
    color: 'warning',
  },
  COMPLETE: {
    value: 'COMPLETE',
    label: 'Completed',
    color: 'success',
  },
  CANCEL: {
    value: 'CANCEL',
    label: 'Canceled',
    color: 'error',
  },
};

const BookingInfomation = ({ report }) => {
  const { data: bookingData, loading: bookingLoading, refetch } = useQuery(getBookingDetailById, {
    variables: {
      id: report?.reportedId,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Cannot fetch booking detail');
    },
    fetchPolicy: 'cache-and-network',
  });

  // const { data: recordData, loading: recordLoading, refetch } = useQuery(getBookingDetailById, {
  //   variables: {
  //     id: _.get(bookingData, 'getBookingById.meeting.meetingCode'),
  //   },
  //   onError: (e) => {
  //   },
  //   fetchPolicy: 'cache-and-network',
  // });

  // const handleOpenRecordingWindow = () => {
  //   const watchPassword = _.get(recordData, 'getRecording.download_access_token', '');
  //   const watchUrl = _.get(recordData, 'getRecording.recording_files[0].download_url', '');
  //   const newWindowUrl = `${watchUrl}?access_token=${watchPassword}`;
  //   window.open(newWindowUrl, '_blank');
  // };

  // const handleOpenChatRecordingWindow = () => {
  //   const watchPassword = _.get(recordData, 'getRecording.download_access_token', '');
  //   const watchUrl = _.get(recordData, 'getRecording.recording_files[4].download_url', '');
  //   const newWindowUrl = `${watchUrl}?access_token=${watchPassword}`;
  //   window.open(newWindowUrl, '_blank');
  // };

  const [openDialog, closeDialog] = useDialog();

  const handleOpenRecordingDialog = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Records Detail"
          form={RecordingForm}
          assetForm={{
            data: _.get(bookingData, 'getBookingById', {}),
            isReport: true,
            isStaff: true
          }}
          showActions={false}
          callbackFnc={callBackDialog}
        />
      ),
    });
  };

  useEffect(() => {
    if (bookingData) {
      refetch();
    }
  }
  , [bookingData]);

  if (bookingLoading) {
    return <BackdropLoading />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height: '100%', pr: 2, p: 2 }}>
      <Typography variant="h6">Booking Information</Typography>

      <Grid container rowSpacing={2}>

        <Grid item xs={12}>
          <Typography variant="body1" fontWeight={700}>Booking Details</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Booking ID</Typography>
            <Typography variant="body2">{_.get(bookingData, 'getBookingById.id')}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Booking Price</Typography>
            <Typography variant="body2">{_.get(bookingData, 'getBookingById.totalPrice')} pals</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Booking Status</Typography>
            <Typography variant="body2" color={
              BookingStatus[_.get(bookingData, 'getBookingById.state.name')].color
            }>{BookingStatus[_.get(bookingData, 'getBookingById.state.name')].label}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Booking Time</Typography>
            <Typography variant="body2">{moment(_.get(bookingData, 'getBookingById.startAt')).format('LLLL')}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Cancel Reason</Typography>
            <Typography variant="body2" color='error'>{_.get(bookingData, 'getBookingById.cancelReason') || 'This booking has been cancelled'}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {_.isEmpty(_.get(bookingData, 'getBookingById.service')) && _.isEmpty(_.get(bookingData, 'getBookingById.seminar'))
            ? (
              <Typography variant="body2">No booking details</Typography>
              )
            : _.isEmpty(_.get(bookingData, 'getBookingById.service'))
              ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1" fontWeight={700}>Service Details</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" >Service Type</Typography>
                    <Typography variant="body2">{_.get(bookingData, 'getBookingById.seminar.title')}</Typography>
                  </Box>

                </Box>
                )
              : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1" fontWeight={700}>Service Details</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" >Service Type</Typography>
                    <Typography variant="body2">{_.get(bookingData, 'getBookingById.service.serviceType.name')}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" >Service Book</Typography>
                    <Typography variant="body2">{_.get(bookingData, 'getBookingById.service.book.title')}</Typography>
                  </Box>
                </Box>
                )
          }
        </Grid>

        {(_.get(bookingData, 'getBookingById.meeting.records.length') > 0) && (<Grid item xs={12} mt={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" fontWeight={700}>Booking Records</Typography>
            <Button variant="contained" color="primary" size='small' onClick={handleOpenRecordingDialog}>Check Records</Button>
          </Box>
        </Grid>)}
      </Grid>
    </Box>
  );
};

export default BookingInfomation;
