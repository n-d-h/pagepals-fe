import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { MotivationIllustration } from '../../../assets/dashboard/illustration';

import { Helmet } from 'react-helmet-async';
import EcommerceWelcome from './ecommer_welcome/EcommerceWelcome';

// ----------------------------------------------------------------------

export default function OverviewScreen () {
  return (
		<>
			<Helmet>
				<title> Dashboard: Overview</title>
			</Helmet>

			<Container maxWidth = 'xl'>
				<Typography
					variant="h4"
					sx={{
					  mb: { xs: 3, md: 5 },
					}}
				>
					Hi, Welcome back 👋
				</Typography>

				<Grid container spacing={3}>
					<Grid xs={12}>
						<EcommerceWelcome
							title={'Congratulations!'}
							description="Best seller of the month You have done 57.6% more bookings today."
							img={<MotivationIllustration />}
							action={
								<Button variant="contained" color="primary">
									Go Now
								</Button>
							}
						/>
					</Grid>

				</Grid>
			</Container>
		</>
  );
}
