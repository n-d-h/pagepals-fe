/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from '../../../../../utils/format-time';
import { fCurrency } from '../../../../../utils/format-number';

import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

export default function AnswerDetailsContent ({ post, isCustomer }) {
  const {
    answers,
    createdAt,
    id,
    staffName,
    state,
    updatedAt,
  } = post;

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h4">{'List Reader\'s Answer'}</Typography>

      {answers.map((answer) => (
        <Stack key={answer.id} spacing={2}>
          <Typography variant="h6">{answer.question.content}</Typography>
          <Typography variant="body1">{answer.content}</Typography>
        </Stack>
      ))}
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

AnswerDetailsContent.propTypes = {
  post: PropTypes.object,
};
