import { useMutation } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { paths } from '../../../components/router/paths';
import RouterLink from '../../../components/router/router-link';
import { customerMomoCheckPaymentMutation } from '../../../services/apolo/mutations';
import { LoadingPage } from '../../LoadingPage';

const Payment = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  // Initialize an object to hold all query parameters
  const allParams = {};

  // Use .forEach to iterate over all query parameters
  queryParams.forEach((value, key) => {
    allParams[key] = value;
  });

  const [checkPament, { loading: paymentLoading }] = useMutation(customerMomoCheckPaymentMutation, {
    onCompleted: () => {
      showNotification('success', 'Payment successful');
    },
    onError: (error) => {
      handleFriendlyError(error, 'Payment failed');
    },
  });

  const checkPayment = async () => {
    try {
      await checkPament({
        variables: {
          momoInfoCheck: allParams,
        },
      });
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!_.isEmpty(allParams)) {
      checkPayment();
    }
  }
  , []);

  if (paymentLoading) {
    return <LoadingPage height={'80vh'} />;
  }

  if (allParams.message !== 'Successful.') {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>Payment failed</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Typography variant="h4" fontWeight={800}>Payment successful</Typography>
      <Link
					component={RouterLink}
					to={paths.main.profile}
					underline="none"
				>
    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => {

    }}>Go back</Button>
    </Link>
    </Box>

  );
};

export default Payment;
