import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Form from '../../../components/form/Form';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { EventSchema } from './EventSchema.schema';
import _ from 'lodash';

const CreateEventForm = (props) => {
  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      startAt: moment().add(1, 'weeks'),
    },
  });

  const { handleSubmit, control, setValue } = methods;

  const onSubmit = (data) => {
    props.update(data);
  };

  const onDelete = () => {
    props.delete(props.data.id);
  };

  useEffect(() => {
    if (props.data) {
      setValue('price', props.data.price !== undefined ? props.data.price : 1);
      setValue('limitCustomer', props.data.limitCustomer !== undefined ? props.data.limitCustomer : 1);
      setValue('startAt', props.data?.startAt !== undefined ? moment(props.data.startAt) : moment().add(1, 'weeks'));
    }
  }, [props.data]);

  return (
    <FormProvider {...methods}>
      <Form>
        <Grid container spacing={2} sx={{
          width: '100%',
          height: '100%',
        }}>
          <Grid item xs={12} lg={6}>
            <RHFTextField name={'price'} control={control} label={'Price'} fullWidth
              InputProps={{
                endAdornment: <Typography color={'green'} variant="subtitle1">pals</Typography>,
              }}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <RHFTextField name={'limitCustomer'} control={control} label={'Number of customers'} fullWidth />
          </Grid>

          <Grid item xs={12}>
            <Controller control={control} name={'startAt'} render={({ field, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDateTimePicker
                  sx={{ width: '100%' }}
                  label="Event Start Date"
                  value={moment(field.value)}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  fullWidth
                  format="YYYY-MM-DD HH:mm"
                  minDate={moment().add(1, 'weeks')}
                  maxDate={moment().add(2, 'weeks')}
                  renderInput={(params) => <TextField
                    fullWidth error={!!error}
                    helperText={error?.message} {...params}
                  />
                  }
                />
              </LocalizationProvider>
            )} />
          </Grid>
        </Grid>

        <Grid item xs={12} className='flex'>
          {!props.isCreating && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', my: 2, gap: 2 }}>
              {props.data !== undefined &&
                !_.isEmpty(props.data) &&
                (props.data.limitCustomer > props.data.activeSlot) &&
                (moment(props.data.startAt).add(props.data.seminar.duration, 'minutes').isAfter(moment()))
                ? (
                  <LoadingButton disabled onClick={handleSubmit(onDelete)} loading={props.loading} type="submit" variant="outlined" color="error">
                    Delete
                  </LoadingButton>
                ) : (
                  <LoadingButton onClick={handleSubmit(onDelete)} loading={props.loading} type="submit" variant="outlined" color="error">
                    Delete
                  </LoadingButton>
                )}
              {props.data !== undefined &&
                !_.isEmpty(props.data) &&
                (props.data.limitCustomer > props.data.activeSlot) &&
                (moment(props.data.startAt).add(props.data.seminar.duration, 'minutes').isAfter(moment()))
                && (
                  <LoadingButton disabled onClick={handleSubmit(onSubmit)} loading={props.loading} type="submit" variant="contained" color="primary">
                    Submit
                  </LoadingButton>
                )}
              {props.data !== undefined &&
                !_.isEmpty(props.data) &&
                (props.data.limitCustomer === props.data.activeSlot) &&
                (moment(props.data.startAt).add(props.data.seminar.duration, 'minutes').isAfter(moment()))
                && (
                  <LoadingButton onClick={handleSubmit(onSubmit)} loading={props.loading} type="submit" variant="contained" color="primary">
                    Submit
                  </LoadingButton>
                )}
            </Box>
          )}
          {props.isCreating && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', my: 2, gap: 2 }}>
              <LoadingButton onClick={handleSubmit(onSubmit)} loading={props.loading} type="submit" variant="contained" color="primary">
                Submit
              </LoadingButton>
            </Box>
          )}
        </Grid>
      </Form>
    </FormProvider>
  );
};

export default CreateEventForm;
