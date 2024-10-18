import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { showNotification } from '../../../../components/common_services/CommonServices';
import Form from '../../../../components/form/Form';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import { selectUser } from '../../../../redux/slices/authSlice';
import { customerCreatePaymentMutation } from '../../../../services/apolo/mutations';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import PaymentFormSchema from './PaymentForm.schema';
import { selectDollarExchangeRate, selectTokenPrice } from '../../../../redux/slices/settingsSlice';

const PaymentForm = (props) => {
  const { data } = props;

  const userProfile = useSelector(selectUser);

  const methods = useForm({
    defaultValues: {
      ...data,
    },
    resolver: yupResolver(PaymentFormSchema),
  });

  const [handleCustomerPayment, { loading }] = useMutation(customerCreatePaymentMutation);

  const { handleSubmit, watch } = methods;

  const onSubmit = async (submitData) => {
    if (data.type !== 'withdraw') {
      await handleCustomerPayment({
        variables: {
          amount: submitData.amount,
          id: _.get(userProfile, 'customer.id'),
        },
      }).then((res) => {
        if (res) {
          window.open(res?.data?.createOrder?.payUrl, '_self');
        } else {
          showNotification('error', 'Cannot create payment. Please try again later.');
        }
      });
    } else {
      if (submitData.amount > data.amount) {
        showNotification('error', 'Cannot withdraw more than your balance.');
      } else { showNotification('error', 'Cannot withdraw right now. Please try again later.'); }
    }
  };

  const exchangeRate = useSelector(selectDollarExchangeRate);
  const tokenPrice = useSelector(selectTokenPrice);

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
        }}>

          <Box sx={{ display: 'flex', px: 2, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant="subtitle1" mr={2}>Amount</Typography>

              <RHFTextField fullWidth name="amount" type="number" label="Amount" />

          </Box>

          <Typography variant="caption" color="GrayText">
            {`${watch('amount')
              } pals = ${watch('amount') * exchangeRate * tokenPrice} VND`}
          </Typography>

          <Box sx={{ display: 'flex', px: 2, justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <LoadingButton loading={loading} type="submit" variant="contained" sx={{ mt: 2 }}>
              {data.type === 'withdraw' ? 'Withdraw' : 'Top Up'}
            </LoadingButton>
          </Box>
        </Box>
      </Form>
    </FormProvider>
  );
};

export default PaymentForm;
