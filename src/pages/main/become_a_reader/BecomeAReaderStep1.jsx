import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import image from '../../../assets/become_reader/character_11.png';
import { useResponsive } from '../../../components/hooks/use-responsive';
import { m } from 'framer-motion';
import { varBounce } from '../../../components/animate/variants';

const BecomeAReaderStep1 = (props) => {
  const mdUp = useResponsive('up', 'md');
  return (
		<Box
			sx={{
			  width: '100%',
			  height: '100%',
			}}
		>
			<m.div
				variants={varBounce().in}
				style={{
				  width: '100%',
				  height: '100%',
				  display: 'flex',
				  alignItems: 'center',
				  justifyContent: 'center',
				}}
			>
				<Paper
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: 'center',
					  width: mdUp ? '50%' : '100%',
					  height: '100%',
					  py: 5,
					  borderRadius: 4,
					}}
					elevation={4}
				>
					<Typography variant="h4" fontWeight={200} sx={{ mb: 2 }}>
						{"Let's get started on your journey to becoming a Reader!"}
					</Typography>

					<Box
						sx={{
						  display: 'flex',
						  justifyContent: 'center',
						  alignItems: 'center',

						  width: '100%',
						  height: '100%',
						}}
					>
						<Box component="img" alt="auth" src={image} loading="lazy" />
					</Box>

					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => props.handleNext()}
						sx={{ mt: 2 }}
					>
						{"Let's Go!"}
					</Button>
				</Paper>
			</m.div>
		</Box>
  );
};

export default BecomeAReaderStep1;
