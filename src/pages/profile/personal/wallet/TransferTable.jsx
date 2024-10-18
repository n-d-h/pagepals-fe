import PropTypes from 'prop-types';

import { TextField } from '@mui/material';
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
import { useTheme } from '@mui/material/styles';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import Label from '../../../../components/label/label';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom, TablePaginationCustom } from '../../../../components/table';
import { TransactionTypeEnum } from './TransactionTypeEnum';
import { fCurrency } from '../../../../utils/format-number';

// ----------------------------------------------------------------------

export default function TransferTable ({
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
  startDate,
  endDate,
  handleStartDate,
  handleEndDate,
  type,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

<Box sx={{ display: 'flex', px: 4, pb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <>
          <DesktopDatePicker
            label="From"
            value={moment(startDate)}
            sx={{
              mr: 2,

            }}
            onChange={(date) => {
              handleStartDate(date);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </>
        <DesktopDatePicker
          label="To"
          value={moment(endDate)}
          onChange={(date) => {
            handleEndDate(date);
          }}
          maxDate={moment()}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      </Box>

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
        p: {
          padding: 0,
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

TransferTable.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function BankingRecentTransitionsRow ({ row, type }) {
  const theme = useTheme();

  const lightMode = theme.palette.mode === 'light';

  return (
    <>
      <TableRow>

      <TableCell>
          <Label variant={'filled'} color={TransactionTypeEnum[row?.transactionType].color}>
            {TransactionTypeEnum[_.get(row, 'transactionType')]?.label}
          </Label>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={moment(row.createdAt).format('ll')}
            secondary={moment(row.createdAt).format('ll')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{`${fCurrency(row.amount)} ${
          type === 'reader' ? 'USD' : 'pals'
        }`}</TableCell>

        <TableCell>
          <Label
            variant={lightMode ? 'soft' : 'filled'}
            color={
              (row.status === 'SUCCESS' && 'success') ||
              (row.status === 'PENDING' && 'warning') ||
              'error'
            }
          >
            {row.status}
          </Label>
        </TableCell>

      </TableRow>
    </>
  );
}

BankingRecentTransitionsRow.propTypes = {
  row: PropTypes.object,
};
