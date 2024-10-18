import { useQuery } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import { getWithdrawRequests } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import WithdrawRequestTable from './WithdrawRequestTable';

const ReaderWithdrawalManagement = () => {
  const { data, loading, refetch } = useQuery(getWithdrawRequests, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Failed to load data');
    },
  });

  if (loading) return <BackdropLoading />;

  return (
        <Box sx={{
          padding: 4,
        }}>
            <Grid container justifyContent={'center'} alignItems={'center'} rowSpacing={4}>

                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Withdrawal Management
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <WithdrawRequestTable
                        title="Withdrawal Requests"
                        tableData={_.get(data, 'withdrawRequests', [])}
                        tableLabels={[
                          { id: 'info', label: 'Reader Information' },
                          { id: 'date', label: 'Date' },
                          { id: 'amount', label: 'Amount' },
                          { id: 'status', label: 'Status' },
                          { id: '' },
                        ]}
                        refetch={refetch}
                        sx={{
                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        }}
                    />
                </Grid>

            </Grid>
        </Box>
  );
};

export default ReaderWithdrawalManagement;
