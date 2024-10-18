import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Chip,
  Grid,
  MenuItem,
  Stack,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { alpha } from '@mui/system';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import iconVideo from '../../../assets/icons/files/ic_video.svg';
import iconImage from '../../../assets/icons/files/ic_img.svg';
import { storage } from '../../../auth/firebase';
import { GET_USER } from '../../../auth/loginMethods';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import Form from '../../../components/form/Form';
import RHFAutocomplete from '../../../components/hook-form/rhf-autocomplete';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { RHFUploadAvatar, RHFUploadBox } from '../../../components/hook-form/rhf-upload';
import Iconify from '../../../components/iconify';
import Image from '../../../components/shadcn-ui/image';
import { selectUser, setUser } from '../../../redux/slices/authSlice';
import { updateReaderProfile } from '../../../services/apolo/mutations';
import { fData } from '../../../utils/format-number';
import { countries, uniqueLanguages } from '../../profile/personal/data';
import genres from '../../profile/personal/data/genres';
import UpdateReaderSchema from './ReaderEditForm.schema';

const ReaderEditForm = () => {
  const userProfile = useSelector(selectUser);
  const [loadingScreen, setLoadingScreen] = useState(false);

  const dispatch = useDispatch();

  const { loading: loadingData } = useQuery(GET_USER, {
    variables: {
      username: userProfile?.username,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      dispatch(setUser(data.getAccountByUsername));
    },
  });

  const convertFromStringToArray = (data) => {
    if (data) {
      return data.split(',');
    }
  };

  const methods = useForm({
    values: {
      nickname: _.get(userProfile, 'reader.nickname'),
      description: _.get(userProfile, 'reader.description'),
      audioDescriptionUrl: _.get(userProfile, 'reader.audioDescriptionUrl'),
      introductionVideoUrl: _.get(userProfile, 'reader.introductionVideoUrl'),
      avatarUrl: _.get(userProfile, 'reader.avatarUrl'),
      countryAccent: _.get(userProfile, 'reader.countryAccent'),
      languages: convertFromStringToArray(_.get(userProfile, 'reader.language')),
      genres: convertFromStringToArray(_.get(userProfile, 'reader.genre')),
	  thumbnailUrl: _.get(userProfile, 'reader.thumbnailUrl'),
    },
    resolver: yupResolver(UpdateReaderSchema),
  });

  const { control, handleSubmit, setValue, watch } = methods;

  const videoPreviewUrl = watch('introductionVideoUrl');
  const avatar = watch('avatarUrl');
  const thumbnail = watch('thumbnailUrl');

  const filter = createFilterOptions();

  const [updateReader, { loading }] = useMutation(updateReaderProfile, {
    onCompleted: () => {
      showNotification('success', 'Update successfully.');
    },

    onError: (e) => {
      handleFriendlyError(e, 'Update failed');
    },
  });

  const onSubmit = async (data) => {
    setLoadingScreen(true); // Initiate loading screen at the start

    try {
      // Upload files in parallel for efficiency
      const [avatarUrl, introductionVideoUrl, thumbnailUrl] = await Promise.all([
        handleUploadFileToFirebaseAndSetToForm(avatar),
        handleUploadFileToFirebaseAndSetToForm(videoPreviewUrl),
        handleUploadFileToFirebaseAndSetToForm(thumbnail),
      ]);

      // Check if any uploads failed
      if (!avatarUrl || !introductionVideoUrl) {
        showNotification('error', 'Failed to upload one or more files.');
      }

      await updateReader({
        variables: {
          id: _.get(userProfile, 'reader.id'),
          data: {
            ...data,
            avatarUrl,
            audioDescriptionUrl: '',
            introductionVideoUrl,
            thumbnailUrl,
          },
        },
      });
    } catch (error) {
      // Ensure any errors are caught and shown
    } finally {
      // Set loading screen to false only here, after all operations are complete or if an error occurs
      setLoadingScreen(false);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  const handleUploadFileToFirebaseAndSetToForm = async (file) => {
    if (!file) return null;

    if (typeof file === 'string') return file;

    try {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      return downloadURL;
    } catch (error) {
      showNotification('error', 'An error occurred during file upload.');
    }
  };

  return (
		<FormProvider {...methods}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Box sx={{ mb: 3, pt: 1, width: '100%' }}>
					<Grid container spacing={3} alignItems={'start'}>
						<Grid item xs={12} md={9}>
							<Card sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
								<Grid
									container
									spacing={3}
								>
									<Grid item xs={12} md={6}>
										<RHFTextField
											name="nickname"
											label="Nick Name"
											required
											fullWidth
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<RHFAutocomplete
											name="languages"
											label="Language"
											options={uniqueLanguages}
											getOptionLabel={(option) => option}
											isOptionEqualToValue={(option, value) => option === value}
											required
											multiple
											renderOption={(props, option) => {
											  return (
													<MenuItem key={option} {...props}>
														{option}
													</MenuItem>
											  );
											}}
										/>
									</Grid>

									<Grid item xs={12} md={6}>
										<RHFAutocomplete
											name="countryAccent"
											options={countries.map((country) => country.label)}
											getOptionLabel={(option) => option}
											isOptionEqualToValue={(option, value) => option === value}
											required
											label="Accent"
											renderOption={(props, option) => {
											  const { code, label } = countries.filter(
											    (country) => country.label === option,
											  )[0];

											  if (!label) {
											    return null;
											  }

											  return (
													<li {...props} key={option.code}>
														<Iconify
															key={label}
															icon={`circle-flags:${code.toLowerCase()}`}
															width={28}
															sx={{ mr: 1 }}
														/>
														{label}
													</li>
											  );
											}}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<RHFAutocomplete
											name="genres"
											label="Genres focus"
											multiple
											id="tags-filled"
											options={genres}
											freeSolo
											required
											renderTags={(value, getTagProps) =>
											  value.map((option, index) => (
													<Chip
														key={index}
														variant="outlined"
														label={option}
														{...getTagProps({ index })}
													/>
											  ))
											}
											filterOptions={(options, params) => {
											  const filtered = filter(options, params);

											  const { inputValue } = params;
											  // Suggest the creation of a new value
											  const isExisting = options.some(
											    (option) => inputValue === option.label,
											  );
											  if (inputValue !== '' && !isExisting) {
											    filtered.push(inputValue);
											  }

											  return filtered;
											}}
										/>
									</Grid>

									<Grid item xs={12} md={6}>
										<RHFTextField
											name="description"
											control={control}
											label="Description"
											placeholder="Tell us something about yourself"
											required
											multiline
											rows={4}
											onChange={(e) => {
											  setValue('description', e.target.value, {
											    shouldValidate: true,
											  });
											}}
										/>
									</Grid>

									<Grid item xs={12} md={3}>
										<Box
											sx={{
											  display: 'flex',
											  justifyContent: 'space-evenly',
											  alignItems: 'center',
											  flexDirection: 'column',
											  height: '100%',
											}}
										>
											<Typography variant="body2" gutterBottom>Your Introduction Video</Typography>
											<RHFUploadBox
												onDrop={(file) => {
												  setValue('introductionVideoUrl', file[0]);
												}}
												accept={{
												  'video/mp4': ['.mp4'],
												  'video/ogg': ['.ogg'],
												  'video/webm': ['.webm'],
												  'video/quicktime': ['.mov'],
												}}
												name="introductionVideoUrl"
												placeholder={
													videoPreviewUrl &&
													(
														<Stack
															className='animate__animated animate__fadeInUp animate__faster'
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
														</Stack>
													)

												}
											/>
										</Box>
									</Grid>

									<Grid item xs={12} md={3}>
										<Box
											sx={{
											  display: 'flex',
											  justifyContent: 'space-evenly',
											  alignItems: 'center',
											  flexDirection: 'column',
											  height: '100%',
											}}
										>
											<Typography variant="body2" gutterBottom>Your Video Thumbnail</Typography>
											<RHFUploadBox
												onDrop={(file) => {
												  setValue('thumbnailUrl', file[0]);
												}}
												accept={{
												  'image/jpeg': ['.jpeg', '.jpg'],
												  'image/png': ['.png'],
												  'image/gif': ['.gif'],
												}}
												name="introductionVideoUrl"
												placeholder={
													thumbnail &&
													(
														<Stack
															className='animate__animated animate__fadeInUp animate__faster'
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
														</Stack>
													)

												}
											/>
										</Box>
									</Grid>
								</Grid>
							</Card>
						</Grid>

						<Grid item xs={12} md={3}>
							<Card sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>

								<Box sx={{ border: '1px solid #e5e7eb', borderRadius: 1.8 }}>
									<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
										<Box sx={{ mb: 1.2, mt: -1.8, px: 1, backgroundColor: 'white' }}>
											<Typography
												variant="h6"
												textAlign={'center'}
												fontWeight={600}
												fontSize={'1 rem'}
												fontFamily={'Public Sans, sans-serif'}
												color={'#637381'}>
												Avatar
											</Typography>
										</Box>
									</Box>

									<Box sx={{ mb: 2 }}>
										<RHFUploadAvatar
											name="avatarUrl"
											maxSize={3145728}
											onDrop={handleDrop}
											sx={{
											  width: 180,
											  height: 180,
											}}
											helperText={
												<Typography
													variant="caption"
													sx={{
													  mt: 3,
													  mx: 'auto',
													  display: 'block',
													  textAlign: 'center',
													  color: 'text.disabled',
													}}
												>
													Allowed *.jpeg, *.jpg, *.png, *.gif
													<br /> max size of {fData(3145728)}
												</Typography>
											}
										/>
									</Box>
								</Box>

							</Card>
						</Grid>

						<Grid item xs={12} sx={{
						  display: 'flex',
						  justifyContent: 'center',
						  alignItems: 'center',
						  width: '100%',
						  borderRadius: 2,
						  pb: 3,
						  mt: 3,
						  ml: 3,
						}}>
							<Stack alignItems="center">
								<LoadingButton
									size='medium'
									type="submit"
									variant="contained"
									loading={loading || loadingScreen || loadingData}
								>
									{'Save Changes'}
								</LoadingButton>
							</Stack>
						</Grid>

					</Grid>
				</Box>
			</Form>
		</FormProvider>
  );
};

export default ReaderEditForm;
