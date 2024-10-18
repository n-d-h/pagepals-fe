import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function ReportDetailsToolbar ({
  publish,
  backLink,
  editLink,
  liveLink,
  state,
  bookingReport,
  readerReport,
  interviewDate,
  setInterviewDate,
  description,
  setDescription,
  publishOptions,
  onChangePublish,
  onReject,
  onAcceptRequest,
  handleRefund,
  interviewLoading,
  rejectLoading,
  refundLoading,
  sx,
  rejectLabel,
  acceptLabel,
  handleBanReader,
  banLoading,
  ...other
}) {
  const renderButton = (
    <>
      <LoadingButton
        color="error"
        variant="outlined"
        onClick={onReject}
        loading={rejectLoading}
        sx={{ textTransform: 'capitalize' }}
      >
        {rejectLabel || 'Reject'}
      </LoadingButton>

      {bookingReport && (<LoadingButton
        color="success"
        variant="outlined"
        loading={refundLoading}
        onClick={handleRefund}
        sx={{ textTransform: 'capitalize' }}
      >
        {acceptLabel || 'Accept'}
      </LoadingButton>)}

      {readerReport && (<LoadingButton
        color="warning"
        variant="outlined"
        loading={banLoading}
        onClick={handleBanReader}
        sx={{ textTransform: 'capitalize' }}
      >
        Ban Reader
      </LoadingButton>)}

    </>
  );

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >

        <Box sx={{ flexGrow: 1 }} />

        {renderButton}
      </Stack>

    </>
  );
}

ReportDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  sx: PropTypes.object,
};
