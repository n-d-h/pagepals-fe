import { Box, Grid } from '@mui/material';
import React from 'react';
import ReaderEditForm from './ReaderEditForm';

const MainReaderEdit = () => {
  return (
        <Grid
            container
            rowSpacing={2}
            sx={{
              width: '100%',
              height: '100%',
            }}
        >
            <Grid item xs={12}>
                <Box sx={{ height: '100%', bgcolor: 'background.grey' }}>
                        <ReaderEditForm />
                </Box>
            </Grid>
        </Grid>
  );
};

export default MainReaderEdit;
