import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { fDate } from '../../../../../utils/format-time';

import { Button } from '@mui/material';
import Iconify from '../../../../../components/iconify';
import moment from 'moment';

// ----------------------------------------------------------------------

export default function InterviewDetailsContent ({ post, handleJoinClick, isCustomer }) {
  const {
    answers,
    createdAt,
    id,
    interviewAt,
    meetingCode,
    staffName,
    state,
    updatedAt,
  } = post;

  const startAtMoment = moment(interviewAt).format('LLLL'); // Converts the startAt to a moment object
  const endAt = moment(startAtMoment).add(60, 'minutes').format('LLLL'); // This calculates the end time by adding the duration to startAt
  const now = moment(); // Gets the current time

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h4">Interview Information</Typography>

        <Typography variant="h6">Interview Time</Typography>
        <Typography variant="body1">{`${moment(interviewAt).format('LLLL')} (Remmember to join within 60 minutes)` } </Typography>

        <Typography variant="h6">Meeting Code</Typography>
        <Typography variant="body1">{meetingCode}</Typography>

        <Typography variant="h6">Staff Assign</Typography>
        <Typography variant="body1">{staffName}</Typography>

        <Button
        variant="contained"
         color="primary"
         disabled={!now.isSameOrAfter(startAtMoment) || !now.isSameOrBefore(endAt)}
         onClick={handleJoinClick}
        >Join Meeting</Button>
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      {[
        {
          label: 'Request ID',
          value: id,
          icon: <Iconify icon="solar:user-id-bold" />,
        },
        {
          label: 'Request State',
          value: state,
          icon: <Iconify icon="fluent:status-20-filled" />,
        },
        {
          label: 'Create At',
          value: fDate(createdAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Update At',
          value: fDate(updatedAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Answer',
          value: answers.length + '/3 answer',
          icon: <Iconify icon="ic:round-question-answer" />,
        },
        {
          label: 'Staff Assign',
          value: staffName || 'No one',
          icon: <Iconify icon="solar:user-id-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          {item.label === 'Request State'
            ? (
            <ListItemText
              primary={item.label}
              secondary={item.value}
              primaryTypographyProps={{
                typography: 'body2',
                color: 'text.secondary',
                mb: 0.5,
              }}
              secondaryTypographyProps={{
                typography: 'subtitle2',
                color: 'red',
                component: 'span',
              }}
            />
              )
            : (
            <ListItemText
              primary={item.label}
              secondary={item.value}
              primaryTypographyProps={{
                typography: 'body2',
                color: 'text.secondary',
                mb: 0.5,
              }}
              secondaryTypographyProps={{
                typography: 'subtitle2',
                color: 'text.primary',
                component: 'span',
              }}
            />
              )}

        </Stack>
      ))}
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}

        {/* {renderCompany} */}
      </Grid>
    </Grid>
  );
}

InterviewDetailsContent.propTypes = {
  post: PropTypes.object,
};
