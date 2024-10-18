import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from '../../../../components/hook-form/RHFIndex';

// ----------------------------------------------------------------------



export default function UserQuickEditForm({ currentUser, onClose, listStatus, onUpdate }) {

  const USER_STATUS_OPTIONS = listStatus.slice(1);

  // const USER_STATUS = listStatus
  //   .filter((status) => status.value === 'active' || status.value === 'deleted' || status.value === 'banned');

  const NewUserSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(() => {
    const formattedDob = currentUser?.customer?.dob
      ? new Date(currentUser.customer.dob).toLocaleDateString('en-GB')
      : '';

    return {
      username: currentUser?.username || '',
      name: currentUser?.customer?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      dob: formattedDob,
      gender: currentUser?.customer?.gender || '',
      status: currentUser?.accountState?.name?.toLowerCase() || '',
    };
  }, [currentUser]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    onUpdate(data);
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={true}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="warning" sx={{ mb: 3 }}>
            Account deleted can not be recovered
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
            <RHFSelect name="status" label="Status" disabled={currentUser?.accountState?.name?.toLowerCase() === 'deleted'} >
              {USER_STATUS_OPTIONS.map((status) => {
                return (
                  <MenuItem key={status.value} value={status.value} disabled={status.value === 'reader_pending' || status.value === 'reader_active'}>
                    {status.label}
                  </MenuItem>
                );
              })}
            </RHFSelect>

            <RHFTextField name="username" label="Username (use to login)" disabled />
            <RHFTextField name="name" label="Full Name" disabled />
            <RHFTextField name="email" label="Email Address" disabled />
            <RHFTextField name="phoneNumber" label="Phone Number" disabled />
            <RHFTextField name="dob" label="Date of birth" disabled />
            <RHFTextField name="gender" label="Gender" disabled />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
