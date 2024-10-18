import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Iconify from '../../../../components/iconify';
import ReportDetailsToolbar from '../../reader_request_management/detail/component/ReportDetailsToolbar';
import BookingInfomation from './component/BookingInfomation';
import { Grid, Typography } from '@mui/material';
import ReportReaderInformation from './component/ReportReaderInformation';
import ReportCustomerInformation from './component/ReportCustomerInformation';
import { useMutation } from '@apollo/client';
import { refundCustomerMutation, rejectCustomerReportMutation } from '../../../../services/apolo/mutations';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import { useNavigate } from 'react-router';
import { paths } from '../../../../components/router/paths';

// ----------------------------------------------------------------------

const BOOKING_REPORT_DETAILS_TABS = [
  { value: 'bookingInfo', label: 'Booking Information', icon: 'mdi:information' },
  { value: 'readerInformation', label: 'Reader Information', icon: 'uil:book-reader' },
];

export default function ReportBookingDetailView ({ post: report, user }) {
  const [currentTab, setCurrentTab] = useState('bookingInfo');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const navigate = useNavigate();

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {BOOKING_REPORT_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="start"
          value={tab.value}
          label={tab.label}
          icon={
            <Iconify icon={tab.icon} width={20} height={20} />
          }
        />
      ))}
    </Tabs>
  );

  const [handleRefund, { loading: refundLoading }] = useMutation(refundCustomerMutation, {
    variables: {
      id: report.id,
    },

    onCompleted: () => {
      showNotification('success', 'Refund successfully');
      navigate(paths.dashboard.reportBookingManagement);
    },

    onError: (e) => {
      handleFriendlyError(e, 'Refund failed');
    },
  });

  const [handleReject, { loading: rejectLoading }] = useMutation(rejectCustomerReportMutation, {
    variables: {
      id: report.id,
    },
    onCompleted: () => {
      showNotification('success', 'Report rejected successfully');
      navigate(paths.dashboard.reportBookingManagement);
    },

    onError: (e) => {
      handleFriendlyError(e, 'Report rejected failed');
    },
  });

  return (
    <Container maxWidth='lg' >

    <Typography variant="h4" gutterBottom>
      Report Booking Detail
    </Typography>

      <ReportDetailsToolbar
      bookingReport
        handleRefund={handleRefund}
        onReject={handleReject}
        acceptLabel={'Refund'}
        rejectLabel={'Ignore'}
        rejectLoading={rejectLoading}
        refundLoading={refundLoading}
      />

      {renderTabs}

      <Grid container
        gap={2}
        height={'fit-content'}>
        <Grid xs={12} lg={7} item sx={{
          bgcolor: 'white',
          borderRadius: 2,
          mt: 2,
        }}>
          {currentTab === 'bookingInfo' && <BookingInfomation report={report} />}

          {currentTab === 'readerInformation' && <ReportReaderInformation report={report} />}
        </Grid>

        <Grid xs={12} lg={4} item sx={{
          bgcolor: 'white',
          borderRadius: 2,
          mt: 2,
          height: 'fit-content',
        }}>
          <ReportCustomerInformation report={report} />
        </Grid>
      </Grid>
    </Container>
  );
}

ReportBookingDetailView.propTypes = {
  id: PropTypes.string,
};
