import { useQuery } from '@apollo/client';
import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getProfileSchedule } from '../../../../services/apolo/queries';
import { NothingTooSeePage } from '../../../NothingToSeePage';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import ScheduleTable from './ScheduleTable';

const TableSchedule = () => {
  const userProfile = useSelector(selectUser);
  const [bookingState, setBookingState] = useState('PENDING');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleBookingState = (state) => {
    setBookingState(state);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data: customerData, loading: customerLoading, error: customerError, refetch } = useQuery(getProfileSchedule, {
    variables: {
      id: _.get(userProfile, 'customer.id', ''),
      filter: {
        page,
        pageSize: rowsPerPage,
        sort: 'desc',
        bookingState,
      },
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting customer schedule');
    },
    fetchPolicy: 'no-cache',
  });

  if (customerError) {
    return <Box className="flex" sx={{
      height: '100%',
    }}>
      <NothingTooSeePage />
    </Box>;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        borderRadius: 4,
      }}
    >

    <Grid container spacing={3}>
        <Grid item xs={12}>
          <ScheduleTable
            title="Meeting Schedule"
            tableData={_.get(customerData, 'getListBookingByCustomer.list', [])}
            refetch={refetch}
            bookingState={bookingState}
            handleBookingState={handleBookingState}
            paginationDataCount={_.get(customerData, 'getListBookingByCustomer.pagination.totalOfElements', 0)}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            tableLabels={[
              { id: 'description', label: 'Description' },
              { id: 'startAt', label: 'Date' },
              { id: 'totalPrice', label: 'Price (pals)' },
              { id: 'state.name', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        {customerLoading && <Box><BackdropLoading /></Box> }
      </Grid>
      </Box>
  );
};

export default TableSchedule;
