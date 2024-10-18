import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Input, { inputClasses } from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { _ } from 'numeral';
import { useSelector } from 'react-redux';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { showNotification } from '../../../../components/common_services/CommonServices';
import { selectUser } from '../../../../redux/slices/authSlice';
import { customerCreatePaymentMutation } from '../../../../services/apolo/mutations';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import PaymentForm from './PaymentForm';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const STEP = 50;

const MIN_AMOUNT = 0;

const MAX_AMOUNT = 1000;

// ----------------------------------------------------------------------

export default function QuickTransfer ({ title, subheader, list, sx, ...other }) {
  const [autoWidth, setAutoWidth] = useState(24);

  const [amount, setAmount] = useState(0);

  const [processingPayment, setProcessingPayment] = useState(false);

  const userProfile = useSelector(selectUser);

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

  const [handleCustomerPayment, { data: paymentData }] = useMutation(customerCreatePaymentMutation);

  const handleOpenPayment = () => {
    window.open(paymentData?.createOrder?.payUrl, '_blank');
  };

  const handleTransfer = async (data) => {
    const callBackDialog = () => {
      closeDialog();
    };

    const updateConfig = async (data) => {
      await handleCustomerPayment({
        variables: {
          input: {
            amount: data.amount,
            id: _.get(userProfile, 'customer.id'),
          },
        },
      });

      if (paymentData) {
        setProcessingPayment(true);
        handleOpenPayment();
        setProcessingPayment(false);
      } else {
        showNotification('error', 'Cannot create payment. Please try again later.');
      }
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
				<ContentDialog
					title="Quick Deposit"
					form={PaymentForm}
					assetForm={{
					  data: {
					    amount,
					  },
					  update: updateConfig,
					}}
					callbackFnc={callBackDialog}
					showActions={false}
				/>
      ),
    });
  };

  const renderInput = (
    <Stack spacing={3} bgcolor={'#fff'} p={5} borderRadius={4} sx={{
      boxShadow: (theme) => theme.customShadows.z8,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Iconify icon="solar:cash-out-bold" width={18} height={18} color="GrayText" />
					<Typography variant="overline" sx={{ color: 'text.secondary' }}>
						Quick Deposit
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
        Deposit Now
      </Button>
    </Stack>
  );

  if (processingPayment) {
    return <BackdropLoading />;
  }

  return (
    <>
      <Stack
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
      </Stack>

    </>
  );
}

QuickTransfer.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------
export function InputAmount ({ autoWidth, amount, onBlur, onChange, sx, ...other }) {
  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={sx}>
      <Typography variant="h5">$</Typography>

      <Input
        disableUnderline
        size="small"
        value={amount}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{
          step: STEP,
          min: MIN_AMOUNT,
          max: MAX_AMOUNT,
          type: 'number',
        }}
        sx={{
          [`& .${inputClasses.input}`]: {
            p: 0,
            typography: 'h3',
            textAlign: 'center',
            width: autoWidth,
          },
        }}
        {...other}
      />
    </Stack>
  );
}

InputAmount.propTypes = {
  amount: PropTypes.number,
  autoWidth: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  sx: PropTypes.object,
};
