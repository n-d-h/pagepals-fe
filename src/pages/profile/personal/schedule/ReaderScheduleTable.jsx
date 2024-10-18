import PropTypes from 'prop-types';

import { Divider, Tab, Tabs } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { generatePath, useNavigate } from 'react-router';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label/label';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom, TablePaginationCustom } from '../../../../components/table';
import ScheduleDetail from './ScheduleDetail';
import { ScheduleStatusColorENUM, ScheduleStatusTextENUM } from './StatusENUM';

// ----------------------------------------------------------------------

const BookingStatus = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
    color: 'warning',
  },
  PROCESSING: {
    value: 'PROCESSING',
    label: 'Processing',
    color: 'info',
  },
  COMPLETE: {
    value: 'COMPLETE',
    label: 'Completed',
    color: 'success',
  },
  CANCEL: {
    value: 'CANCEL',
    label: 'Canceled',
    color: 'error',
  },
};

export default function ReaderScheduleTable({
  title,
  forRole = 'customer',
  subheader,
  tableLabels,
  tableData,
  refetch,
  paginationDataCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  bookingState,
  handleBookingState,
  ...other
}) {
  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} /> */}
      <Box sx={{ display: 'flex', px: 4, pb: 2, justifyContent: 'end' }}>
        <Tabs iconPosition="end" value={bookingState} onChange={(e, value) => handleBookingState(value)} aria-label="basic tabs example">
          {Object.keys(BookingStatus).map((key) => (
            <Tab key={key} value={BookingStatus[key].value} label={BookingStatus[key].label} color={
              BookingStatus[key].color
            } />
          ))}
        </Tabs>
      </Box>

      <TableContainer sx={{ overflowY: 'scroll', px: 4, maxHeight: '55vh' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>

              {
                tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No schedule found
                    </TableCell>
                  </TableRow>
                )
              }
              {tableData.length > 0 && tableData.map((row) => (
                <ScheduleTransitionRow key={row.id} row={row} refetch={refetch} bookingState={bookingState} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <TablePaginationCustom
          count={
            paginationDataCount
          }
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Box>

    </Card>
  );
}

ReaderScheduleTable.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

export const TableButton = ({ state, startAt, duration, handleJoinClick, bookingState }) => {
  const startAtMoment = moment(startAt).format('LLLL'); // Converts the startAt to a moment object
  const endAt = moment(startAtMoment).add(duration, 'minutes').format('LLLL'); // This calculates the end time by adding the duration to startAt
  const now = moment(); // Gets the current time

  switch (state) {
    case 'PENDING':
      if (bookingState === 'PENDING') {
        if (now.isSameOrAfter(startAt) && now.isSameOrBefore(endAt)
        ) {
          return (
            <Button sx={{
              minWidth: 100,
            }} variant='contained' color='primary' onClick={handleJoinClick}>Join</Button>
          );
        } else {
          return (
            <Button sx={{
              minWidth: 100,
            }} variant='contained' disabled>Not Started</Button>
          );
        }
      } else {
        return (
          <Button sx={{
            minWidth: 100,
          }} variant='contained' disabled>Ended</Button>
        );
      }

    case 'COMPLETE':
      return (
        <Button sx={{
          minWidth: 100,
        }} variant='contained' disabled>Completed</Button>
      );
    default:
      return (
        <Button sx={{
          minWidth: 100,
        }} variant='contained' disabled >Canceled</Button>
      );
  }
};

// ----------------------------------------------------------------------

function ScheduleTransitionRow({ row, refetch, bookingState }) {
  const theme = useTheme();

  const lightMode = theme.palette.mode === 'light';

  const renderAvatar = (
    <Box sx={{ position: 'relative', mr: 2 }}>
      <Badge
        overlap="circular"
        color={row.type === 'Income' ? 'success' : 'error'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Iconify
            icon={
              row.type === 'Income'
                ? 'eva:diagonal-arrow-left-down-fill'
                : 'eva:diagonal-arrow-right-up-fill'
            }
            width={16}
          />
        }
        sx={{
          [`& .${badgeClasses.badge}`]: {
            p: 0,
            width: 20,
          },
        }}
      >
        <Avatar
          src={_.get(row, 'customer.imageUrl')}
          sx={{
            width: 48,
            height: 48,
            color: 'text.secondary',
            bgcolor: 'background.neutral',
          }}
        >
          {row.category === 'Books' && <Iconify icon="eva:book-fill" width={24} />}
          {row.category === 'Beauty & Health' && <Iconify icon="solar:heart-bold" width={24} />}
        </Avatar>
      </Badge>
    </Box>
  );

  const recordingList = _.get(row, 'meeting.records').map((record) => record.duration);

  const [openDetailDialog, closeDetailDialog] = useDialog();

  const handleDetailClick = () => {
    const callBackDialog = () => {
      closeDetailDialog();
    };

    openDetailDialog({
      fullWidth: true,
      children: (
        <ContentDialog
          title="Booking Detail"
          form={ScheduleDetail}
          assetForm={{
            data: {
              row,
              recordingList,
              role: 'reader',
              bookingState,
              refetch,
            },
            closeDetailDialog,
          }}
          callbackFnc={callBackDialog}
          showActions={false}
        />
      ),
    });
  };

  const navigate = useNavigate();

  const [openJoinDialog, closeJoinDialog] = useDialog();
  const handleJoinClick = () => {
    openDeleteDialog({
      title: 'Note for Reader',
      content: (
        <ul>
          <li> You need to be present at the meeting for at least 40 minutes to complete the booking (when the customer is satisfied).</li>
          <li> We recommend completing the full 60 minutes, in case the customer responds that you do not complete in enough time.</li>
          <li> We will process base on the duration of meeting recording (Recording runs automatically).</li>
          <li> The system will automatically refund and cancel bookings that cannot be completed at 00:00 (GMT+7) every day.</li>
          <li> You can complete the booking manually or the system will automatically process it at 00:00 (GMT+7) every day.</li>
        </ul>
      ),
      dialog: [openJoinDialog, closeJoinDialog],
      dialogProps: {
        buttonStyle: {
          agreeButtonName: 'I understand',
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        const path = generatePath('/meeting-zoom/:MeetingID/:role/detail', {
          MeetingID: _.get(row, 'meeting.meetingCode'),
          role: 1,
        });

        navigate(path);
      }
    });
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAvatar}
          <ListItemText primary={_.get(
            row,
            'customer.fullName'
            ,
          )} secondary={_.get(
            row,

            'service.book.title',
            _.get(row, 'seminar.name', 'Seminar'),
          )} />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={moment(row?.startAt).format('MMM DD, YYYY')}
            secondary={moment(row?.startAt).format('hh:mm A')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{row.totalPrice + ' pals'}</TableCell>

        <TableCell>
          <Label
            variant={lightMode ? 'soft' : 'filled'}
            color={
              ScheduleStatusColorENUM[bookingState]
            }
          >
            {ScheduleStatusTextENUM[bookingState]}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <Button variant='outlined' color='primary' sx={{
            mx: 1,
          }}
            onClick={handleDetailClick}
          >Detail</Button>

          <TableButton
            row={row}
            state={_.get(row, 'state.name', 'PENDING')} startAt={_.get(row, 'startAt')}
            duration={_.get(row, 'service.duration', 0)}
            handleJoinClick={handleJoinClick}
            bookingState={bookingState}
          />

        </TableCell>

      </TableRow>

    </>
  );
}

ScheduleTransitionRow.propTypes = {
  row: PropTypes.object,
};
