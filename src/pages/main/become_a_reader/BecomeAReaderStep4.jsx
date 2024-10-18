import { Box, Button, Grid, Paper, Stack, Typography, alpha } from '@mui/material';
import { m } from 'framer-motion';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import iconVideo from '../../../assets/icons/files/ic_video.svg';
import iconImage from '../../../assets/icons/files/ic_img.svg';

import { varBounce, varFade } from '../../../components/animate/variants';
import { RHFUploadBox } from '../../../components/hook-form/rhf-upload';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Iconify from '../../../components/iconify';
import Image from '../../../components/shadcn-ui/image';

const BecomeAReaderStep4 = (props) => {
  const { setValue, watch } = useFormContext();

  const mdUp = useResponsive('up', 'md');
  const videoPreviewUrl = watch('information.introductionVideoUrl');
  const thumbnailPreviewUrl = watch('information.thumbnailUrl');

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
					  height: 'fit-content',
					  p: 5,
					  borderRadius: 4,
					}}
					elevation={4}
				>
					<Typography variant="h4" fontWeight={200}>
						{'Finally, some thing to let the customer to know you better!'}
					</Typography>

					<Grid
						container
						spacing={4}
						sx={{
						  width: '100%',
						  my: 1,
						}}
					>

						<Grid item xs={12} lg={6}>
							<Box
								sx={{
								  display: 'flex',
								  justifyContent: 'space-evenly',
								  alignItems: 'center',
								  flexDirection: 'column',
								  height: '100%',
								}}
							>
								<Typography variant="h6" gutterBottom>Your Introduction Video</Typography>
								<RHFUploadBox
									onDrop={(file) => {
									 setValue('information.introductionVideoUrl', file[0]);
									}}
									accept={{
									  'video/mp4': ['.mp4'],
									  'video/ogg': ['.ogg'],
									  'video/webm': ['.webm'],
									  'video/quicktime': ['.mov'],
									}}
									name="information.introductionVideoUrl"
									placeholder={
										videoPreviewUrl &&	typeof videoPreviewUrl !== 'string' &&
										(
										<Stack
										component={m.div}
										{...varFade().inUp}
										spacing={2}
										direction="row"
										alignItems="center"
										sx={{
										  my: 1,
										  py: 1,
										  px: 1.5,
										  borderRadius: 1,
										  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,

										}}
									  >
										<Image src={iconVideo} sx={{ width: 32, height: 32 }} />
									  </Stack>)

									}
								/>
							</Box>
						</Grid>

						<Grid item xs={12} lg={6}>
							<Box
								sx={{
								  display: 'flex',
								  justifyContent: 'space-evenly',
								  alignItems: 'center',
								  flexDirection: 'column',
								  height: '100%',
								}}
							>
								<Typography variant="h6" gutterBottom>Your Thumbnail Image</Typography>
								<RHFUploadBox
									onDrop={(file) => {
									 setValue('information.thumbnailUrl', file[0]);
									}}
									accept={{
									  'image/jpeg': ['.jpg', '.jpeg'],
									  'image/png': ['.png'],
									  'image/webp': ['.webp'],
									}}
									name="information.thumbnailUrl"
									placeholder={
										thumbnailPreviewUrl &&	typeof thumbnailPreviewUrl !== 'string' &&
										(
										<Stack
										component={m.div}
										{...varFade().inUp}
										spacing={2}
										direction="row"
										alignItems="center"
										sx={{
										  my: 1,
										  py: 1,
										  px: 1.5,
										  borderRadius: 1,
										  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,

										}}
									  >
										<Image src={iconImage} sx={{ width: 32, height: 32 }} />
									  </Stack>)

									}
								/>
							</Box>
						</Grid>
					</Grid>

					<Box
						sx={{
						  width: '100%',
						  display: 'flex',
						  justifyContent: 'center',
						  gap: 2,
						  mt: 2,
						}}
					>
						<Button
							variant="outlined"
							color="primary"
							size="large"
							onClick={() => {
							  props.handleBack();
							}}
							startIcon={<Iconify icon="akar-icons:arrow-left" />}
						>
							{'Back'}
						</Button>
						<Button
							variant="contained"
							color="primary"
							size="large"
							type="submit"
						>
							{'Submit'}
						</Button>
					</Box>
				</Paper>
			</m.div>
		</Box>
  );
};

export default BecomeAReaderStep4;
