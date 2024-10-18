import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import Form from '../../../../components/form/Form';
import RHFTextField from '../../../../components/hook-form/rhf-text-field';
import { selectUser } from '../../../../redux/slices/authSlice';
import { selectDollarExchangeRate } from '../../../../redux/slices/settingsSlice';
import { createWithdrawalMutation } from '../../../../services/apolo/mutations';
import { ReaderWalletContext } from '../readerWallet/ReaderWalletContext';
import { bankList } from './BankList';
import PaymentFormSchema from './PaymentForm.schema';

const WithdrawForm = (props) => {
  const { data, refetch, callBackDialog, tableRefetch, transactionRefetch } = props;

  const {
    setRefetchWalletAndTable,
  } = useContext(ReaderWalletContext);

  const userProfile = useSelector(selectUser);

  const methods = useForm({
    defaultValues: {
      ...data,
    },
    resolver: yupResolver(PaymentFormSchema),
  });

  const [handleReaderWithdrawal, { loading }] = useMutation(createWithdrawalMutation, {
    onCompleted: (data) => {
      refetch();
      tableRefetch();
      transactionRefetch();
      setRefetchWalletAndTable(true);
      callBackDialog();
      showNotification('success', 'Withdraw request created successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Withdraw request failed');
    },
  });

  const { handleSubmit, watch, control } = methods;

  const exchangeRate = useSelector(selectDollarExchangeRate);

  const amount = watch('amount');
  console.log('amount', amount, exchangeRate);

  const onSubmit = async (submitData) => {
    if (submitData.amount > data.amount) {
      showNotification('error', 'Cannot withdraw more than your balance.');
      return;
    }

    await handleReaderWithdrawal({
      variables: {
        input: {
          ...submitData,
        },
        id: _.get(userProfile, 'reader.id'),
      },
    });
  };

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
                        <Typography variant="subtitle1" mr={2}>Bank</Typography>
                        <Box sx={{ width: '60%' }}>
                <Controller name="bankName" control={control} render={({ field, fieldState: { error } }) => (
                            <Autocomplete
                            {...field}
                            onChange={(e, data) => field.onChange(data.name)}
                                options={bankList}
                                isOptionEqualToValue={(option, value) => option.name === value.name || option.name === value}
                                getOptionLabel={(option) => `${option.name} (${option.shortened})`}
                                renderInput={(params) => <TextField {...params} label="Choose a bank" variant="outlined" error={!!error}
                                    helperText={error?.message}
                                />}
                                style={{ width: 300 }}

                            />
                )} />

                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', px: 2, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" mr={2}>Card Number:</Typography>
                        <Box sx={{ width: '60%' }}>
                            <RHFTextField fullWidth name="bankAccountNumber" type="string" label="Card Number" />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', px: 2, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" mr={2}>Card Name:</Typography>
                        <Box sx={{ width: '60%' }}>
                            <RHFTextField fullWidth name="bankAccountName" label="Card Name" />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', px: 2, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" mr={2}>Amount</Typography>
                        <Box sx={{ width: '60%' }}>

                            <RHFTextField fullWidth name="amount" type="number" label="Amount" InputProps={{
                              endAdornment: <Typography variant="caption">$</Typography>,
                            }}/>
                        </Box>
                    </Box>

                    <Typography variant="caption" color="GrayText">
                        {`${amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                            }$ = ${(amount * exchangeRate).toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`}
                    </Typography>

                    <Box sx={{ display: 'flex', px: 2, justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <LoadingButton loading={loading} type="submit" variant="contained" sx={{ mt: 2 }}>
                            {'Withdraw'}
                        </LoadingButton>
                    </Box>
                </Box>
            </Form>
        </FormProvider>
  );
};

export default WithdrawForm;
