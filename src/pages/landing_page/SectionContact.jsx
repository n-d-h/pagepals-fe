import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, Form, useForm } from 'react-hook-form';
import Iconify from '../../components/iconify';
import { useResponsive } from '../../components/hooks/use-responsive';

const SectionContact = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const mdUp = useResponsive('up', 'md');

  const onSubmit = (data) => {
  };

  return (
		<Form onSubmit={handleSubmit(onSubmit)} control={control}>
			<Box
				sx={{
				  pt: 8,
				  pb: 6,
				}}
			>
				<Box
					sx={{
					  bgcolor: 'background.paper',
					  mx: mdUp ? 20 : 5,
					  borderRadius: 6,
					  px: 0,
					  pb: 8,
					}}
				>
					<Grid container>
						<Grid item xs={12}>
							<Container
								maxWidth="lg"
								sx={{
								  display: 'flex',
								  flexDirection: 'column',
								  justifyContent: 'center',
								  alignItems: 'flex-start',
								  pt: 8,
								  pb: 4,
								  ml: mdUp && 5,
								  height: '100%',
								}}
							>
								<Typography
									variant="h2"
									fontWeight={600}
									component="div"
									gutterBottom
									width={!mdUp ? '100%' : 'auto'}
									textAlign={'center'}
								>
									Let’s get in touch!
								</Typography>

								<Typography
									variant="h5"
									fontWeight={200}
									component="div"
									width={!mdUp ? '100%' : 'auto'}
									textAlign={!mdUp && 'center'}
								>
									Got questions about the PagePals system? Feel free to ask!
								</Typography>
							</Container>
						</Grid>

						<Grid item xs={12} md={6}>
							<Box
								sx={{
								  display: 'flex',
								  flexDirection: 'column',
								  justifyContent: 'center',
								  alignItems: mdUp ? 'flex-start' : 'center',
								  ml: mdUp && 8,
								  gap: 2,
								  pb: 6,
								}}
							>
								<Box
									sx={{
									  display: 'flex',
									  gap: 2,
									  alignItems: 'center',
									}}
								>
									<Iconify
										icon="solar:phone-outline"
										width={24}
										sx={{
										  color: 'primary.main',
										}}
									/>
									<Typography
										variant="h6"
										fontWeight={200}
										sx={{
										  letterSpacing: 1.2,
										}}
										component="div"
									>
										0982912617
									</Typography>
								</Box>
								<Box
									sx={{
									  display: 'flex',
									  gap: 2,
									  alignItems: 'center',
									}}
								>
									<Iconify
										icon="material-symbols:mail-outline"
										width={24}
										sx={{
										  color: 'primary.main',
										}}
									/>
									<Typography
										variant="h6"
										fontWeight={200}
										sx={{
										  letterSpacing: 1.2,
										}}
										component="div"
									>
										pagepals@gmail.com
									</Typography>
								</Box>
							</Box>

							<Box
								sx={{
								  display: 'flex',
								  flexDirection: 'column',
								  justifyContent: 'center',
								  alignItems: mdUp ? 'flex-start' : 'center',
								  ml: mdUp && 8,
								  gap: 2,
								}}
							>
								<Typography variant="h4" fontWeight={800} component="div">
									Connect with Us
								</Typography>

								<Box
									sx={{
									  display: 'flex',
									  justifyContent: 'flex-start',
									  alignItems: 'center',
									  gap: 2,
									}}
								>
									<Box
										sx={{
										  display: 'flex',
										  justifyContent: 'center',
										  alignItems: 'center',
										  p: 1,
										  borderRadius: '50%',
										  bgcolor: 'primary.main',
										  transition: 'all 0.3s ease-in-out',
										  ':hover': {
										    bgcolor: 'primary.dark',
										    cursor: 'pointer',
										  },
										}}
									>
										<Iconify
											icon="fa6-brands:instagram"
											width={20}
											sx={{
											  color: 'white',
											}}
										/>
									</Box>
									<Box
										sx={{
										  display: 'flex',
										  justifyContent: 'center',
										  alignItems: 'center',
										  p: 1,
										  borderRadius: '50%',
										  bgcolor: 'primary.main',
										  transition: 'all 0.3s ease-in-out',
										  ':hover': {
										    bgcolor: 'primary.dark',
										    cursor: 'pointer',
										  },
										}}
									>
										<Iconify
											icon="icon-park-outline:dribble"
											width={20}
											sx={{
											  color: 'white',
											}}
										/>
									</Box>
									<Box
										sx={{
										  display: 'flex',
										  justifyContent: 'center',
										  alignItems: 'center',
										  p: 1,
										  borderRadius: '50%',
										  bgcolor: 'primary.main',
										  transition: 'all 0.3s ease-in-out',
										  ':hover': {
										    bgcolor: 'primary.dark',
										    cursor: 'pointer',
										  },
										}}
									>
										<Iconify
											icon="icon-park-outline:big-x"
											width={20}
											sx={{
											  color: 'white',
											}}
										/>
									</Box>
									<Box
										sx={{
										  display: 'flex',
										  justifyContent: 'center',
										  alignItems: 'center',
										  p: 1,
										  borderRadius: '50%',
										  bgcolor: 'primary.main',
										  transition: 'all 0.3s ease-in-out',
										  ':hover': {
										    bgcolor: 'primary.dark',
										    cursor: 'pointer',
										  },
										}}
									>
										<Iconify
											icon="formkit:facebook"
											width={20}
											sx={{
											  color: 'white',
											}}
										/>
									</Box>
								</Box>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							sx={{
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center',
							  mt: !mdUp && 4,
							}}
						>
							<Box
								sx={{
								  display: 'flex',
								  flexDirection: 'column',
								  justifyContent: 'center',
								  alignItems: mdUp ? 'flex-start' : 'center',
								  gap: 2,
								  mr: mdUp && 8,
								  width: mdUp ? '100%' : '70%',
								}}
							>
								<Controller
									name="name"
									control={control}
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											required
											fullWidth
											label="Name"
											variant="outlined"
											error={!!fieldState.error}
										/>
									)}
								/>

								<Controller
									name="email"
									rules={{ required: true }}
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											required
											fullWidth
											label="Email"
											variant="outlined"
											error={!!fieldState.error}
										/>
									)}
								/>

								<Button
									type="submit"
									variant="contained"
									size="large"
									endIcon={<Iconify icon="iconamoon:send-bold" width={16} />}
									sx={{
									  mt: 2,
									  width: '100%',
									}}
								>
									Send
								</Button>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Form>
  );
};

export default SectionContact;
