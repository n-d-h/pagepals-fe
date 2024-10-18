import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

import { roundedTimeToADefinedInterval } from '../../../../components/common_services/CommonServices';
import Form from '../../../../components/form/Form';
import RHFSwitch from '../../../../components/hook-form/rhf-switch';
import EventSchema from './EventSchema';

const CalendarForm = ({
  currentEvent,
  selectedRange,
  onClose,
  updateEvent,
  deleteEvent,
  createLoading,
}) => {
  const defaultStartTime = roundedTimeToADefinedInterval(
    selectedRange?.start || Date.now(),
    60,
    'ceil',
    'LLLL',
  );

  const defaultEndTime =
    selectedRange?.isRange
      ? roundedTimeToADefinedInterval(
        selectedRange?.end,
        60,
        'ceil',
        'LLLL',
      )
      : moment(defaultStartTime).add(60, 'minutes').format('LLLL');

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    values: {
      start: currentEvent?.start || defaultStartTime,
      end: defaultEndTime,
      ...currentEvent,
    },
  });

  const {
    control,
    handleSubmit,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const eventData = {
      startTime: moment(_.get(data, 'start')).format(),
      endTime: moment(_.get(data, 'end')).format(),
      isWeekly: _.get(data, 'isWeekly', false),
      isRange: selectedRange?.isRange,
    };

    updateEvent(eventData, 'update');
    onClose();
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(`${currentEvent?.id}`);
      onClose();
    } catch (error) { }
  }, [currentEvent?.id, onClose]);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Grid container spacing={3} sx={{ px: 3 }}>
          <Grid item xs={12} lg={6}>
            <Controller
              name="start"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDateTimePicker
                    {...field}
                    disabled
                    value={moment(field.value)}
                    onChange={(newValue) => {
                      if (newValue) {
                        const newDate = moment(newValue).format('LLLL');
                        field.onChange(newDate);
                      }
                    }}
                    label="Start date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <Controller
              name="end"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <MobileDateTimePicker
                    {...field}
                    disabled
                    value={moment(field.value)}
                    onChange={(newValue) => {
                      if (newValue) {
                        const newDate = moment(newValue).format('LLLL');
                        field.onChange(newDate);
                      }
                    }}
                    label="End date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          {!currentEvent?.id && (
          <Grid item xs={12}>
            <RHFSwitch name="isWeekly" label="Repeat this time of week for the next 3 months?" />
          </Grid>
          )}
        </Grid>

        <DialogActions
          sx={{
            mt: 4,
          }}
        >
          {!!currentEvent?.id && moment(currentEvent.end).isAfter(moment()) && (
            <Button onClick={onDelete} variant="outlined" color="error">
              Delete
            </Button>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={createLoading}
            disabled={!!currentEvent?.id}
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormProvider>
  );
};

CalendarForm.propTypes = {
  colorOptions: PropTypes.arrayOf(PropTypes.string),
  currentEvent: PropTypes.object,
  onClose: PropTypes.func,
};

export default CalendarForm;
