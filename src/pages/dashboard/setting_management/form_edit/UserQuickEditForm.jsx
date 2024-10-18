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

import FormProvider, { RHFTextField } from '../../../../components/hook-form/RHFIndex';

// ----------------------------------------------------------------------

export default function UserQuickEditForm ({ currency, currentUser, onClose, listStatus, onUpdate }) {
  const NewUserSchema = Yup.object().shape({
    key: Yup.string().required('Key is required'),
    value: Yup.number()
      .required('Value is required')
      .min(0, 'Value must not be negative'),
  });

  const defaultValues = useMemo(() => {
    return {
      key: currentUser?.key,
      value: currentUser?.value,
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
    const variables = {
      id: currentUser?.id,
      key: currentUser?.key,
      value: data.value,
    };
    onUpdate(variables);
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
            Setting value is very important, please be careful when updating.
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

            <RHFTextField name="key" label="Key" disabled />
            <RHFTextField name="value" label={`Value (${currency})`} type={'number'}/>

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
