import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
// import { getUpdateReaderDetail } from '../../../../../services/apolo/queries';
import BackdropLoading from '../../../../backdrop_loading/BackdropLoading';
import UpdateInformation from './UpdateInformation';

// ----------------------------------------------------------------------

export default function UpdateRequestDetail () {
  const params = useParams();

  const { id } = params;

  // const { loading, data } = useQuery(getUpdateReaderDetail, {
  //   variables: { readerId: id },
  //   fetchPolicy: 'no-cache',
  // });

  // if (loading) return <BackdropLoading />;

  return (
        // <UpdateInformation post={data?.getUpdateRequestByReaderId} />
        <></>
  );
}
