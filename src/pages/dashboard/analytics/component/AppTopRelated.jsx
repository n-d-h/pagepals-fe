import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency, fShortenNumber } from '../../../../utils/format-number';

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import CustomImage from '../../../../components/image/CustomImage';
import image from '../../../../assets/landing/no-data.webp';


// ----------------------------------------------------------------------

export default function AppTopRelated({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        {list?.length > 0 ? <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((app) => (
            <ApplicationItem key={app.id} app={app} />
          ))}
        </Stack> :
          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <CustomImage src={image} sx={{ width: 320, height: 240 }} />
            <Box sx={{ mt: 5, color: 'text.secondary' }}>No data</Box>
          </Box>}
      </Scrollbar>
    </Card>
  );
}

AppTopRelated.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ApplicationItem({ app }) {
  const { totalBooking, service } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        variant="rounded"
        sx={{
          width: 48,
          height: 48,
          bgcolor: 'background.neutral',
        }}
      >
        <Box component="img" src={service?.book.smallThumbnailUrl} sx={{ width: 24, height: 24 }} />
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {service?.book.title}
        </Typography>

        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
          <Iconify
            width={14}
            icon={'ph:user-fill'}
          />

          <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
            {service?.reader.nickname}
          </Typography>

          <Label color={service?.price === 0 ? 'success' : 'error'}>
            {service?.price === 0 ? 'Free' : `${service?.price} pals`}
          </Label>
        </Stack>
      </Box>

      <Stack alignItems="flex-end">
        <Rating readOnly size="small" precision={0.5} name="reviews" value={service?.rating} />
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {totalBooking} bookings
        </Typography>
      </Stack>
    </Stack>
  );
}

ApplicationItem.propTypes = {
  app: PropTypes.object,
};
