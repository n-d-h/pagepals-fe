import { Box, Grid, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import RHFTextField from '../../../components/hook-form/rhf-text-field';
import { RHFUploadAvatar } from '../../../components/hook-form/rhf-upload';

const SeminarInfoStep1 = (props) => {
  const { methods } = props;

  const { setValue } = methods;

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

  return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Seminar Info
            </Typography>
            <Grid container spacing={3}>

                <Grid item xs={12} >
                    <RHFUploadAvatar
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
                                Upload a photo of the seminar
                            </Typography>
                        }
                    />
                </Grid>

                <Grid item xs={12} >
                    <RHFTextField
                        fullWidth
                        label="Seminar title"
                        name="title"
                        required
                    />
                </Grid>
                <Grid item xs={12} >
                    <RHFTextField
                        fullWidth
                        label="Seminar Description"
                        name="description"
                        required
                        multiline
                        rows={3}
                    />
                </Grid>
            </Grid>
        </Box>
  );
};

export default SeminarInfoStep1;
