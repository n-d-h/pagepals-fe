import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useMutation } from '@apollo/client';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import { createNewStaff } from '../../../../services/apolo/mutations';

import FormProvider, { RHFTextField } from '../../../../components/hook-form/RHFIndex';

export default function UserQuickNewForm ({ currentUser, open, onClose, onCancel, tableData, setTableData }) {
  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
    }),
    [currentUser],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [createStaff, { loading }] = useMutation(createNewStaff, {
    onCompleted: () => {
      showNotification('success', 'Create successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Create fail');
    },

  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await createStaff({
        variables: {
          staff: {
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
            fullName: data.name,
          },
        },
      });

      if (loading) {
        isSubmitting(true);
      }

      if (response) {
        const newStaff = response.data.registerStaff;
        setTableData((prevTableData) => {
          return [newStaff, ...prevTableData];
        });
        reset();
        onClose();
      }

      // await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Staff</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Password will be sent to the user via email.
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >

            <RHFTextField name="username" label="Username (use to login)" />
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
            <RHFTextField name="phoneNumber" label="Phone Number" />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Create
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickNewForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
