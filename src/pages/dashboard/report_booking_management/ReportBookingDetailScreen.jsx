import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { paths } from '../../../components/router/paths';
import { selectUser } from '../../../redux/slices/authSlice';
import { getBookingReportById } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReportBookingDetailView from './detail/ReportBookingDetailView';

// ----------------------------------------------------------------------

export default function ReportBookingDetailScreen () {
  const params = useParams();

  const { id } = params;

  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const setDataFetching = (data) => {
    if (data?.getRequestById === null) {
      navigate(paths.dashboard.reportBookingManagement);
      showNotification('error', 'Report not found');
    }
  };

  const handleError = (e) => {
    navigate(paths.dashboard.reportBookingManagement);
    handleFriendlyError(e, 'Can not get report');
  };

  const { loading, data, error } = useQuery(getBookingReportById, {
    variables: { id },
    onCompleted: setDataFetching,
    onError: handleError,
    fetchPolicy: 'no-cache',
  });

  if (loading) return <BackdropLoading />;

  if (error) {
    return null;
  }

  return (
        <ReportBookingDetailView post={data?.getReportById} user={user} />
  );
}
