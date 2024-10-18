import { useQuery } from '@apollo/client';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getProfileReaderSchedule, getReaderEventSchedule } from '../../../../services/apolo/queries';
import { NothingTooSeePage } from '../../../NothingToSeePage';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import ReaderScheduleTable from './ReaderScheduleTable';
import SeminarScheduleTable from './SeminarScheduleTable';
import { el, id } from 'date-fns/locale';
import { set } from 'lodash';

const ReaderSchedule = () => {
  const userProfile = useSelector(selectUser);
  const [view, setView] = useState('service');

  const [bookingState, setBookingState] = useState('PENDING');
  const [sort, setSort] = useState('asc');


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleBookingState = (state) => {
    setBookingState(state);
    if (state === 'PENDING') {
      setSort('asc');
    } else {
      setSort('desc');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data: customerData, loading, error: customerError, refetch } = useQuery(getProfileReaderSchedule, {
    variables: {
      id: _.get(userProfile, 'reader.id', ''),
      filter: {
        page,
        pageSize: rowsPerPage,
        sort: sort,
        bookingState,
      },
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting reader schedule');
    },
    fetchPolicy: 'no-cache',
  });

  const { data: seminarData, loading: seminarLoading, error: seminarError, refetch: seminarRefetch } = useQuery(getReaderEventSchedule, {
    variables: {
      id: _.get(userProfile, 'reader.id', ''),
      filter: {
        page,
        pageSize: rowsPerPage,
        sort: sort,
        bookingState,
      },
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting reader schedule');
    },
    fetchPolicy: 'no-cache',
  });

  const handleChangeView = (e, value) => {
    if (value === 'service') {
      setView('service');
      setPage(0);
      setRowsPerPage(5);
      setBookingState('PENDING');
      setSort('asc');
      refetch({
        id: _.get(userProfile, 'reader.id', ''),
        filter: {
          page,
          pageSize: rowsPerPage,
          sort: sort,
          bookingState,
        },
      });
    }

    if (value === 'seminar') {
      setView('seminar');
      setPage(0);
      setRowsPerPage(5);
      setBookingState('PENDING');
      setSort('asc');
      seminarRefetch({
        id: _.get(userProfile, 'reader.id', ''),
        filter: {
          page,
          pageSize: rowsPerPage,
          sort: sort,
          bookingState,
        },
      });
    }
  };

  if (customerError || seminarError) {
    return <Box className="flex" sx={{
      height: '100%',
      minHeight: '80vh',
    }}>
      <NothingTooSeePage />
    </Box>;
  }

  return (
    <Box sx={{
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      borderRadius: 4,

      height: '100%',
    }}>

      <Box sx={{
        my: 4,
        ml: 7,
        mt: 4,
        width: '30%',
        alignSelf: 'start',
      }}>

        <Tabs
          value={view}
          onChange={handleChangeView}
          // textColor="inherit"
          // variant="standard"
          aria-label="basic tabs example"
        >
          <Tab
            value={'service'}
            disableRipple
            key={`toogle${'service'}`}
            aria-label="left aligned"
            label={'Service meetings'}
          />
          <Tab
            value={'seminar'}
            disableRipple
            key={`toogle${'seminar'}`}
            aria-label="left aligned"
            label={'Seminar events'}
          />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {view === 'service' &&
          (<Grid item xs={12}>
            <ReaderScheduleTable
              title="Service Schedule"
              tableData={_.get(customerData, 'getListBookingByReader.list', [])}
              refetch={refetch}
              bookingState={bookingState}
              handleBookingState={handleBookingState}
              paginationDataCount={_.get(customerData, 'getListBookingByReader.pagination.totalOfElements', 0)}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              tableLabels={[
                { id: 'description', label: 'Description' },
                { id: 'startAt', label: 'Start At' },
                { id: 'totalPrice', label: 'Price' },
                { id: 'state.name', label: 'Status' },
                { id: '' },
              ]}

              sx={{
                height: '100%',
              }}
            />
          </Grid>)
        }

        {view === 'seminar' &&
          (<Grid item xs={12}>
            <SeminarScheduleTable
              title="Seminar Schedule"
              tableData={_.get(seminarData, 'getListEventBookingByReader.list', [])}
              refetch={seminarRefetch}
              bookingState={bookingState}
              handleBookingState={handleBookingState}
              paginationDataCount={_.get(customerData, 'getListEventBookingByReader.pagination.totalOfElements', 0)}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              tableLabels={[
                { id: 'description', label: 'Description' },
                { id: 'startAt', label: 'Start At' },
                { id: 'totalPrice', label: 'Price' },
                { id: 'earnings', label: 'Earnings (expected)' },
                { id: 'bookings', label: 'Total Bookings' },
                // { id: 'state.name', label: 'Status' },
                { id: '' },
              ]}

              sx={{
                height: '100%',
              }}
            />
          </Grid>)
        }
        {loading && <Box><BackdropLoading /></Box>}
        {seminarLoading && <Box><BackdropLoading /></Box>}
      </Grid>
    </Box>
  );
};

export default ReaderSchedule;
