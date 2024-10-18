import PropTypes from 'prop-types';

import { Avatar, Badge, Button, ListItem, badgeClasses } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';
import { fCurrency } from '../../../utils/format-number';
import WithdrawRequestForm from './WithdrawRequestForm';

// ----------------------------------------------------------------------

const WithdrawalEnum = {
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

export default function WithdrawRequestTable ({
  title,
  subheader,
  tableLabels,
  tableData,
  refetch,
  ...other
}) {
  return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

            <TableContainer sx={{ overflowY: 'scroll', px: 4, maxHeight: '65vh' }}>
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
                                        <BankingRecentTransitionsRow refetch={refetch} key={row.id} row={row} />
                                  ))
                                )}

                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>
            {/*
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
      </Box> */}
        </Card>
  );
}

WithdrawRequestTable.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function BankingRecentTransitionsRow ({ row, refetch }) {
  const [openDialog, closeDialog] = useDialog();

  const handleWithdrawRequestDialog = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    openDialog({
      fullWidth: true,
      children: (
            <ContentDialog
              title="Withdraw Request"
              form={WithdrawRequestForm}
              assetForm={{
                data: row,
                refetch,
                closeDialog: callBackDialog,
              }}
              callbackFnc={callBackDialog}
              showActions={false}
            />
      ),

    });
  };

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
          src={_.get(row, 'reader.avatarUrl')}
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

  return (
        <>
            <TableRow>
                <TableCell>
                    <ListItem>
                        {renderAvatar}
                        <ListItemText
                            primary={_.get(row, 'reader.nickname')}
                            primaryTypographyProps={{ typography: 'body2' }}
                            secondaryTypographyProps={{
                              mt: 0.5,
                              component: 'span',
                              typography: 'caption',
                            }} />
                    </ListItem>
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
                <TableCell>{`${fCurrency(row.amount)}`}</TableCell>

                <TableCell>
                    <Label variant={'filled'} color={WithdrawalEnum[row?.state].color}>
                        {WithdrawalEnum[_.get(row, 'state')]?.label}
                    </Label>
                </TableCell>

                <TableCell>
                    <Button variant="outlined"
                        disabled={row.state !== 'PENDING'}
                        color="success" size="small" onClick={() => {
                          handleWithdrawRequestDialog();
                        }}>
                        Update
                    </Button>

                </TableCell>

            </TableRow>
        </>
  );
}

BankingRecentTransitionsRow.propTypes = {
  row: PropTypes.object,
};
