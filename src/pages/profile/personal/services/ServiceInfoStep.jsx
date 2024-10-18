import { useQuery } from '@apollo/client';
import { Autocomplete, Box, Grid, MenuItem, Typography } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { RHFSelect } from '../../../../components/hook-form/rhf-select';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import { selectRevenueShare } from '../../../../redux/slices/settingsSlice';
import { getReaderServiceType } from '../../../../services/apolo/queries';

const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1 hour 30 minutes' },
];

const ServiceInfoStep = (props) => {
  const methods = useFormContext();

  const { data, loading } = useQuery(getReaderServiceType, {
    onError: (e) => {
      handleFriendlyError(e, 'Failed to fetch service type. Try again later.');
    },
  });

  const { setValue } = methods;

  const revenueShared = useSelector(selectRevenueShare);

  return (
		<Box sx={{ mt: 3 }}>
			<Typography variant="h4" sx={{ mb: 3 }}>
				Service Info
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<Autocomplete
						fullWidth
						disabled={props.data}
						options={data?.getListServiceType || []}
						getOptionLabel={(option) => option.name}
						value={methods.watch('serviceType')}
						isOptionEqualToValue={(option, value) => {
						  return option?.id === value?.id;
						}	}
                        loading={loading}
						onChange={(e, value) => {
						  setValue('serviceType', value);
						  setValue('serviceTypeId', value?.id);
						}}
						renderInput={(params) => (
							<RHFTextField
								{...params}
								label="Service Type"
								name="serviceType"
								required
							/>
						)}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<RHFTextField
						fullWidth
						label="Service Description"
						name="description"
						required
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<RHFTextField
						fullWidth
						label="Price"
						name="price"
						required
						helperText=
                        {`Income will be deducted ${revenueShared}% of the total price.`}
						InputProps={{
						  endAdornment: <Typography variant="subtitle1">pals</Typography>,
						}}
					/>

				</Grid>

				<Grid item xs={12} sm={6}>
					<RHFSelect name="duration" label="Duration" disabled>
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

export default ServiceInfoStep;
