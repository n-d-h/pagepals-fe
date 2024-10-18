import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '../../../../components/router/paths';
import RouterLink from '../../../../components/router/router-link';

import { fDate } from '../../../../utils/format-time';

import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

export default function ReaderReportItem ({ job, onView, onEdit, onDelete }) {
  const { reader, listReport } = job;

  return (
    <>
      <Card>
        <Stack sx={{ p: 3, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component={RouterLink} href={paths.dashboard.reportReaderDetail(
                _.get(job, 'listReport[0].id', ''),
              )} color="inherit">
                {_.get(listReport, `${[0]}.reason`, 'No Reason')}
              </Link>
            }
            secondary={`Lastest report: ${fDate(listReport[0]?.createdAt)}`}
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'red', typography: 'caption' }}
          >
            <Iconify width={16} icon="icon-park-solid:table-report" />
            {listReport?.length} Reports
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: reader?.nickname || 'Anonymous',
              icon: <Iconify width={16} icon="fa-solid:book-reader" sx={{ flexShrink: 0 }} />,
            },
            {
              label: reader?.description,
              icon: <Iconify width={16} icon="fluent:text-description-20-filled" sx={{ flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>
    </>
  );
}

ReaderReportItem.propTypes = {
  job: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};
