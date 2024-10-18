import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { useDispatch } from 'react-redux';
import NotFoundIllustration from '../assets/dashboard/illustration/not-found-illustration';
import MotionContainer from '../components/animate/motion-container';
import { varBounce } from '../components/animate/variants';
import RouterLink from '../components/router/router-link';
import { setActive } from '../redux/slices/loadingSlice';

export const Page404 = () => {
  const dispatch = useDispatch();
  dispatch(setActive(false));

  return (
		<MotionContainer>
			<Box
				sx={{
				  width: '100%',
				  height: '100vh',
				  display: 'flex',
				  justifyContent: 'center',
				  alignItems: 'center',
				  flexDirection: 'column',
				}}
			>
				<m.div variants={varBounce().in}>
					<Typography variant="h3" sx={{ mb: 2 }}>
						Sorry, Page Not Found!
					</Typography>
				</m.div>

				<m.div variants={varBounce().in}>
					<Typography sx={{ color: 'text.secondary' }}>
						Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
						mistyped the URL? Be sure to check your spelling.
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
					<NotFoundIllustration/>
				</Stack>

				<m.div variants={varBounce().in}>
					<Typography variant="h6" sx={{ mt: 10, mb: 2 }}>
						Here are some helpful links instead:
					</Typography>
				</m.div>

				<Button
					component={RouterLink}
					href="/"
					size="large"
					variant="contained"
				>
					Go to Home
				</Button>
			</Box>
		</MotionContainer>
  );
};
