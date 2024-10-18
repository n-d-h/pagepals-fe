import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import React from 'react';
import AppFeatured from '../../../../components/carousel/test-carousel';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { getBannerAdsQuery } from '../../../../services/apolo/queries';
import { Link, useLocation } from 'react-router-dom';
import Iconify from '../../../../components/iconify';
import { paths } from '../../../../components/router/paths';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';

const SeminarView = () => {
  const { data, loading } = useQuery(getBannerAdsQuery, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting popular seminars');
    },
  });

  const location = useLocation();
  const isGuest = location.pathname.includes('guest');

  if (loading) {
    return <BackdropLoading />;
  }

  if (_.get(data, 'getAllBannerAds', []).length === 0) { return null; }

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

			<Typography variant="h4" className=''>
				Current seminars to get you started
			</Typography>

			<Typography variant="h6" fontWeight={400}>
				Want to get started? Here are some seminars to get you started.
			</Typography>

			<Box sx={{ width: '100%', mt: 2 }}>
				<AppFeatured
					list={_.get(data, 'getAllBannerAds', [])} />
			</Box>

			<Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%', gap: 1 }}>

				<Link
					to={isGuest ? paths.guest.event : paths.main.event}
					style={{ textDecoration: 'none' }}
				>
					<Typography variant="body1" fontWeight={600} color="primary" textAlign={'end'}>
						<u>See more seminars</u>
					</Typography>
				</Link>
				<Iconify icon="akar-icons:arrow-right" color="primary.main" width={20} height={20} />
			</Box>

		</Box>
  );
};

export default SeminarView;
