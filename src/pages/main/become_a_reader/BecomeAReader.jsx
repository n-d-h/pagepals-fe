/* eslint-disable no-unused-vars */
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { storage } from '../../../auth/firebase';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import Form from '../../../components/form/Form';
import { paths } from '../../../components/router/paths';
import { selectUser, setUser } from '../../../redux/slices/authSlice';
import { becomeReaderMutation } from '../../../services/apolo/mutations';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import BecomeAReaderSchema from './BecomeAReader.schema';
import BecomeAReaderStep1 from './BecomeAReaderStep1';
import BecomeAReaderStep2 from './BecomeAReaderStep2';
import BecomeAReaderStep3 from './BecomeAReaderStep3';
import BecomeAReaderStep4 from './BecomeAReaderStep4';
import { GET_USER } from '../../../auth/loginMethods';

const steps = [
  {
    name: 'BecomeAReaderStep1',
    content: (props) => <BecomeAReaderStep1 {...props} />,
  },
  {
    name: 'BecomeAReaderStep2',
    content: (props) => <BecomeAReaderStep2 {...props} />,
  },
  {
    name: 'BecomeAReaderStep3',
    content: (props) => <BecomeAReaderStep3 {...props} />,
  },
  {
    name: 'BecomeAReaderStep4',
    content: (props) => <BecomeAReaderStep4 {...props} />,
  },
];

const BecomeAReader = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loadingScreen, setLoadingScreen] = useState(false);

  const userProfile = useSelector(selectUser);

  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const methods = useForm({
    defaultValues: {},
    resolver: yupResolver(BecomeAReaderSchema),
  });

  const { handleSubmit, watch, setValue, trigger } = methods;

  const { loading: loadingData, refetch } = useQuery(GET_USER, {
    variables: {
      username: userProfile?.username,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      dispatch(setUser(data.getAccountByUsername));
    },
  });

  const dispatch = useDispatch();

  const avatar = watch('information.avatarUrl');
  const thumbnail = watch('information.thumbnailUrl');
  const introductionVideo = watch('information.introductionVideoUrl');

  const [handleBecomeAReader, { loading }] = useMutation(becomeReaderMutation, {
    onCompleted: () => {
      showNotification('success', 'Request to become a reader successfully!');
    },

    onError: (e) => {
      handleFriendlyError(e, 'Request to become a reader failed');
    },

  });

  const userInfo = useSelector(selectUser);

  const onSubmitBecomeAReader = async (data) => {
    setLoadingScreen(true); // Initiate loading screen at the start

    try {
      const { answers, information } = data;

      // Upload files in parallel for efficiency
      const [avatarUrl, thumbnailUrl, introductionVideoUrl] = await Promise.all([
        handleUploadFileToFirebaseAndSetToForm(avatar),
        handleUploadFileToFirebaseAndSetToForm(thumbnail),
        handleUploadFileToFirebaseAndSetToForm(introductionVideo),
      ]);

      // Check if any uploads failed
      if (!avatarUrl || !introductionVideoUrl) {
        showNotification('error', 'Failed to upload one or more files.');
      }

      // Execute the mutation to become a reader
      await handleBecomeAReader({
        variables: {
          accountId: userInfo?.id,
          information: {
            information: {
              ...information,
              avatarUrl,
              thumbnailUrl,
              audioDescriptionUrl: '',
              introductionVideoUrl,
            },
            answers,
          },
        },
      });

      refetch(); // Refetch the user data to update the UI

      navigate(paths.main.root);
    } catch (error) {
      // Ensure any errors are caught and shown
    } finally {
      // Set loading screen to false only here, after all operations are complete or if an error occurs
      setLoadingScreen(false);
    }
  };

  const handleUploadFileToFirebaseAndSetToForm = async (file) => {
    if (!file) return null;

    try {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      return downloadURL;
    } catch (error) {
      showNotification('error', 'An error occurred during file upload.');
    }
  };

  const { reader } = userProfile;

  if (reader !== null && reader?.status === 'INACTIVE') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography variant="h4">You have been banned or deleted as a reader</Typography>
      </Box>
    );
  }

  if (loadingScreen) {
    return <BackdropLoading />;
  }

  return (
		<FormProvider {...methods}>
			<Form onSubmit={handleSubmit(onSubmitBecomeAReader)}>
				<Box
					sx={{
					  width: '100%',
					  minHeight: '80vh',
					  display: 'flex',
					  justifyContent: 'center',
					  alignItems: 'center',
					  px: 20,
					  py: 5,
					}}
				>
					<Grid
						container
						spacing={2}
						sx={{
						  width: '100%',
						  height: '100%',
						}}
					>
						<Grid item xs={12}>
							{steps[activeStep].content({
							  handleNext,
							  handleBack,
							  onSubmit,
							  handleUploadFileToFirebaseAndSetToForm,
							})}
						</Grid>
					</Grid>
				</Box>
			</Form>
		</FormProvider>
  );
};

export default BecomeAReader;
