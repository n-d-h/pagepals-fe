import { useMutation, useQuery } from '@apollo/client';
import { Container, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { paths } from '../../../components/router/paths';
import { selectUser } from '../../../redux/slices/authSlice';
import { rejectCustomerReportMutation } from '../../../services/apolo/mutations';
import { getBookingReportById } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReportDetailsToolbar from '../reader_request_management/detail/component/ReportDetailsToolbar';
import ReportCustomerInformation from '../report_booking_management/detail/component/ReportCustomerInformation';
import BanReaderForm from './BanReaderForm';
import ReportReaderDetailView from './ReportReaderDetailView';

// ----------------------------------------------------------------------

export default function ReportReaderDetailScreen () {
  const params = useParams();

  const { id } = params;

  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const setDataFetching = (data) => {
    if (data?.getRequestById === null) {
      navigate(paths.dashboard.reportReaderManagement);
      showNotification('error', 'Report not found');
    }
  };

  const handleError = (e) => {
    navigate(paths.dashboard.reportReaderManagement);
    handleFriendlyError(e, 'Can not get report');
  };

  const { loading, data, error } = useQuery(getBookingReportById, {
    variables: { id },
    onCompleted: setDataFetching,
    onError: handleError,
    fetchPolicy: 'no-cache',
  });

  const [handleReject, { loading: rejectLoading }] = useMutation(rejectCustomerReportMutation, {
    variables: {
      id,
    },
    onCompleted: () => {
      showNotification('success', 'Report rejected successfully');
      navigate(paths.dashboard.reportReaderManagement);
    },

    onError: (e) => {
      handleFriendlyError(e, 'Report rejected failed');
    },
  });

  const [openDialog, closeDialog] = useDialog();
  const handleBanReader = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
                <ContentDialog
                    title="Ban Reader"
                    form={BanReaderForm}
                    assetForm={{
                      readerId: data?.getReportById?.reportedId,
                      closeDialog,
                    }}
                    callbackFnc={callBackDialog}
                    showActions={false}
                />
      ),
    });
  };

  if (loading) return <BackdropLoading />;

  if (error) {
    return null;
  }

  return (

    <Container maxWidth='lg'>

      <Typography variant="h4" gutterBottom>
        Report Reader Detail
      </Typography>

      <ReportDetailsToolbar
        readerReport
        rejectLabel={'Ignore'}
        onReject={handleReject}
        rejectLoading={rejectLoading}
        handleBanReader={handleBanReader}
      />

      <Grid container
        gap={2}
        height={'fit-content'}>
        <Grid xs={12} lg={7} item sx={{
          bgcolor: 'white',
          borderRadius: 2,
          mt: 2,
        }}>

          <ReportReaderDetailView report={data?.getReportById} user={user} />
        </Grid>

        <Grid xs={12} lg={4} item sx={{
          bgcolor: 'white',
          borderRadius: 2,
          mt: 2,
          height: 'fit-content',
        }}>
          <ReportCustomerInformation report={data?.getReportById} />
        </Grid>
      </Grid>
    </Container>

  );
}
