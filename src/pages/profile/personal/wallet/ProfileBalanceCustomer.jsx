import { useMutation, useQuery } from '@apollo/client';
import { Box, Stack, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import Iconify from '../../../../components/iconify';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getCustomerWallet } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { customerCreatePaymentMutation } from '../../../../services/apolo/mutations';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import PaymentFullForm from './PamentFullForm';

const ProfileBalanceCustomer = () => {
  const user = useSelector(selectUser);
  const [balance, setBalance] = useState(0);

  const { data, loading: customerWalletLoading } = useQuery(getCustomerWallet, {
    variables: {
      id: user?.id,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting customer wallet');
    },
  });

  const [openDialog, closeDialog] = useDialog();

  const [handleCustomerPayment, { data: paymentData }] = useMutation(customerCreatePaymentMutation, {
    onError: (e) => {
      handleFriendlyError(e, 'Error while creating payment');
    },
  });

  const handleOpenPayment = () => {
    window.open(paymentData?.createOrder?.payUrl, '_blank');
  };

  const handleOpenPaymentDialog = () => {
    const callBackDialog = () => {
      closeDialog();
	  };

	  const updateConfig = async (data) => {
      await handleCustomerPayment({
		  variables: {
          input: {
			  amount: data.amount,
			  id: _.get(user, 'customer.id'),
          },
		  },
      });

      if (paymentData) {
		  handleOpenPayment();
      } else {
		  showNotification('error', 'Cannot create payment. Please try again later.');
      }
	  };

	  openDialog({
      maxWidth: 'md',
      fullWidth: true,
      children: (
				  <ContentDialog
					  title="Payment Data"
					  form={PaymentFullForm}
					  assetForm={{
					    update: updateConfig,
					  }}
					  callbackFnc={callBackDialog}
					  showActions={false}
				  />
      ),
	  });
  };

  useEffect(() => {
    if (data) {
      setBalance(_.get(
        data,
        'getAccount.wallet.tokenAmount',
        0,
      ));
    }
  }, [data]);

  if (customerWalletLoading) return <BackdropLoading />;

  return (
		<Stack
			spacing={3}
			bgcolor={'#fff'}
			p={5}
			borderRadius={2}
			sx={{
			  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
			}}
		>
			<Box
				sx={{
				  display: 'flex',
				  alignItems: 'center',
				  justifyContent: 'space-between',
				  gap: 1,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Iconify icon="bx:bxs-wallet" width={18} height={18} color="GrayText" />
					<Typography variant="overline" sx={{ color: 'text.secondary' }}>
						Current Balance
					</Typography>
				</Box>

				<Button variant="outlined" color="primary" size="small" onClick={handleOpenPaymentDialog}>
					Add More Pals
				</Button>
			</Box>

			<Box
				sx={{
				  display: 'flex',
				  alignItems: 'center',
				  justifyContent: 'space-evenly',
				}}
			>
				<Typography variant="h3">{
					`${balance} pals`
				}</Typography>
			</Box>

		</Stack>
  );
};

export default ProfileBalanceCustomer;
