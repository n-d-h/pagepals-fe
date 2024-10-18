import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { MenuItem, TextField } from '@mui/material';
import { fData } from '../../../components/common_services/format-number';
import FormProvider from '../../../components/hook-form/form-provider';
import { RHFSelect } from '../../../components/hook-form/rhf-select';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { RHFUploadAvatar } from '../../../components/hook-form/rhf-upload';
import Label from '../../../components/shadcn-ui/label';
import { updateCustomerMutation } from '../../../services/apolo/mutations';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { useMutation, useQuery } from '@apollo/client';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../auth/firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/slices/authSlice';
import { GET_USER } from '../../../auth/loginMethods';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
// ----------------------------------------------------------------------

const accountStateOptions = {
  ACTIVE: { label: 'Customer', color: 'success' },
  READER_PENDING: { label: 'Pending Reader', color: 'warning' },
  READER_ACTIVE: { label: 'READER', color: 'success' },
  BANNED: { label: 'Banned', color: 'error' },
  DELETED: { label: 'Deleted', color: 'error' },
};

const NewUserSchema = Yup.object().shape({
  dob: Yup.string().default(moment()),
  fullName: Yup.string().required('Full name is required'),
  gender: Yup.string(),
  imageUrl: Yup.mixed().nullable().required('Avatar is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
});

export default function ProfileEditForm ({ currentUser }) {
  const { data, loading: loadingData, refetch } = useQuery(GET_USER, {
    variables: {
      username: currentUser?.username,
    },
    fetchPolicy: 'no-cache',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.getAccountByUsername));
    }
  }, [data]);

  const defaultValues = useMemo(
    () => ({
      dob: moment(currentUser?.customer?.dob),
      fullName: currentUser?.customer?.fullName || '',
      gender: currentUser?.customer?.gender || '',
      email: currentUser?.email || '',
      imageUrl: currentUser?.customer?.imageUrl || null,
      userState: currentUser?.accountState?.name || 'CUSTOMER',
    }),
    [currentUser],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit, control,
    isSubmitting,
  } = methods;

  const values = watch();

  const [handleSubmitUpdateCustomer, { loading }] = useMutation(updateCustomerMutation, {
    onCompleted: () => {
      showNotification('success', 'User updated successfully');
      refetch();
    },
    onError: (e) => {
      handleFriendlyError(e, 'Failed to update user');
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const avatarUrl = await handleUploadFileToFirebaseAndSetToForm(data.imageUrl);

      const res = await handleSubmitUpdateCustomer({
        variables: {
          id: currentUser.customer.id,
          customer: {
            dob: moment(data.dob).format('YYYY-MM-DD'),
            fullName: data.fullName,
            imageUrl: avatarUrl,
            gender: data.gender,
          },
        },
      });

      if (res) {
        dispatch(setUser(res?.data?.updateCustomer?.account));
      }
    } catch (error) {
    }
  });

  const handleUploadFileToFirebaseAndSetToForm = async (file) => {
    if (!file) return null;

    if (typeof file === 'string') return file;

    try {
      const storageRef = ref(storage, `private_image/${file.name}`);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      return downloadURL;
    } catch (error) {
      showNotification('error', 'An error occurred during file upload.');
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('imageUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  if (loadingData) {
    return <BackdropLoading />;
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} alignItems={'start'}>
        <Grid xs={12} md={3}>
          <Card sx={{ pt: 5, pb: 0, px: 0, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            {currentUser && (
              <Label
                color={
                  accountStateOptions[values.userState]?.color
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {accountStateOptions[values.userState]?.label}
              </Label>
            )}

            <Box sx={{ mb: 3 }}>
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

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                sx={{
                  width: 180,
                  height: 180,
                }}
                name="imageUrl"
                maxSize={3145728}
                onDrop={handleDrop}
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

          </Card>
        </Grid>

        <Grid xs={12} md={9}>
          <Card sx={{ px: 3, pt: 5, pb: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="fullName" label="Full Name" />
              <RHFTextField name="email" label="Email Address" disabled />

              <RHFSelect name="gender" label="Gender">
                <MenuItem value={'MALE'}>
                  Male
                </MenuItem>
                <MenuItem value={'FEMALE'}>
                  Female
                </MenuItem>
              </RHFSelect>

              <Controller name="dob" control={control} render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Date of birth"
                    {...field}
                    format="YYYY-MM-DD"
                    renderInput={(params) => <TextField {...params} />}
                  />

                </LocalizationProvider>
              )} />

              <Controller
                name="userState"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Role"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={accountStateOptions[field.value]?.label || ''}
                    disabled
                  />
                )}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 7.8 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || loading}
              >
                {'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ProfileEditForm.propTypes = {
  currentUser: PropTypes.object,
};
