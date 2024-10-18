import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { useDispatch } from 'react-redux';
import MaintenanceIllustration from '../assets/dashboard/illustration/maintenance-illustration';
import MotionContainer from '../components/animate/motion-container';
import { varBounce } from '../components/animate/variants';
import { setActive } from '../redux/slices/loadingSlice';

export const NothingTooSeePage = () => {
  const dispatch = useDispatch();
  dispatch(setActive(false));

  return (
		<MotionContainer>
			<Box
				sx={{
				  width: '100%',
				  height: '100%',
				  display: 'flex',
				  justifyContent: 'center',
				  alignItems: 'center',
				  flexDirection: 'column',
				}}
			>
				<m.div variants={varBounce().in}>
					<Typography variant="h3" sx={{ mb: 2 }}>
						Sorry, Nothing to See Here!
					</Typography>
				</m.div>

				<m.div variants={varBounce().in}>
					<Typography sx={{ color: 'text.secondary' }}>
						{"There is nothing to see here. Perhaps there's no content to display."}
					</Typography>
				</m.div>

				<Stack
					component="span"
					justifyContent="center"
					sx={{
					  mt: 5,
					  maxWidth: 360,
					  mx: 'auto',
					}}
				>
					<MaintenanceIllustration/>
				</Stack>

			</Box>
		</MotionContainer>
  );
};
