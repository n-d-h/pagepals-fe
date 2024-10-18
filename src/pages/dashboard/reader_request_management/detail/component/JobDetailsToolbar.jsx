import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import RouterLink from '../../../../../components/router/router-link';

import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

export default function JobDetailsToolbar ({
  publish,
  backLink,
  editLink,
  liveLink,
  state,
  interviewDate,
  setInterviewDate,
  description,
  setDescription,
  publishOptions,
  onChangePublish,
  onReject,
  onAcceptRequest,
  onInterview,
  interviewLoading,
  sx,
  ...other
}) {
  const renderButton = (
    <>
      {/* <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDateTimePicker
          label="Interview Date"

          value={interviewDate}
          onChange={(date) => {
            setInterviewDate(date);
          }}
          format="YYYY-MM-DD HH:mm"
          minDate={moment()}
          renderInput={(params) => <TextField {...params} />}
        />

      </LocalizationProvider> */}

      <TextField
        label="Decription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        color="error"
        variant="contained"
        onClick={onReject}
        sx={{ textTransform: 'capitalize' }}
      >
        Reject
      </Button>
      {/* <Button
        color="success"
        variant="contained"
        onClick={onInterview}
        sx={{ textTransform: 'capitalize' }}
      >
        Interview
      </Button> */}
      <LoadingButton
        color="success"
        variant="contained"
        onClick={onInterview}
        sx={{ textTransform: 'capitalize' }}
        loading={interviewLoading}
      >
        Interview
      </LoadingButton>
    </>
  );

  const renderButtonInterviewPending = (
    <>
      <TextField
        label="Decription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        color="error"
        variant="contained"
        onClick={onReject}
        sx={{ textTransform: 'capitalize' }}
      >
        Reject
      </Button>
      <Button
        color="success"
        variant="contained"
        onClick={onAcceptRequest}
        sx={{ textTransform: 'capitalize' }}
      >
        Pass
      </Button>
    </>
  );

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          mt: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {state === 'ANSWER_CHECKING' && renderButton}
        {(state === 'INTERVIEW_PENDING' || state === 'INTERVIEW_SCHEDULING') && renderButtonInterviewPending}
      </Stack>

    </>
  );
}

JobDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  sx: PropTypes.object,
};
