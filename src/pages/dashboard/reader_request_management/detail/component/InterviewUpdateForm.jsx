import * as Yup from 'yup';
import { useMemo, useState } from 'react';
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

import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from '../../../../../components/hook-form/RHFIndex';
import { TextField } from '@mui/material';
// ----------------------------------------------------------------------



export default function InterviewUpdateForm({ onClose, onUpdate, setNote }) {

  const [state, setState] = useState('');

  const INTERVIEW_STATUS_OPTIONS = [
    {
      value: 'done',
      label: 'Done',
    },
    {
      value: 'missed',
      label: 'Missed',
    },
  ]
  const INTERVIEW_RESULT_OPTIONS = [
    {
      value: 'accepted',
      label: 'Accepted',
    },
    {
      value: 'rejected',
      label: 'Rejected',
    },
  ]

  // const USER_STATUS = listStatus
  //   .filter((status) => status.value === 'active' || status.value === 'deleted' || status.value === 'banned');

  const NewUserSchema = Yup.object().shape({
    state: Yup.string().required('State is required'),
    result: Yup.string().test('validate-result', 'Result cannot be accepted if state is missed', function(value) {
      const { state } = this.parent;
      if (state === 'missed' && value === 'accepted') {
        return false; // Validation fails
      }
      return true; // Validation passes
    }).required('Result is required'),
    // result: Yup.string().required('Result is required'),
    note: Yup.string().required('Note is required'),
  });

  const defaultValues = useMemo(() => {
    return {
      result: 'rejected',
    };
  }, []);

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
        <DialogTitle>Update Interview</DialogTitle>

        <DialogContent>
          
          <Alert variant="outlined" severity="warning" sx={{ mb: 3 }}>
            Please check carefully before updating the interview status
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            marginBottom={2}
          >
            <RHFSelect name="state" label="State" disabled={false} >
              {INTERVIEW_STATUS_OPTIONS.map((status) => {
                return (
                  <MenuItem key={status.value} value={status.value} disabled={false} onClick={() => setState(status.value)}>
                    {status.label}
                  </MenuItem>
                );
              })}
            </RHFSelect>

            <RHFSelect name="result" label="Result" disabled={false} >
              {INTERVIEW_RESULT_OPTIONS.map((status) => {
                return (
                  <MenuItem key={status.value} value={status.value} disabled={false}>
                    {status.label}
                  </MenuItem>
                );
              })}
            </RHFSelect>

            

          </Box>
          <RHFTextField fullWidth
              name="note"
              label="Note"
              // onChange={(e) => setNote(e.target.value)}
              multiline
              rows={4}
              style={{
                marginTop: 5,
              }} />
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

InterviewUpdateForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
