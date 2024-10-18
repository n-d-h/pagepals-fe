import React from 'react';
import PropTypes from 'prop-types';
import { READERS } from '../../../const/ReadersExample';
import { Box, Grid } from '@mui/material';
import ReaderCard from '../../main/home/reader_view/ReaderCard';

const RelatedReaders = props => {
  const displayedReaders = READERS.slice(0, 12);

  return (
    <Box sx={{
      overflowX: 'auto',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey',
      },
    }}>
        <Grid container spacing={4} width={'100%'} wrap="nowrap">
          {displayedReaders.map((reader) => (
            <Grid key={reader.avatar} item xs={3} >
              <ReaderCard reader={reader} />
            </Grid>
          ))}
        </Grid>
      </Box>
  );
};

RelatedReaders.propTypes = {};

export default RelatedReaders;
