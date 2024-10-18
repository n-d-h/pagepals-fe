/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';

const BookingForm = (props) => {
  const { data, update, callbackFnc } = props;
  return (
		<Box
			sx={{
			  p: 2,
			}}
		>
			<Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle1" color="textSecondary">
						Name:
					</Typography>
					<Typography variant="body1">{data.name || 'N/A'}</Typography>
				</Box>
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
					<Typography variant="body1">{data.time || 'N/A'}</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography variant="subtitle1" color="textSecondary">
						Reader&apos;s Notes:
					</Typography>
					<Typography variant="body1">{data.note || 'N/A'}</Typography>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				<Typography variant="subtitle1" color="textSecondary">
					Your Note to Reader:
				</Typography>
				<TextField
					variant="outlined"
					size="small"
					fullWidth
					placeholder="Enter your note here"
					multiline
					rows={4}
					value={data.note}
					sx={{ borderRadius: '5px' }}
				/>
			</Box>

			<Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => callbackFnc()}
					sx={{ borderRadius: '20px', paddingX: 3 }}
				>
					Book
				</Button>
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
