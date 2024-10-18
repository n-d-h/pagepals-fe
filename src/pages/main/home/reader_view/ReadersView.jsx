import { useQuery } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { useRouter } from '../../../../components/hooks/use-router';
import { logoutFirebaseThunk } from '../../../../redux/slices/authSlice';
import { setActive } from '../../../../redux/slices/loadingSlice';
import { handleApolloErrors } from '../../../../services/apolo/apolloErrorsHandling';
import { getListReaderHomePage } from '../../../../services/apolo/queries';
import ReaderCard from './ReaderCard';

const ReadersView = ({ isGuest = false }) => {
  const { loading, error, data } = useQuery(getListReaderHomePage, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Failed to load data');
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutFirebaseThunk());
      router.replace('/');
    } catch (error) {
    }
  };

  if (error) {
    const errorState = handleApolloErrors(error);
    if (errorState === 'logout') {
      handleLogout();
      navigate('/');
    }
  }

  const list = _.get(data, 'getListPopularReaders', []);

  useEffect(() => {
    if (loading) {
      dispatch(setActive(true));
    }
    if (!loading) {
      dispatch(setActive(false));
    }
	  }
  , [loading]);

  return (
		<Box
			sx={{
			  display: 'flex',
			  flexDirection: 'column',
			  justifyContent: 'center',
			  alignItems: 'flex-start',
			  flexWrap: 'wrap',
			  gap: 2,
			  width: '70%',
			}}
		>
			<Typography variant="h4">
				Start sharing Books with one of these top readers.
			</Typography>

			<Typography variant="h6" fontWeight={400}>
				There isn’t a single way to earn knowledge from book. Let’s have a
				meeting and earn knowledge in a openly, different point of view
			</Typography>

			<Box sx={{ width: '100%', mt: 2 }}>
				<Grid container width={'100%'} spacing={4} >
					{list.length > 0 && list.map((reader) => (
						<Grid key={reader.id} item xs={12} md={6} lg={4} xl={3}>
							<ReaderCard reader={reader} isGuest={isGuest}/>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
  );
};

export default ReadersView;
