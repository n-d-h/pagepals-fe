/* eslint-disable no-unused-vars */
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import ReaderMiniProfileCard from './ReaderMiniProfileCard';
import { useParams } from 'react-router';
import { getServiceByBook } from '../../../services/apolo/queries';
import { useQuery } from '@apollo/client';

const TopReader = props => {
  const { id } = useParams();

  const { data, error, loading } = useQuery(getServiceByBook, {
    variables: {
      id,
    },
  });

  const services = data?.getServicesByBook || [];
  const location = window.location.href;

  const isGuest = location.includes('guest');
  return (
    <>
    <Typography variant="h4">Top Services for this book</Typography>
    <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
    >
        {services?.services?.map((service) => (
            <Box
                key={service}
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: 'white',
                  borderRadius: 3,
                }}
            >
                <ReaderMiniProfileCard reader={service} isGuest={isGuest}/>
            </Box>
        ))}
    </Box>
</>
  );
};

TopReader.propTypes = {};

export default TopReader;
