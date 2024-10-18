import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectUser } from '../../../redux/slices/authSlice';
import { getReaderRequestById } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReaderRequestDetailView from './detail/ReaderRequestDetailView';

// ----------------------------------------------------------------------

export default function ReaderRequestDetailScreen () {
  const params = useParams();

  const { id } = params;

  const user = useSelector(selectUser);

  const { loading, data, refetch } = useQuery(getReaderRequestById, {
    variables: { requestId: id },
  });

  if (loading) return <BackdropLoading />;

  return (
        <ReaderRequestDetailView post={data?.getRequestById} user={user} refetch={refetch} />
  );
}
