import { useQuery } from '@apollo/client';
import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import { useResponsive } from '../../../../components/hooks/use-responsive';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getUserTransactions } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import ProfileBalanceCustomer from './ProfileBalanceCustomer';
import QuickTransfer from './QuickTransfer';
import TransferTable from './TransferTable';
import moment from 'moment';

const ProfileWallet = () => {
  const lgDown = useResponsive('down', 'lg');

  const user = useSelector(selectUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const { data, loading } = useQuery(getUserTransactions, {
    variables: {
      userId: _.get(user, 'customer.id', ''),
      filter: {
        page,
        pageSize: rowsPerPage,
        startDate,
        endDate,
        transactionType: '',
      },
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting transactions');
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) return <BackdropLoading />;

  return (
    <Box>
      <Grid container columnSpacing={4} rowSpacing={lgDown ? 4 : 0} justifyContent={'center'} alignItems={'start'}>
        <Grid item xs={12} lg={4} container direction={'column'} spacing={4}>
          <Grid item>
            <ProfileBalanceCustomer />

          </Grid>

          <Grid item>
            <QuickTransfer />
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <TransferTable
            title="Recent Transitions"
            tableData={_.get(data, 'getListTransactionForCustomer.list', [])}
            tableLabels={[
              { id: 'transactionId', label: 'Transaction Type' },
              { id: 'date', label: 'Date' },
              { id: 'amount', label: 'Amount' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
            startDate={startDate}
            endDate={endDate}
            handleStartDate={handleStartDate}
            handleEndDate={handleEndDate}
            paginationDataCount={_.get(data, 'getListTransactionForCustomer.paging.totalOfElements', 0)}
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
  );
};

export default ProfileWallet;
