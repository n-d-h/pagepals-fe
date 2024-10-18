/* eslint-disable no-unused-vars */
import { useMutation } from '@apollo/client';
import { Box, Button, Divider, Typography } from '@mui/material';
import moment from 'moment';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import { updateRequestTimeMutation } from '../../../../services/apolo/mutations';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';

export const TimeSlotStaff = ({ chosenTimeFrame, date, readerId, requestId, refetch, isGuest = false, staffWorkingDate, staffName }) => {
  const [openDialog, closeDialog] = useDialog();
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const [updateRequest, { data, loading }] =
		useMutation(updateRequestTimeMutation, {
		  onCompleted: () => {
		    showNotification('success', 'Update successful');
		  },
		  onError: (e) => {
		    handleFriendlyError(e, 'Error while update');
		  },
		});

  const handleBooking = async (data) => {
    const callBackDialog = (state) => {
      if (state) {
        updateConfig(data);
      }
      closeDialog();
    };

    const updateConfig = async (data) => {
      const formattedDate = date.toISOString().split('T')[0];

      // Combine formatted date and start time
      const combinedDateTime = `${formattedDate} ${data?.startTime}`;

      const variables = {
        requestId,
        interviewAt: combinedDateTime,
      };

      try {
        const result = await updateRequest({ variables });
        refetch();
      } catch (error) { }
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
				<ContentDialog
					title="Confirmation"
					content={(
						<Box
							sx={{
							  height: '100%',
							  bgcolor: 'white',
							  borderRadius: 3,
							}}
						>
							<Typography variant='h5' align='center' color={'black'} marginBottom={3}>Interview Information</Typography>
							<Typography variant='body1' color={'black'} marginLeft={3}>Date: {formattedDate}</Typography>
							<Typography variant='body1' color={'black'} marginLeft={3}>Time: {data?.startTime}</Typography>
							<Typography variant='body1' color={'black'} marginLeft={3}>Staff: {staffName}</Typography>

						</Box>
					)}
					callbackFnc={callBackDialog}
					showActions={true}
					agreeButtonName={'Confirm'}
				/>
      ),
    });
  };

  const isExist = (data) => {
    const timeFrame = staffWorkingDate?.find(
      (item) => moment(item?.date).isSame(date, 'day'));

    const timeFrameSlots = _.get(timeFrame, 'timeSlots', []);

    const excludedTimeSlots = timeFrameSlots.find(
      (slot) => slot?.startTime === data.startTime);

    return !!excludedTimeSlots;
  };

  if (loading) return <BackdropLoading />;

  return (
		<Box
			sx={{
			  height: '100%',
			  bgcolor: 'white',
			  borderRadius: 3,
			  p: 2,
			}}
		>
			<Typography variant="h6" textAlign={'center'}>
				Available Times on {moment(date).format('LL')}
			</Typography>

			<Divider sx={{ my: 2 }} />

			<Box className='flex' sx={{
			  flexWrap: 'wrap',
			  justifyContent: 'start',
			  gap: 2,
			}}>
				{_.get(chosenTimeFrame, 'length') === 0
				  ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
							<Typography>No availability on this day.</Typography>
						</Box>
				    )
				  : (
				      chosenTimeFrame.map((slot, index) => (
							<Box
								key={index}
								sx={{
								  display: 'flex',
								  gap: 1,
								  flexDirection: 'column',
								  justifyContent: 'center',
								  borderRadius: 1,
								}}
							>
								<Box
									key={slot}
									sx={{
									  display: 'flex',
									  gap: 1,
									  flexDirection: 'row',
									  alignItems: 'center',
									}}
								>
									<Button
										key={index}
										variant="outlined"
										color="primary"
										disabled={isExist(slot)}
										onClick={() => isGuest
										  ? showNotification('warning', 'Please login to book')
										  : handleBooking(slot)}
									>
										{slot?.startTime}
									</Button>
								</Box>
							</Box>
				      ))
				    )}
			</Box>
		</Box>
  );
};
