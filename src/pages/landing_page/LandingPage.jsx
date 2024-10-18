import { Box, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActive } from '../../redux/slices/loadingSlice';
import LandingFooter from './LandingFooter';
import LandingHeader from './LandingHeader';
import SectionContact from './SectionContact';
import SectionFeatures from './SectionFeatures';
import SectionFeedback from './SectionFeedback';
import SectionGetStarted from './SectionGetStarted';
import SectionImage from './SectionImage';

const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActive(false));
  }
  , [dispatch]);
  return (
		<Box sx={{ mt: 4 }} component="footer">
			<Grid container rowSpacing={4}>
				<Grid item xs={12}>
					<LandingHeader />
				</Grid>
				<Grid item xs={12}>
					<SectionImage />
				</Grid>
				<Grid item xs={12}>
					<SectionFeatures />
				</Grid>
				<Grid item xs={12}>
					<SectionFeedback />
				</Grid>
				<Grid item xs={12}>
					<SectionGetStarted />
				</Grid>
				<Grid item xs={12}>
					<SectionContact />
				</Grid>
				<Grid item xs={12}>
					<LandingFooter />
				</Grid>
			</Grid>
		</Box>
  );
};

export default LandingPage;
