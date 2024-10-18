/* eslint-disable no-unused-vars */
import { useMutation } from '@apollo/client';
import { Box, Button, Divider, Typography } from '@mui/material';
import moment from 'moment';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { bookReaderService } from '../../../services/apolo/mutations';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import BookingForm from './BookingForm';
import { useLocation } from 'react-router';

export const TimeSlots = ({ chosenTimeFrame, date, readerId, service, refetch }) => {
  const [openDialog, closeDialog] = useDialog();

  const location = useLocation();
  const isGuest = location.pathname.includes('guest');

  const [createBooking, { loading }] =
		useMutation(bookReaderService, {
		  onCompleted: () => {
		    showNotification('success', 'Booking successful');
		    refetch();
		    closeDialog();
		  },
		  onError: (e) => {
		    handleFriendlyError(e, 'Error while booking reader');
		    refetch();
		    closeDialog();
		  },
		});

  const handleBooking = async (data) => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (data) => {
      await createBooking({
        variables: {
          customerID: data.customerId,
          bookingDetails: {
            description: data?.noteToReader || '', // Assuming 'note' is used as the description
            workingTimeId: data.slot.id,
            serviceId: data.serviceId,
            totalPrice: data.price,
          },
        },
	  });
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
				<ContentDialog
					title="Booking"
					form={BookingForm}
					assetForm={{
					  data: {
					    date: moment(date).format('LL'),
					    ...data,
					    note: '',
					    readerId,
					    service,
					    loading,
					  },
					  update: updateConfig,
					}}
					callbackFnc={callBackDialog}
					showActions={false}
				/>
      ),
    });
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
				Available Times on {moment(date).format('LL')} - (
				{_.get(chosenTimeFrame, 'length')} timeframe today)
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
										onClick={() => isGuest
										  ? showNotification('warning', 'Please login to book')
										  : handleBooking({ name: slot?.startTime, slot })}
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
