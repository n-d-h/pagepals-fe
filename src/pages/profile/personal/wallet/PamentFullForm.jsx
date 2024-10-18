import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Avatar, Box, Button, Chip, Divider, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { showNotification } from '../../../../components/common_services/CommonServices';
import Form from '../../../../components/form/Form';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import Iconify from '../../../../components/iconify';
import { selectUser } from '../../../../redux/slices/authSlice';
import { customerCreatePaymentMutation } from '../../../../services/apolo/mutations';
import { selectDollarExchangeRate, selectTokenPrice } from '../../../../redux/slices/settingsSlice';

const paymentOptions = [
  {
    icon: 'mdi:credit-card',
    price: 100,
  },
  {
    icon: 'mdi:credit-card',
    price: 200,
  },
  {
    icon: 'mdi:credit-card',
    price: 500,
  },
];

const PaymentFullForm = () => {
  const userProfile = useSelector(selectUser);

  const methods = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const [handleCustomerPayment, { loading }] = useMutation(customerCreatePaymentMutation);

  const { handleSubmit, formState: { errors } } = methods;

  const exchangeRate = useSelector(selectDollarExchangeRate);
  const tokenPrice = useSelector(selectTokenPrice);

  const onSubmit = async (data) => {
    await handleCustomerPayment({
      variables: {
        amount: data.amount,
        id: _.get(userProfile, 'customer.id'),
      },
    }).then((res) => {
      if (res) {
        window.close();
        window.open(res?.data?.createOrder?.payUrl, '_self');
      } else {
        showNotification('error', 'Cannot create payment. Please try again later.');
      }
    });
  };

  console.log('errors', errors);
  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,

        }}>

          <Box sx={{ display: 'flex', px: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6">Choose some of our options</Typography>
          </Box>

          {paymentOptions.map((option, index) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }} key={index}>
              <LoadingButton disabled={loading} fullWidth variant="outlined" onClick={() => {
                onSubmit({ amount: option.price });
              }} >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Iconify icon="mdi:credit-card" color='warning' />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${option.price} pals`} secondary={`Equivalent to: ${option.price * exchangeRate * tokenPrice} VND`} />
                </ListItem>
              </LoadingButton>
            </Box>
          ))}

          <Divider>
            <Chip label="OR" size="small" />
          </Divider>

          <Box sx={{ display: 'flex', px: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="subtitle1">Pay a custom amount</Typography>
          </Box>

          <Box >
            <RHFTextField fullWidth required name="amount" type="number" label="Amount" InputProps={{
              endAdornment: <Typography variant="caption" color={'GrayText'}>pals</Typography>,
            }} />
          </Box>

          <Box sx={{ display: 'flex', px: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="caption" color="GrayText">
              {`${methods.watch('amount')
                } pals = ${methods.watch('amount') * exchangeRate * tokenPrice} VND`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', px: 2, justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} loading={loading}>
              Pay Now
            </Button>
          </Box>
        </Box>

      </Form>
    </FormProvider>
  );
};

export default PaymentFullForm;
