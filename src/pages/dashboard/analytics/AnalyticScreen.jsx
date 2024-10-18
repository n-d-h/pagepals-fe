import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';

import AnalyticsWebsiteBookings from './component/AnalyticsWebsiteBookings';
import AnalyticsWidgetSummary from './component/AnalyticsWidgetSummary';

import { sub } from 'date-fns';
import BankingWidgetSummary from './component/BankingWidgetSummary';

import { useLazyQuery } from '@apollo/client';
import { Button, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { showNotification } from '../../../components/common_services/CommonServices';
import { getAnalyticAdmin } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import AppTopRelated from './component/AppTopRelated';
import BankingWidgetSummaryToken from './component/BankingWidgetSummaryToken';
import EcommerceBestSalesman from './component/EcommerceBestSalesman';
import FileWidget from './component/FileWidget';
import freeStorage from '../../../assets/icons/files/zoomus-icon.svg';

const _postTitles = [
  '10 Essential Tips for Healthy Living',
  'The Ultimate Guide to Productivity Hacks',
  'Exploring the Hidden Gems of [Destination]',
  'How to Master the Art of Public Speaking',
  'The Future of Artificial Intelligence: Trends and Insights',
];

const _sentences = [
  'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
  'She eagerly opened the gift, her eyes sparkling with excitement.',
  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
  'The aroma of freshly brewed coffee filled the air, awakening my senses.',
  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
];

const GB = 1000000000;
const GB2 = 1000000000 * 0.5;

const _mock = {
  id: (index) => [index],
  time: (index) => sub(new Date(), { days: index, hours: index }),
  postTitle: (index) => _postTitles[index],
  sentence: (index) => _sentences[index],
  image: {
    cover: (index) => '',
  },
};

const _appRelated = ['Chrome', 'Drive', 'Dropbox', 'Evernote', 'Github'].map(
  (name, index) => {
    const system = [2, 4].includes(index) ? 'Windows' : 'Mac';

    const price = [2, 4].includes(index) ? 12 : 0;

    const shortcut = '';

    return {
      id: index,
      name,
      price,
      system,
      shortcut,
      ratingNumber: 4,
      totalReviews: 5,
    };
  },
);

const AnalyticScreen = () => {
  const [incomeByTokenSeriesData, setIncomeByTokenSeriesData] = useState([]);
  const [circulatingTokenData, setCirculatingTokenData] = useState([]);
  const [incomeByRevenueShareSeriesData, setIncomeByRevenueShareSeriesData] = useState([]);
  const [months, setMonths] = useState([]); // data?.getAnalyticAdmin.bookingStatics.months
  const [bookingSeriesData, setBookingSeriesData] = useState([]); // data?.getAnalyticAdmin.bookingStatics.seriesData
  const [startDate, setStartDate] = useState(moment()); // new Date()
  const [endDate, setEndDate] = useState(moment());
  const [freeSpacePercent, setFreeSpacePercent] = useState(0);
  const [cloudStoragePercent, setCloudStoragePercent] = useState(0);

  // data?.getAnalyticAdmin.bookingStatics
  const setDataFetching = (data) => {
    const list = data.getAnalyticAdmin.incomeByToken.seriesData.map((item) => {
      return {
        x: item.date,
        y: item.income,
      };
    });
    setIncomeByTokenSeriesData(list);
    const list2 = data.getAnalyticAdmin.incomeByRevenueShare.seriesData.map((item) => {
      return {
        x: item.date,
        y: item.income,
      };
    });
    setIncomeByRevenueShareSeriesData(list2);

    const list3 = data.getAnalyticAdmin.circulatingToken.seriesData.map((item) => {
      return {
        x: item.date,
        y: item.token,
      };
    });
    setCirculatingTokenData(list3);

    // set months remove last element
    const monthsData = [];
    for (let i = 0; i < data.getAnalyticAdmin.bookingStatics.months.length - 1; i++) {
      months.push(data.getAnalyticAdmin.bookingStatics.months[i]);
    }
    setMonths(monthsData);

    // set bookingSeriesData remove last element
    const bookingSeriesDataRaw = [];
    for (let i = 0; i < data.getAnalyticAdmin.bookingStatics.seriesData.length - 1; i++) {
      bookingSeriesDataRaw.push(data.getAnalyticAdmin.bookingStatics.seriesData[i]);
    }
    setBookingSeriesData(bookingSeriesDataRaw);

    // Convert free storage
    const totalFreeStorageRaw = parseFloat(data.getAnalyticAdmin.freeStorage.totalStorage) * GB;
    const usedFreeStorageRaw = parseInt(data.getAnalyticAdmin.freeStorage.usedStorage) / 1000 * GB; // Convert MB to GB

    // Convert cloud storage
    const totalCloudStorageRaw = parseFloat(data.getAnalyticAdmin.cloudStorage.totalStorage) * GB;
    const usedCloudStorageRaw = parseInt(data.getAnalyticAdmin.cloudStorage.usedStorage) * GB;

    const freeSpacePercentRaw = (usedFreeStorageRaw / totalFreeStorageRaw) * 100;
    const cloudStoragePercentRaw = (usedCloudStorageRaw / totalCloudStorageRaw) * 100;
    setFreeSpacePercent(freeSpacePercentRaw);
    setCloudStoragePercent(cloudStoragePercentRaw);
  };

  const [getData, { loading, data }] = useLazyQuery(getAnalyticAdmin, {
    onCompleted: setDataFetching,
  });

  const handleOk = () => {
    if (startDate.isSameOrAfter(endDate) || startDate.diff(endDate, 'months') > 2) {
      showNotification('warning', 'Start date must be before end date and the range must be more than 2 months');
      return;
    }
    getData({
      variables: {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      },
    });
  };

  if (loading) return <BackdropLoading />;

  return (
	<Container maxWidth='xl'>
		<Typography
			variant="h4"
			sx={{
			  mb: { xs: 3, md: 5 },
			}}
		>
			Hi, Welcome back 👋
		</Typography>

		<Grid container spacing={3}>

			<Grid xs={12} sm={6} md={3}>
				<AnalyticsWidgetSummary
					title="Total Customers"
					total={_.get(data, 'getAnalyticAdmin.totalCustomers')}
					icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
				/>
			</Grid>

			<Grid xs={12} sm={6} md={3}>
				<AnalyticsWidgetSummary
					title="Total Readers"
					total={_.get(data, 'getAnalyticAdmin.totalReaders')}
					color="info"
					icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
				/>
			</Grid>

			<Grid xs={12} sm={6} md={3}>
				<AnalyticsWidgetSummary
					title="Total Services"
					total={_.get(data, 'getAnalyticAdmin.totalService')}
					color="warning"
					icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
				/>
			</Grid>

			<Grid xs={12} sm={6} md={3}>
				<AnalyticsWidgetSummary
					title="Service Bookings"
					total={_.get(data, 'getAnalyticAdmin.totalBookings')}
					color="error"
					icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
				/>
			</Grid>

			<Grid xs={12} sm={12} md={12}>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DesktopDatePicker
						label="From"

						value={startDate}
						onChange={(date) => {
						  setStartDate(date);
						}}
						views={['year', 'month']}
						format="YYYY-MM-DD"
						renderInput={(params) => <TextField {...params} value={params.inputProps.value} />}
					/>
					<> </>
					<DesktopDatePicker
						label="To"
						value={endDate}
						onChange={(date) => {
						  setEndDate(date);
						}}
						views={['year', 'month']}
						format="YYYY-MM-DD"
						maxDate={moment()}
						renderInput={(params) => <TextField {...params} value={params.inputProps.value} />}
					/>
				</LocalizationProvider>
				<Button
					style={
						{
						  height: '50px',
						  width: '30px',
						  color: 'white',
						  marginLeft: '10px',
						  backgroundColor: 'rgb(0, 167, 111)',
						}
					}
					onClick={handleOk}
				>
					OK
				</Button>
			</Grid>

			<Grid xs={12} md={6} lg={8}>
				<Stack spacing={3}>
					<AnalyticsWebsiteBookings
						title="Booking Statistics"
						subheader={'(' + _.get(data, 'getAnalyticAdmin.bookingStatics.percentageOfDone') + '%) booking done'}
						chart={{
						  labels: _.get(data, 'getAnalyticAdmin.bookingStatics.months'),
						  series: [
						    {
						      name: _.get(data, 'getAnalyticAdmin.bookingStatics.seriesData[0].state'),
						      type: 'column',
						      fill: 'solid',
						      data: _.get(data, 'getAnalyticAdmin.bookingStatics.seriesData[0].data'),
						    },
						    {
						      name: _.get(data, 'getAnalyticAdmin.bookingStatics.seriesData[1].state'),
						      type: 'area',
						      fill: 'gradient',
						      data: _.get(data, 'getAnalyticAdmin.bookingStatics.seriesData[1].data'),
						    },
						    {
						      name: _.get(data, 'getAnalyticAdmin.bookingStatics.seriesData[2].state'),
						      type: 'line',
						      fill: 'solid',
						      data: _.get(data, 'getAnalyticAdmin.bookingStatics.seriesData[2].data'),
						    },
						  ],
						}}
					/>
					<EcommerceBestSalesman
						title="Best Readers"
						tableData={_.get(data, 'getAnalyticAdmin.topReaders')}
						tableLabels={[
						  { id: 'rank', label: 'Rank', align: 'right' },
						  { id: 'name', label: 'Reader' },
						  { id: 'email', label: 'Email' },
						  { id: 'totalAmount', label: 'Total Income', align: 'right' },
						  { id: 'rating', label: 'Rating', align: 'center' },
						]}
					/>
					<Grid container spacing={3}>
						<Grid xs={12} sm={6} md={6}>
							<FileWidget
								title="Free Space"
								used={_.get(data, 'getAnalyticAdmin.freeStorage.usedStorage')}
								total={_.get(data, 'getAnalyticAdmin.freeStorage.totalStorage')}
								percent={
									parseFloat(_.get(data, 'getAnalyticAdmin.freeStorage.usedStorage')) / parseFloat(_.get(data, 'getAnalyticAdmin.freeStorage.totalStorage')) * 100
								}
								icon={freeStorage}
							/>
						</Grid>
						<Grid xs={12} sm={6} md={6}>
							<FileWidget
								title="Cloud Storage"
								used={_.get(data, 'getAnalyticAdmin.cloudStorage.usedStorage')}
								total={_.get(data, 'getAnalyticAdmin.cloudStorage.totalStorage')}
								percent={
									parseFloat(_.get(data, 'getAnalyticAdmin.cloudStorage.usedStorage')) / parseFloat(_.get(data, 'getAnalyticAdmin.cloudStorage.totalStorage')) * 100
								}
								icon={freeStorage}
							/>
						</Grid>
					</Grid>
				</Stack>
			</Grid>

			<Grid xs={12} md={6} lg={4}>
				<Stack spacing={3}>
					<BankingWidgetSummary
						title="Income through Token Sales"
						icon="eva:diagonal-arrow-left-down-fill"
						percent={_.get(data, 'getAnalyticAdmin.incomeByToken.percentageIncrease')}
						total={_.get(data, 'getAnalyticAdmin.incomeByToken.totalIncome')}
						chart={{
						  series: incomeByTokenSeriesData || [],
						}}
					/>

					<BankingWidgetSummary
						title="Income through Revenue Sharing"
						color="secondary"
						icon="eva:diagonal-arrow-right-up-fill"
						percent={_.get(data, 'getAnalyticAdmin.incomeByRevenueShare.percentageIncrease')}
						total={_.get(data, 'getAnalyticAdmin.incomeByRevenueShare.totalIncome')}
						chart={{
						  series: incomeByRevenueShareSeriesData || [],
						}}
					/>

					<BankingWidgetSummaryToken
						title="Circulating tokens"
						color="warning"
						icon="eva:diagonal-arrow-right-up-fill"
						percent={_.get(data, 'getAnalyticAdmin.circulatingToken.percentageIncrease')}
						total={_.get(data, 'getAnalyticAdmin.circulatingToken.totalCirculating')}
						chart={{
						  series: circulatingTokenData || [],
						}}
					/>
					<AppTopRelated title="Top Services" list={_.get(data, 'getAnalyticAdmin.topServices')} />

				</Stack>
			</Grid>

		</Grid>
	</Container>
  );
};

export default AnalyticScreen;
