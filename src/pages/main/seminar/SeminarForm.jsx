/* eslint-disable no-unused-vars */
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Step, StepLabel, Stepper, Tooltip } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { storage } from '../../../auth/firebase';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import Form from '../../../components/form/Form';
import { selectUser } from '../../../redux/slices/authSlice';
// import { createSeminarMutation, updateSeminarMutation } from '../../../services/apolo/mutations';
import { SeminarSchema } from './Seminar.schema';
import SeminarBookStep from './SeminarBookStep';
import SeminarInfoStep1 from './SeminarInfoStep1';
import SeminarInfoStep2 from './SeminarInfoStep2';

const steps = [
  {
    name: 'Choose Book',
    content: (props) => <SeminarBookStep {...props}></SeminarBookStep>,
  },
  {
    name: 'Seminar Info',
    content: (props) => <SeminarInfoStep1 {...props}></SeminarInfoStep1>,
  },
  {
    name: 'Seminar Info',
    content: (props) => <SeminarInfoStep2 {...props}></SeminarInfoStep2>,
  },
];

const SeminarForm = (props) => {
  const data = props?.data;

  const userProfile = useSelector(selectUser);

  const defaultEditData = {
    id: data?.id,
    book: data?.book,
    duration: data?.duration,
    price: data?.price,
    title: data?.title,
    description: data?.description,
    limitCustomer: data?.limitCustomer,
    activeSlot: data?.activeSlot,
    imageUrl: data?.imageUrl,
    startTime: moment(data?.startTime),
  };

  const methods = useForm({
    resolver: yupResolver(SeminarSchema),
    defaultValues: defaultEditData,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // const [createSeminar, { loading }] = useMutation(createSeminarMutation, {
  //   onCompleted: () => {
  //     showNotification('success', 'Seminar created successfully');
  //   },

  //   onError: (e) => {
  //     handleFriendlyError(e, 'Failed to create seminar');
  //   },

  // });
  // const [updateService, { loading: updateLoading }] = useMutation(updateSeminarMutation, {
  //   onCompleted: () => {
  //     showNotification('success', 'Service updated successfully');
  //   },

  //   onError: (e) => {
  //     handleFriendlyError(e, 'Failed to update service');
  //   },
  // });

  const [firebaseLoading, setFirebaseLoading] = useState(false);

  const handleUploadFileToFirebaseAndSetToForm = async () => {
    const imageUrl = watch('imageUrl');
    if (!imageUrl) return null;

    if (typeof imageUrl === 'string') return imageUrl;

    try {
      setFirebaseLoading(true);
      const storageRef = ref(storage, `private_image/${imageUrl.name}`);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, imageUrl);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      setFirebaseLoading(false);
      return downloadURL;
    } catch (error) {
      setFirebaseLoading(false);
      showNotification('error', 'An error occurred during file upload.');
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const imageUrl = await handleUploadFileToFirebaseAndSetToForm();

    const seminar = {
      ...data,
      book: _.omit(data.book, ['__typename']),
      readerId: _.get(userProfile, 'reader.id'),
      imageUrl,
      startTime: moment(data.startTime).format('YYYY-MM-DD HH:mm:ss'),
    };

    const submitData = seminar;

    // if (props.data) {
    //   try {
    //     await updateService({
    //       variables: {
    //         id: submitData.id,
    //         readerId: _.get(userProfile, 'reader.id'),
    //         seminar: {
    //           ..._.omit(submitData, ['id', 'readerId', 'book']),
    //         },
    //       },
    //     });
    //     props.closeDialog();
    //     props.refetch();
    //   } catch (error) {
    //   } return;
    // }

    // try {
    //   await createSeminar({
    //     variables: {
    //       seminar: submitData,
    //     },
    //   });
    //   props.closeDialog();
    //   props.refetch();
    // } catch (error) {
    // }
  });

  const [activeStep, setActiveStep] = useState(props.data ? 1 : 0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    setValue('readerId', _.get(userProfile, 'reader.id', ''));
  }, [setValue]);

  return (
          <FormProvider {...methods}>
              <Form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                  <Grid container spacing={3}>
                      <Grid item xs={12}>
                          <Stepper activeStep={activeStep} alternativeLabel>
                              {steps.map((step, index) => (
                                  <Step key={`step-${index}`}>
                                      <StepLabel
                                          sx={{
                                            cursor: 'pointer',
                                          }}
                                      >
                                      </StepLabel>
                                  </Step>
                              ))}
                          </Stepper>
                      </Grid>

                      <Grid item xs={12}>
                          {steps[activeStep].content({
                            methods,
                            handleNext,
                            handleBack,
                            onSubmit,
                          })}
                      </Grid>

                      <Grid item xs={12}>
                          <Box sx={{ mb: 2 }}>
                              {activeStep === 2
                                ? (
                                  <Button
                                      disabled={!_.isEmpty(data)}
                                      color="primary"
                                      variant="outlined"
                                      onClick={handleBack}
                                      sx={{ mt: 1, mr: 1 }}
                                  >
                                      Back
                                  </Button>
                                  )
                                : (
                                  <Tooltip
                                      title={
                                          _.isEmpty(methods.watch('book'))
                                            ? 'Please choose a book first'
                                            : 'Continue'
                                      }
                                  >
                                      <span>
                                          <Button
                                              variant="outlined"
                                              color="primary"
                                              disabled={_.isEmpty(methods.watch('book'))}
                                              onClick={() => {
                                                handleNext();
                                              }}
                                              sx={{ mt: 1, mr: 1 }}
                                          >
                                              Continue
                                          </Button>
                                      </span>
                                  </Tooltip>
                                  )}
                          </Box>
                      </Grid>

                      {activeStep === 2 && (
                          <Box
                              sx={{
                                mb: 2,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                          >
                              <LoadingButton
                                  size="large"
                                  onClick={onSubmit}
                                  variant="contained"
                                  // loading={loading || updateLoading || firebaseLoading}
                              >
                                  {props.data ? 'Update Seminar' : 'Create Seminar'}
                              </LoadingButton>
                          </Box>
                      )}
                  </Grid>
              </Form>
          </FormProvider>
  );
};

export default SeminarForm;
