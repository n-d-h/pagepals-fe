import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import Iconify from '../../../../components/iconify';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getReaderWallet } from '../../../../services/apolo/queries';
import { InputAmount } from '../wallet/QuickTransfer';
import WithdrawForm from '../wallet/WithdrawForm';

const STEP = 50;

const MIN_AMOUNT = 0;

const QuickWithdraw = ({ title, subheader, list, sx, refetch, ...other }) => {
  const [autoWidth, setAutoWidth] = useState(24);

  const [amount, setAmount] = useState(0);

  const userProfile = useSelector(selectUser);

  const { data } = useQuery(getReaderWallet, {
    variables: {
      id: userProfile?.id,
    },
  });

  const MAX_AMOUNT = _.get(data, 'getAccount.wallet.cash', 0);

  useEffect(() => {
    if (amount) {
      handleAutoWidth();
    }
  }, [amount]);

  const handleAutoWidth = useCallback(() => {
    const getNumberLength = amount.toString().length;
    setAutoWidth(getNumberLength * 24);
  }, [amount]);

  const handleChangeSlider = useCallback((event, newValue) => {
    setAmount(newValue);
  }, []);

  const handleChangeInput = useCallback((event) => {
    setAmount(Number(event.target.value));
  }, []);

  const handleBlur = useCallback(() => {
    if (amount < 0) {
      setAmount(0);
    } else if (amount > MAX_AMOUNT) {
      setAmount(MAX_AMOUNT);
    }
  }, [amount]);

  const [openDialog, closeDialog] = useDialog();

  const handleTransfer = async (data) => {
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
          title="Quick Withdraw"
          form={WithdrawForm}
          assetForm={{
            data: {
              amount,
            },
            tableRefetch: refetch,
            callBackDialog,
            update: updateConfig,
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  const renderInput = (
    <Stack spacing={3} bgcolor={'#fff'} p={5} borderRadius={2} sx={{
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    }}>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Iconify icon="solar:cash-out-bold" width={18} height={18} color="GrayText" />
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Current Balance
        </Typography>
      </Box>

      <InputAmount
        amount={amount}
        onBlur={handleBlur}
        autoWidth={autoWidth}
        onChange={handleChangeInput}
      />

      <Slider
        value={typeof amount === 'number' ? amount : 0}
        valueLabelDisplay="auto"
        step={STEP}
        marks
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        onChange={handleChangeSlider}
      />

      <Button
        size="large"
        color="inherit"
        variant="contained"
        disabled={amount === 0}
        onClick={handleTransfer}
      >
        Withdraw Now
      </Button>
    </Stack>
  );

  return (
    <>
      {/* <Stack
        sx={{
          borderRadius: 2,
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',

          ...sx,
        }}
        {...other}
      >
        <CardHeader title={title} subheader={subheader} />

        <Box>
          {renderInput}
        </Box>
      </Stack> */}
      {renderInput}
    </>
  );
};

export default QuickWithdraw;
