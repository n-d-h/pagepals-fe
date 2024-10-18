import { Box, Button, Grid, Typography } from '@mui/material';
import readersIcon from '../../assets/landing/icon1.png';
import recordIcon from '../../assets/landing/icon2.png';
import knowledgeIcon from '../../assets/landing/icon3.png';
import Iconify from '../../components/iconify';
import { useNavigate } from 'react-router';
import { useResponsive } from '../../components/hooks/use-responsive';

const FEATURES = [
  {
    icon: readersIcon,
    title: 'Meeting with Readers',
    description:
			'Engage in one-on-one meetings with readers to gain deeper insights into the book',
  },
  {
    icon: recordIcon,
    title: 'Record Meeting',
    description:
			'No need to worry about finding your information. Just record it.',
  },
  {
    icon: knowledgeIcon,
    title: 'Share your knowledge',
    description: 'Become a Reader and join us to share your knowledge',
  },
];

const SectionFeatures = () => {
  const navigate = useNavigate();

  const mdUp = useResponsive('up', 'md');
  return (
		<Box
			sx={{
			  display: 'flex',
			  justifyContent: 'center',
			  alignItems: 'center',
			  py: mdUp ? 10 : 5,
			  flexDirection: 'column',
			  gap: 2,
			}}
		>
			<Typography variant="h2" component="div">
				Features
			</Typography>

			<Typography
				variant="h6"
				fontWeight={400}
				component="div"
				pl={!mdUp && 4}
				textAlign={!mdUp && 'center'}
			>
				There are just a few of the features that make PagePals the most
				effective way to meet with your book readers.
			</Typography>

			<Box
				sx={{
				  mt: 5,
				}}
			>
				<Grid container spacing={12} justifyContent={'center'}>
					{FEATURES.map((feature, index) => (
						<Grid
							item
							xs={12}
							lg={4}
							key={index}
							sx={{
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center',
							}}
						>
							<Box
								sx={{
								  display: 'flex',
								  flexDirection: 'column',
								  justifyContent: 'center',
								  alignItems: 'center',
								  gap: mdUp ? 2 : 1,
								  maxWidth: mdUp ? 400 : 300,
								  bgcolor: 'background.paper',
								  borderRadius: 6,
								  minHeight: mdUp ? 400 : 300,
								}}
							>
								<Box
									component="img"
									alt="auth"
									src={feature.icon}
									sx={{
									  width: {
									    xs: 75,
									    md: 100,
									  },
									  height: {
									    xs: 75,
									    md: 100,
									  },
									}}
								/>

								<Typography variant={mdUp ? 'h3' : 'h5'} component="div" mt={2}>
									{feature.title}
								</Typography>

								<Typography
									variant={mdUp ? 'body1' : 'body2'}
									fontWeight={400}
									component="div"
									textAlign={'center'}
									px={2}
								>
									{feature.description}
								</Typography>

								<Button
									endIcon={
										<Iconify icon="ion:chevron-forward-outline" width={24} />
									}
									color="primary"
									size="large"
									onClick={() => {
									  navigate('/auth/login');
									}}
								>
									Learn More
								</Button>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
  );
};

export default SectionFeatures;
