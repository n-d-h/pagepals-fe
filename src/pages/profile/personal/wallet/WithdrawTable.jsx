import PropTypes from 'prop-types';

import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import Label from '../../../../components/label/label';
import Scrollbar from '../../../../components/scrollbar';
import Image from '../../../../components/shadcn-ui/image';
import { TableHeadCustom, TablePaginationCustom } from '../../../../components/table';
import { fCurrency } from '../../../../utils/format-number';

// ----------------------------------------------------------------------

export const WithdrawalEnum = {
  PENDING: {
    label: 'Pending',
    color: 'warning',
  },

  ACCEPTED: {
    label: 'Accepted',
    color: 'success',
  },

  REJECTED: {
    label: 'Rejected',
    color: 'error',
  },
};

export default function WithdrawTable ({
  title,
  subheader,
  tableLabels,
  tableData,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  paginationDataCount,
  type,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflowY: 'scroll', px: 4, maxHeight: '45vh' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.length === 0
                ? (
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      No data
                    </TableCell>
                  </TableRow>
                  )
                : (
                    tableData.map((row) => (
                    <BankingRecentTransitionsRow type={type} key={row.id} row={row} />
                    ))
                  )}

            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{
        padding: 2,
        textAlign: 'right',
        '.MuiTablePagination-selectLabel': {
          margin: '0 !important',
        },
        '.MuiTablePagination-displayedRows': {
          margin: '0 !important',
        },
      }}>
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

WithdrawTable.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function BankingRecentTransitionsRow ({ row }) {
  const [openDialog, closeDialog] = useDialog();

  const handleOpenAcceptedDialog = () => {
    openDeleteDialog({
      title: 'Withdrawal Accepted',
      content: (
      // <Box sx={{
      //   width: '30vh',
      //   height: '30vh',
      // }}
      //   className="flex">
      //   <Image src={_.get(row, 'transactionImage')} sx={{ width: 200, height: 200 }} />
      // </Box>

        <Box sx={{
          width: '40vh',
          height: '50vh',
          flexDirection: 'column',
          gap: 2,
        }}
          className="flex"
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <Typography variant="h6" >
              Price
            </Typography>

            <Label
              color={'success'}
              variant="filled"
            >
              {`${fCurrency(row.amount)}`}
            </Label>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',

          }}>
            <Typography variant="h6" >
              Date
            </Typography>

            <Typography variant="body1" >
              {moment(row.createdAt).format('ll')}
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
            <Image src={_.get(row, 'transactionImage')} sx={{ width: 400, height: 400 }} />

          </Box>
        </Box>
      ),
      dialog: [openDialog, closeDialog],
      showActions: false,

    });
  };

  const handleOpenRejectedDialog = () => {
    openDeleteDialog({
      title: 'Withdrawal Rejected',
      content: (
        <Box sx={{
          width: '30vh',
          height: '20vh',
          flexDirection: 'column',
          gap: 2,
        }}
          className="flex"
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            <Typography variant="h6" >
              Price
            </Typography>

            <Label
              color={'success'}
              variant="filled"
            >
              {`${fCurrency(row.amount)}`}
            </Label>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',

          }}>
            <Typography variant="h6" >
              Date
            </Typography>

            <Typography variant="body1" >
              {moment(row.createdAt).format('ll')}
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',

          }}>
            <Typography variant="h6" gutterBottom>
              Reason
            </Typography>

            <Typography variant="body1" gutterBottom>
              {row?.rejectReason}
            </Typography>
          </Box>
        </Box>
      ),
      dialog: [openDialog, closeDialog],
      showActions: false,
    });
  };

  return (
    <>
      <TableRow>

        <TableCell>{`${fCurrency(row.amount)} ${'USD'
          }`}</TableCell>

        <TableCell>
          <ListItemText
            primary={moment(row.createdAt).format('HH:mm a')}
            secondary={moment(row.createdAt).format('ll')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Label variant={'filled'} color={WithdrawalEnum[row?.state].color}>
            {WithdrawalEnum[_.get(row, 'state')]?.label}
          </Label>
        </TableCell>

        <TableCell>
          <Button variant="outlined"
            disabled={row.state === 'PENDING'}
            color="primary" size="small" onClick={() => {
              if (row.state === 'ACCEPTED') {
                handleOpenAcceptedDialog();
              } else {
                handleOpenRejectedDialog();
              }
            }}>
            Additional Info
          </Button>
        </TableCell>

      </TableRow>
    </>
  );
}

BankingRecentTransitionsRow.propTypes = {
  row: PropTypes.object,
};
