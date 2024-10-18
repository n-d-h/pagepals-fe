/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/authSlice';

const BookingForm = (props) => {
  const { data, update, callbackFnc } = props;

  const { readerId } = data;

  const user = useSelector(selectUser);

  const [noteToReader, setNoteToReader] = useState('');

  const submitBooking = () => {
    update({
      ...data,
      serviceId: _.get(data, 'service.id'),
      price: _.get(data, 'service.price'),
      readerId,
      customerId: user?.customer?.id,
      noteToReader,
    });

    callbackFnc();
  };

  return (
		<Box
			sx={{
			  p: 2,
			}}
		>
			<Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle1" color="textSecondary">
						Date:
					</Typography>
					<Typography variant="body1">{data.date || 'N/A'}</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle1" color="textSecondary">
						Time:
					</Typography>
					<Typography variant="body1">{_.get(data, 'slot.startTime') || 'N/A'}</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle1" color="textSecondary">
						Price:
					</Typography>
					<Typography variant="body1">{`${_.get(data, 'service.price', '0')} pals`}</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle1" color="textSecondary">
						Service:
					</Typography>

					<Typography variant="body1">{`${_.get(data, 'service.book.title', 'N/A')} - ${_.get(data, 'service.serviceType.name')}`}</Typography>

				</Box>

			</Box>

			<Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
				<LoadingButton
					loading={_.get(data, 'loading', false)}
					variant="contained"
					color="primary"
					onClick={submitBooking}
					sx={{ borderRadius: '20px', paddingX: 3 }}
				>
					Book
				</LoadingButton>
				<Button
					variant="outlined"
					color="error"
					onClick={() => callbackFnc()}
					sx={{ borderRadius: '20px', paddingX: 3 }}
				>
					Cancel
				</Button>
			</Box>
		</Box>
  );
};

export default BookingForm;
