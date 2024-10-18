/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import moment from 'moment-timezone';
import React from 'react';
import { useSelector } from 'react-redux';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import Label from '../../../../components/label/label';
import { selectUser } from '../../../../redux/slices/authSlice';
import { completeBookingMutation, completeEventBookingMutation } from '../../../../services/apolo/mutations';
import { getBookingById } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import ReportForm from '../../reader/ReportForm';
import RecordingForm from './RecordingForm';
import { ScheduleStatusColorENUM, ScheduleStatusTextENUM } from './StatusENUM';

const ScheduleDetail = (props) => {
  const { data, closeDetailDialog } = props;

  const userProfile = useSelector(selectUser);

  const { row } = data || {};

  //   console.log('row', moment(row?.startAt || row?.event?.startAt).isAfter(moment()));

  const { data: recordData, loading: recordLoading } = useQuery(getBookingById, {
    variables: {
      id: _.get(row, 'id'),
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (_.get(row, 'state.name', '') === 'COMPLETE') { showNotification('error', 'Cannot fetch booking'); }
    },
  });

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
					  data: _.get(recordData, 'getBookingById', {}),
					}}
					showActions={false}
					callbackFnc={callBackDialog}
				/>
      ),
    });
  };

  const [completeService, { data: completeData }] = useMutation(completeBookingMutation, {
    onCompleted: () => {
      closeDetailDialog();
      data.refetch();
      showNotification('success', 'Service completed successfully');
	  },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while completing service');
    },

  });

  const [openCompleteDialog, closeCompleteDialog] = useDialog();
  const handleCompleteClick = () => {
    openDeleteDialog({
      title: 'Complete Service',
      content: 'Are you sure you want to complete this service?',
      dialog: [openCompleteDialog, closeCompleteDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        completeService({
          variables: {
            id: row.id,
          },
        });
      }
    });
  };

  const [completeSeminar] = useMutation(completeEventBookingMutation, {
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while completing seminar event');
    },
    onCompleted: () => {
      data.refetch();
      closeDetailDialog();
      showNotification('success', 'Seminar event completed successfully');
    },
  });

  const [openSeminarDialog, closeSeminarDialog] = useDialog();
  const handleCompleteSeminarClick = () => {
    openDeleteDialog({
      title: 'Complete Seminar Event',
      content: 'Are you sure you want to complete this seminar event?',
      dialog: [openCompleteDialog, closeCompleteDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        completeSeminar({
          variables: {
            eventId: row?.event?.id,
          },
        });
      }
    });
  };

  const recordsEnoughTime = _.get(recordData, 'getBookingById.meeting.records', []).reduce((acc, record) => acc + record.duration, 0) >= 40;

  const [openReportDialog, closeReportDialog] = useDialog();
  const handleReportBooking = () => {
    const callBackDialog = () => {
      closeReportDialog();
    };

    openReportDialog({
      fullWidth: true,
      children: (
				<ContentDialog
					title="Report"
					form={ReportForm}
					assetForm={{
					  customerId: _.get(userProfile, 'customer.id'),
					  reportId: row.id,
					  type: 'BOOKING',
					  closeDialog: callBackDialog,
					  closeDetailDialog,
					}}
					callbackFnc={callBackDialog}
					showActions={false}
				/>
      ),
    });
  };

  if (recordLoading) {
    return <BackdropLoading />;
  }

  return (
		<Box sx={{ paddingX: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h4">Schedule Details</Typography>

				{_.get(data, 'role') === 'reader' &&
					(data.bookingState === 'PROCESSING' || data.bookingState === 'PENDING') &&
					!data.isSeminar &&
					(
						<Button
							variant="outlined"
							color="primary"
							size='small'
							onClick={() => {
							  if (!recordsEnoughTime) {
							    showNotification('error', 'Not enough recording time. Please contact our support team.');
							    return;
							  }
							  handleCompleteClick();
							}}
						>
							Complete
						</Button>

					)}

				{_.get(data, 'role') === 'reader' &&
					data.isSeminar &&
					data.bookingState !== 'COMPLETE' &&
					row.id !== null &&
					(
						<Button
							variant="outlined"
							color="primary"
							size='small'
							onClick={() => {
							  if (!recordsEnoughTime) {
							    showNotification('error', 'Not enough recording time. Please contact our support team.');
							    return;
							  }
							  handleCompleteSeminarClick();
							}}
						>
							Complete
						</Button>

					)}

				{_.get(data, 'role') === 'customer' &&
					(
						<Button
							variant="outlined"
							color="error"
							size='small'
							disabled={_.get(recordData, 'getBookingById.isReported', false) || moment(row?.startAt || row?.event?.startAt).isAfter(moment()) || _.get(row, 'state.name', '') === 'CANCEL'}
							onClick={handleReportBooking}
						>
							{_.get(recordData, 'getBookingById.isReported', false) ? 'Reported' : 'Report'}
						</Button>
					)}
			</Box>
			<Box sx={{ gap: 2 }}>
				<Box
					sx={{
					  display: 'flex',
					  justifyContent: 'space-between',
					  alignItems: 'center',
					  my: 2,
					}}
				>
					<Typography variant="body1">Start At </Typography>
					<Typography variant="body1" color="GrayText">
						{moment(row?.startAt || row?.event?.startAt).format('HH:mm A - MMM DD, YYYY')}
					</Typography>
				</Box>
				<Box
					sx={{
					  display: 'flex',
					  justifyContent: 'space-between',
					  alignItems: 'center',
					  my: 2,
					}}
				>
					<Typography variant="body1">State</Typography>
					<Label
						color={ScheduleStatusColorENUM[_.get(row, 'state.name', 'PENDING')]}
					>
						{ScheduleStatusTextENUM[_.get(row, 'state.name', 'PENDING')]}
					</Label>
				</Box>

			</Box>

			<Typography variant="h4" sx={{ mt: 4 }}>
				Booking Details:
			</Typography>

			{(_.get(row, 'event') && _.get(data, 'role') === 'reader') && (<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'center',
				  my: 2,
				}}
			>
				<Typography variant="body1">Event Price</Typography>
				<Label
					color={'info'}
				>
					{(row?.totalPrice || row?.event?.price) + ' pals'}
				</Label>
			</Box>)}

			{(_.get(recordData, 'getBookingById.state.name','')) === "CANCEL" && (<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'start',
				  my: 2,
				}}
			>
				<Typography variant="body1">Cancel Reason</Typography>
				<Typography variant="body1"
						width='70%'
						align='right'
					color={'error'}
				>
					{_.get(recordData, 'getBookingById.cancelReason', 'No reason') === null ? 'No reason' : _.get(recordData, 'getBookingById.cancelReason', 'No reason')}
				</Typography>
			</Box>)}

			{(_.get(row, 'event') && _.get(data, 'role') === 'reader') && (<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'center',
				  my: 2,
				}}
			>
				<Typography variant="body1">Total Bookings</Typography>
				<Label
					color={'info'}
				>
					{(row.event.limitCustomer - row.event.activeSlot) + ' customers'}
				</Label>
			</Box>)}

			<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'center',
				  my: 2,
				}}
			>
				{
					(_.get(row, 'event') && _.get(data, 'role') === 'reader')
					  ? (<Typography variant="body1">Total Earnings (expected)</Typography>)
					  : <Typography variant="body1">Total Price </Typography>
				}

				{
					(_.get(row, 'event') && _.get(data, 'role') === 'reader')
					  ? (<Label color={'success'}>{((row.event.limitCustomer - row.event.activeSlot) * row.event.price) + ' pals'}</Label>)
					  : <Label color={'success'}>{row.totalPrice} pals</Label>
				}
			</Box>

			<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'center',
				  my: 2,
				}}
			>
				<Typography variant="body1">
					{_.isEmpty(_.get(row, 'event')) ? 'Book Title' : 'Seminar Title'}
				</Typography>
				<Label

				>
					{_.get(row, 'service.book.title', _.get(
					  row,
					  'event.seminar.title',
					))}
				</Label>
			</Box>

			{_.isEmpty(_.get(row, 'event')) && (<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'center',
				  my: 2,
				}}
			>
				<Typography variant="body1">Reader</Typography>
				<Label

				>
					{_.get(row, 'service.reader.nickname', 'Seminar')}
				</Label>
			</Box>)}

			{_.get(row, 'event') && (<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  alignItems: 'center',
				  my: 2,
				}}
			>
				<Typography variant="body1">Book</Typography>
				<Label

				>
					{_.get(row, 'event.seminar.book.title', 'Seminar')}
				</Label>
			</Box>)}

			{(_.get(recordData, 'getBookingById.meeting.records.length') > 0) &&
				(
					<Box className='flex' sx={{
					  justifyContent: 'space-between',
					  mt: 2,

					  pb: 2,
					}}>
						<Typography variant="h4" >
							Booking Recording:
						</Typography>

						<Button variant='outlined' onClick={handleOpenRecordingDialog} color='primary'>
							Check Recordings
						</Button>
					</Box>
				)}

		</Box>
  );
};

export default ScheduleDetail;
