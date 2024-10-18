import { useQuery } from '@apollo/client';
import { Box, Card, CardContent, CardHeader, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import ChartArea from '../../../components/chart-view/chart-area';
import ChartPie from '../../../components/chart-view/chart-pie';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import AppWidget from '../../../components/ui/app-widget';
import { selectUser } from '../../../redux/slices/authSlice';
import { getReaderStatistic } from '../../../services/apolo/queries';
import { fCurrency, fNumber } from '../../../utils/format-number';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

const MainReader = () => {
  const now = moment();
  const lastMonth = moment().subtract(1, 'months');

  const userProfile = useSelector(selectUser);
  const [startDate, setStartDate] = React.useState(lastMonth.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = React.useState(now.format('YYYY-MM-DD'));

  const { data, loading } = useQuery(getReaderStatistic, {
    variables: {
      id: _.get(userProfile, 'reader.id', ''),
      startDate,
      endDate,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting reader statistic');
    },
    fetchPolicy: 'no-cache',
  });

  const readerStatistic = _.get(data, 'getReaderStatistics', []);

  const totalIncomeThisPeriod = fNumber(_.get(readerStatistic, 'totalIncomeInThisPeriod', 0));
  const totalIncomeAllTime = fNumber(_.get(readerStatistic, 'allTimeIncome', 0));

  const percentageOfPeriodIncome = (totalIncomeThisPeriod / totalIncomeAllTime) * 100;
  const percentageOfRemainingIncome = 100 - percentageOfPeriodIncome;

  const handleDateChange = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setEndDate(formattedDate);
  };
  return (
    <Box sx={{
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}>
      <Grid container spacing={3} alignItems={'center'}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>Statistic</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <>
                <DesktopDatePicker
                  label="From"
                  value={moment(startDate)}
                  sx={{
                    mr: 2,

                  }}
                  onChange={(date) => {
                    handleDateChange(date);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </>
              <DesktopDatePicker
                label="To"
                value={moment(endDate)}
                onChange={(date) => {
                  handleEndDateChange(date);
                }}
                maxDate={moment()}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AppWidget
            title="All Time Success Booking (Success Rate)"
            total={_.get(
              readerStatistic,
              'allTimeTotalFinishBooking',
              0,
            )}
            color='warning'

            icon="solar:user-rounded-bold"
            chart={{
              series: _.get(readerStatistic, 'successBookingRate', 0),
            }}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <AppWidget
            title="Services Active"
            total={_.get(readerStatistic, 'totalActiveServices', 0)}
            icon="material-symbols-light:home-repair-service"
            color="info"

          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <AppWidget
            title="Profit this period (Income)"
            total={fCurrency(_.get(readerStatistic, 'totalIncomeInThisPeriod', 0))}
            icon="game-icons:profit"
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          <Card sx={{
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            borderRadius: 4,
          }}>
            <CardHeader title="Booking" />
            <CardContent>
              <ChartArea
                series={[
                  { name: 'Completed Booking', data: _.get(readerStatistic, 'completedBookingData', []) },
                  { name: 'Canceled Booking', data: _.get(readerStatistic, 'canceledBookingData', []) },
                ]}
                time={_.get(readerStatistic, 'milestones', [])}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            borderRadius: 4,
            gap: 4,
          }}>

            <CardHeader title="Income" />

            <ChartPie series={[percentageOfPeriodIncome, percentageOfRemainingIncome]}
              labels={['This period Income (%)', 'Remaining income (%)']}
            />
          </Card>
        </Grid>
      </Grid>
      {loading && <Box><BackdropLoading /></Box>}
    </Box>
  );
};

export default MainReader;
