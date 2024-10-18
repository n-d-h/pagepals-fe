import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { m } from 'framer-motion';
import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { varBounce } from '../../../components/animate/variants';
import RHFAutocomplete from '../../../components/hook-form/rhf-autocomplete';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Iconify from '../../../components/iconify';
import { countries, uniqueLanguages } from '../../profile/personal/data';
import genres from '../../profile/personal/data/genres';
import { RHFUploadAvatar } from '../../../components/hook-form/rhf-upload';

const BecomeAReaderStep2 = (props) => {
  const { control, watch, trigger, setValue } = useFormContext();
  const mdUp = useResponsive('up', 'md');

  const filter = createFilterOptions();

  const watchLanguages = watch('information.languages');
  const watchCountry = watch('information.countryAccent');
  const watchGenres = watch('information.genres');
  const watchDescription = watch('information.description');
  const watchNickname = watch('information.nickname');
  const watchAvatarUrl = watch('information.avatarUrl');

  const checkValid = () => {
    if (
      watchLanguages &&
			watchCountry &&
			watchGenres &&
			watchDescription &&
			watchNickname &&
			watchAvatarUrl
    ) {
      return true;
    }
    trigger('information.languages');
    trigger('information.countryAccent');
    trigger('information.genres');
    trigger('information.description');
    trigger('information.nickname');
    trigger('information.avatarUrl');

    return false;
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('information.avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  return (
		<Box
			sx={{
			  width: '100%',
			  height: '100%',
			}}
		>
			<m.div
				variants={varBounce().in}
				style={{
				  width: '100%',
				  height: '100%',
				  display: 'flex',
				  alignItems: 'center',
				  justifyContent: 'center',
				}}
			>
				<Paper
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: 'center',
					  width: mdUp ? '50%' : '100%',
					  height: 'fit-content',
					  p: 5,
					  borderRadius: 4,
					}}
					elevation={4}
				>
					<Typography variant="h4" fontWeight={200}>
						{"First, let's get to know you a little better!"}
					</Typography>

					<Grid
						container
						spacing={4}
						sx={{
						  width: '100%',
						  my: 1,
						}}
					>

						<Grid item xs={12}>
							<Box
								sx={{
								  display: 'flex',
								  justifyContent: 'space-evenly',
								  alignItems: 'center',
								  flexDirection: 'column',
								  height: '100%',
								}}
							>
								<RHFUploadAvatar
									onDrop={handleDrop}
									name="information.avatarUrl"
								/>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<RHFTextField
								name="information.nickname"
								control={control}
								label="Name"
								required
								onChange={(e) => {
								  setValue('information.nickname', e.target.value, {
								    shouldValidate: true,
								  });
								  trigger('information.nickname');
								}}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<RHFAutocomplete
								name="information.languages"
								label="Language"
								options={uniqueLanguages}
								getOptionLabel={(option) => option}
								isOptionEqualToValue={(option, value) => option === value}
								required
								multiple
								renderOption={(props, option) => {
								  return (
										<li {...props} key={option}>
											{option}
										</li>
								  );
								}}
							/>
						</Grid>

						<Grid item xs={12} md={4}>
							<RHFAutocomplete
								name="information.countryAccent"
								options={countries.map((country) => country.label)}
								getOptionLabel={(option) => option}
								isOptionEqualToValue={(option, value) => option === value}
								required
								label="Accent"
								renderOption={(props, option) => {
								  const { code, label } = countries.filter(
								    (country) => country.label === option,
								  )[0];

								  if (!label) {
								    return null;
								  }

								  return (
										<li {...props} key={option.code}>
											<Iconify
												key={label}
												icon={`circle-flags:${code.toLowerCase()}`}
												width={28}
												sx={{ mr: 1 }}
											/>
											{label}
										</li>
								  );
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<RHFAutocomplete
								name="information.genres"
								label="Genres focus"
								multiple
								id="tags-filled"
								options={genres}
								freeSolo
								required
								renderTags={(value, getTagProps) =>
								  value.map((option, index) => (
										<Chip
											key={index}
											variant="outlined"
											label={option}
											{...getTagProps({ index })}
										/>
								  ))
								}
								filterOptions={(options, params) => {
								  const filtered = filter(options, params);

								  const { inputValue } = params;
								  // Suggest the creation of a new value
								  const isExisting = options.some(
								    (option) => inputValue === option.label,
								  );
								  if (inputValue !== '' && !isExisting) {
								    filtered.push(inputValue);
								  }

								  return filtered;
								}}
							/>
						</Grid>

						<Grid item xs={12}>
							<RHFTextField
								name="information.description"
								control={control}
								label="Description"
								placeholder="Tell us something about yourself"
								required
								multiline
								rows={4}
								onChange={(e) => {
								  setValue('information.description', e.target.value, {
								    shouldValidate: true,
								  });
								  trigger('information.description');
								}}
							/>
						</Grid>
					</Grid>

					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => {
						  if (checkValid()) {
						    props.handleNext();
						  }
						}}
						sx={{ mt: 2 }}
						endIcon={<Iconify icon="akar-icons:arrow-right" />}
					>
						{'Continue'}
					</Button>
				</Paper>
			</m.div>
		</Box>
  );
};

export default BecomeAReaderStep2;
