import { Box, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React from 'react';
import { Controller } from 'react-hook-form';
import { RHFSelect } from '../../../components/hook-form/rhf-select';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { useSelector } from 'react-redux';
import { selectRevenueShare } from '../../../redux/slices/settingsSlice';

const DURATION_OPTIONS = [
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },

];

const SeminarInfoStep2 = (props) => {
  const { methods } = props;

  const { setValue, control } = methods;

  const revenueShared = useSelector(selectRevenueShare);

  return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Service Info
            </Typography>
            <Grid container spacing={3}>

                <Grid item xs={12} sm={6}>
                    <Controller name="limitCustomer" control={control} render={({ field }) => (
                        <TextField
                            fullWidth
                            label="Number of participants"
                            {...field}
                            required
                            type="number"
                            onChange={(e) => {
                              field.onChange(e);
                              setValue('activeSlot', e.target.value);
                            }}
                        />
                    )} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <RHFTextField
                        fullWidth
                        label="Price"
                        name="price"
                        helperText=
                        {`Income will be deducted ${revenueShared}% of the total price.`}
                        required
                        InputProps={{
                          endAdornment: <Typography variant="subtitle1">pals</Typography>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Controller name="startTime" control={control} render={({ field }) => (
                        <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DesktopDateTimePicker
                                    label="Start Time"
                                    disablePast
                                    {...field}
                                    value={moment(field.value)}
                                    onChange={(newValue) => {
                                      if (newValue) {
                                        const newDate = moment(newValue).format('LLLL');
                                        field.onChange(newDate);
                                      }
                                    }}
                                    format="LLLL"
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                />

                            </LocalizationProvider>
                        </FormControl>
                    )} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <RHFSelect name="duration" label="Duration">
                        {DURATION_OPTIONS.map((duration) => (
                            <MenuItem key={duration.value} value={duration.value}>
                                {duration.label}
                            </MenuItem>
                        ))}
                    </RHFSelect>
                </Grid>

            </Grid>
        </Box>
  );
};

export default SeminarInfoStep2;
