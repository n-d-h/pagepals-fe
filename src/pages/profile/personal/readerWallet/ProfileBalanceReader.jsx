/* eslint-disable no-unused-vars */
import { useQuery } from '@apollo/client';
import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import Iconify from '../../../../components/iconify';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getReaderWallet } from '../../../../services/apolo/queries';
import { fCurrency } from '../../../../utils/format-number';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import WithdrawForm from '../wallet/WithdrawForm';
import { ReaderWalletContext } from './ReaderWalletContext';

const ProfileBalanceReader = ({ refetch: tableRefetch, transactionRefetch }) => {
  const user = useSelector(selectUser);
  const [balance, setBalance] = useState(0);

  const {
    refetchWalletAndTable,
    setRefetchWalletAndTable,
  } = useContext(ReaderWalletContext);

  const { data, loading: readerWalletLoading, refetch } = useQuery(getReaderWallet, {
    variables: {
      id: user?.id,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data) {
      setBalance(_.get(
        data,
        'getAccount.wallet.cash',
        0,
      ));
    }
  }, [data]);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      if (refetchWalletAndTable) {
        await refetch(); // Assuming refetch is an async function
        if (isActive) {
          setRefetchWalletAndTable(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false; // This will handle the cleanup
      setRefetchWalletAndTable(false);
    };
  }, [refetchWalletAndTable]);

  const [openDialog, closeDialog] = useDialog();
  const handleWithdraw = async (data) => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (data) => {
      closeDialog();
    };

    openDialog({
      maxWidth: 'sm',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Withdraw"
          form={WithdrawForm}
          assetForm={{
            data: {
              amount: balance,
            },
            tableRefetch,
            transactionRefetch,
            refetch,
            callBackDialog,
            update: updateConfig,
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  if (readerWalletLoading) return <BackdropLoading />;

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

				<Button variant="outlined" color="primary" size="small" onClick={handleWithdraw}>
					Witdraw Now
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
					`${fCurrency(balance)} USD`
				}</Typography>
			</Box>
		</Stack>
  );
};

export default ProfileBalanceReader;
