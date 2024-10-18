import { useQuery } from '@apollo/client';
import { Box, Grid } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getListWithdrawRequestByReader, getReaderTransactions } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import TransferTable from '../wallet/TransferTable';
import WithdrawTable from '../wallet/WithdrawTable';
import ProfileBalanceReader from './ProfileBalanceReader';
import { ReaderWalletContextProvider } from './ReaderWalletContext';

const ReaderWallet = () => {
  const user = useSelector(selectUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const [withdrawPage, setWithdrawPage] = useState(0);
  const [withdrawRowsPerPage, setWithdrawRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeWithdrawPage = (event, newPage) => {
    setWithdrawPage(newPage);
  };

  const handleChangeWithdrawRowsPerPage = (event) => {
    setWithdrawRowsPerPage(parseInt(event.target.value, 10));
    setWithdrawPage(0);
  };

  const { data, loading, refetch: transactionRefetch } = useQuery(getReaderTransactions, {
    variables: {
      id: _.get(user, 'reader.id', ''),
      filter: {
        page,
        pageSize: rowsPerPage,
        startDate,
        endDate,
        transactionType: '',
      },
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while getting transactions');
    },
    fetchPolicy: 'no-cache',
  });

  const { data: withdrawData, loading: withdrawLoading, refetch } = useQuery(getListWithdrawRequestByReader, {
    variables: {
      id: _.get(user, 'reader.id', ''),
      page: withdrawPage,
      pageSize: withdrawRowsPerPage,
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while getting transactions');
    },
    fetchPolicy: 'no-cache',
  });

  if (loading || withdrawLoading) return <BackdropLoading />;

  return (
    <ReaderWalletContextProvider>
        <Box>
            <Grid container justifyContent={'center'} alignItems={'center'} rowSpacing={4}>
                <Grid item xs={12} container direction={'column'} spacing={4}>
                  <Grid item container xs={12} spacing={4} alignItems={'start'}>
                    <Grid item xs={12}>
                        <ProfileBalanceReader refetch={refetch} transactionRefetch={transactionRefetch}/>
                    </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <WithdrawTable
                        title="Recent Withdrawal"
                        tableData={_.get(withdrawData, 'withdrawRequestsByReaderId.list', [])}
                        tableLabels={[
                          { id: 'amount', label: 'Amount' },
                          { id: 'date', label: 'Date' },
                          { id: 'status', label: 'Status' },
                          { id: '' },
                        ]}
                        paginationDataCount={_.get(withdrawData, 'withdrawRequestsByReaderId.paging.totalOfElements', 0)}
                        page={withdrawPage}
                        rowsPerPage={withdrawRowsPerPage}
                        onPageChange={handleChangeWithdrawPage}
                        onRowsPerPageChange={handleChangeWithdrawRowsPerPage}
                        sx={{
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TransferTable
                        title="Recent Transitions"
                        tableData={_.get(data, 'getListTransactionForReader.list', [])}
                        tableLabels={[
                          { id: 'type', label: 'Transaction Type' },
                          { id: 'date', label: 'Date' },
                          { id: 'amount', label: 'Amount' },
                          { id: 'status', label: 'Status' },
                          { id: '' },
                        ]}
                        type="reader"
                        startDate={startDate}
                        endDate={endDate}
                        handleStartDate={handleStartDate}
                        handleEndDate={handleEndDate}
                        paginationDataCount={_.get(data, 'getListTransactionForReader.paging.totalOfElements', 0)}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        }}
                    />
                </Grid>

            </Grid>
        </Box>
        </ReaderWalletContextProvider>
  );
};

export default ReaderWallet;
