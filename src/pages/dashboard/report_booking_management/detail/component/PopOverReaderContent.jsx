import { Box, Grid } from '@mui/material';
import React from 'react';
import ReaderProfileCard from '../../../../profile/reader/ReaderProfileCard';

const PopOverReaderContent = (props) => {
  const { readerInfo } = props;

  return (
        <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
        >
            <Grid container columnSpacing={4} width={'100%'}>
                <Grid item xs={12} lg={8}>
                    <Box
                        sx={{
                          height: '100%',
                          borderRadius: 4,
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        }}
                    >
                        <ReaderProfileCard centered reader={readerInfo} />
                    </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Box
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                          width: '100%',
                        }}
                    >
                        <iframe
                            src={
                                _.get(
                                  readerInfo,
                                  'introductionVideoUrl',
                                )}
                            style={{ borderRadius: '18px' }}
                            width="100%"
                            height="100%"
                            title="video"
                        />

                    </Box>
                </Grid>
            </Grid>
        </Box>
  );
};

export default PopOverReaderContent;
