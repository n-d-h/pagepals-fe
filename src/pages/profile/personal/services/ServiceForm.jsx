import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import Form from '../../../../components/form/Form';
import { createServiceMutation, forceUpdateServiceMutation, updateServiceMutation } from '../../../../services/apolo/mutations';
import ServiceBookStep from './ServiceBookStep';
import ServiceInfoStep from './ServiceInfoStep';
import { ServicesSchema } from './Services.schema';
import { selectUser } from '../../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { ProfileServiceContext } from './ProfileServiceContext';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';

const steps = [
  {
    name: 'Choose Book',
    content: (props) => <ServiceBookStep {...props}></ServiceBookStep>,
  },
  {
    name: 'Service Info',
    content: (props) => <ServiceInfoStep {...props}></ServiceInfoStep>,
  },
];

const ServiceForm = (props) => {
  const data = props?.data;

  const userProfile = useSelector(selectUser);

  const [tempUpdateData, setTempUpdateData] = useState(null);

  const {
    setLoading,
  } = useContext(
    ProfileServiceContext,
  );

  const defaultEditData = {
    id: data?.id,
    book: data?.book,
    duration: data?.duration,
    price: data?.price,
    description: data?.description,
    serviceType: data?.serviceType,
    serviceTypeId: data?.serviceType?.id,
  };

  const methods = useForm({
    resolver: yupResolver(ServicesSchema),
    values: defaultEditData,
  });

  const {
    handleSubmit,
    setValue,
  } = methods;

  const [createService, { loading }] = useMutation(createServiceMutation, {
    onCompleted: () => {
      showNotification('success', 'Service created successfully');
    },

    onError: (e) => {
      handleFriendlyError(e, 'Failed to create service');
    },
  });

  const [updateService, { loading: updateLoading }] = useMutation(updateServiceMutation, {
    onCompleted: () => {
      showNotification('success', 'Service updated successfully');
      props.refetchReaderServices();
      props.closeDialog();
    },
    onError: () => {
      handleForceUpdate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const services = {
      ...data,
	  book: _.omit(data.book, ['__typename']),
      readerId: _.get(userProfile, 'reader.id', ''),
    };

    const submitData = _.omit(services, ['serviceType', props.data && 'book']);

    if (props.data) {
      try {
        const variables = {
          id: submitData.id,
          description: data.description,
          price: data.price,
          serviceTypeId: data.serviceTypeId,
        };

        setTempUpdateData(variables);

        await updateService({
          variables,
        });
      } catch (error) {
      } return;
    }

    try {
      await createService({
        variables: {
          service: submitData,
        },
      });
      props.closeDialog();
	    props.refetchReaderServices();
    } catch (error) {

    }
  });

  const [activeStep, setActiveStep] = useState(props.data ? 1 : 0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [forceUpdate, { loading: forceUpdateLoading }] = useMutation(
    forceUpdateServiceMutation,
    {
      onCompleted: () => {
        showNotification('success', 'Service updated successfully');
        props.closeDialog();
        props.refetchReaderServices();
      },
      onError: (e) => {
        handleFriendlyError(e, 'Failed to update service');
      },
    },
  );

  const [openUpdateDialog, closeForceDialog] = useDialog();
  const handleForceUpdate = () => {
    openDeleteDialog({
      title: 'Force Update Service',
      content: 'There are pending bookings for this service, are you sure to update?',
      dialog: [openUpdateDialog, closeForceDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        forceUpdate({
          variables: tempUpdateData,
        }).then((result) => {
          props.refetchReaderServices();
        });
      }
    });
  };

  useEffect(() => {
    setValue('readerId', _.get(userProfile, 'reader.id', ''), { shouldValidate: true });
    setValue('duration', 60);
  }, [setValue]);

  useEffect(() => {
    setLoading(loading || updateLoading || forceUpdateLoading);
  }
  , [loading, updateLoading]);

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
										<Typography component={'span'} variant="body1">
											{step.name}
										</Typography>
									</StepLabel>
								</Step>
							))}
						</Stepper>
					</Grid>

					<Grid item xs={12}>
						{steps[activeStep].content({
						  handleNext,
						  handleBack,
						  onSubmit,
						  data: props.data,
						})}
					</Grid>

					<Grid item xs={12}>
						<Box sx={{ mb: 2 }}>
							{activeStep === 1
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

					{activeStep === 1 && (
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
								loading={loading || updateLoading}
							>
								{props.data ? 'Update Service' : 'Create Service'}
							</LoadingButton>
						</Box>
					)}
				</Grid>
			</Form>
		</FormProvider>
  );
};

export default ServiceForm;
