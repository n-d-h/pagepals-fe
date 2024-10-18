import { useQuery } from '@apollo/client';
import { Box, Button, Grid, Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { useResponsive } from '../../../components/hooks/use-responsive';
import { selectUser } from '../../../redux/slices/authSlice';
import { getReaderProfileDetail } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ListBookForReader from './ListBookForReader';
import ListSeminarForReader from './ListSeminarForReader';
import ReaderProfileCard from './ReaderProfileCard';
import ReaderReviews from './ReaderReviews';
import ReportForm from './ReportForm';

const ReaderProfile = () => {
  const { id: readerId } = useParams();
  const [readerInfo, setReaderInfo] = useState({});

  const location = window.location.href;

  const isGuest = location.includes('guest');

  const userProfile = useSelector(selectUser);

  const navigate = useNavigate();

  const mdUp = useResponsive('up', 'md');

  const { loading, data, error } = useQuery(getReaderProfileDetail, {
    variables: {
      id: readerId,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting reader profile');
    },
    fetchPolicy: 'no-cache',
  });

  const { getReaderProfile } = data || {};

  const readerProfile = () => {
    if (!getReaderProfile) return {};

    const { profile, workingTimeList } = getReaderProfile;

    return {
      profile: {
        ...profile,
        nickname: _.get(profile, 'nickname', 'Anonymous'),
      },
      workingTime: _.get(workingTimeList, 'workingDates', {}),
    };
  };

  useEffect(() => {
    const readerProfileInfo = readerProfile();

    setReaderInfo(readerProfileInfo);
  }, [data]);

  const [openReportDialog, closeReportDialog] = useDialog();
  const handleReportReader = () => {
    const callBackDialog = () => {
      closeReportDialog();
	  };

	  openReportDialog({
      fullWidth: true,
      children: (
		  <ContentDialog
			title="Report"
			form={ReportForm}
			assetForm={{
			  customerId: _.get(userProfile, 'customer.id'),
			  reportId: readerId,
			  type: 'READER',
			  closeDialog: callBackDialog,
			}}
			callbackFnc={callBackDialog}
			showActions={false}
		  />
      ),
	  });
  };

  if (loading) {
    return <BackdropLoading />;
  }

  if (error) {
    navigate(-1);
  }

  return (
		<>
			<Helmet>
				<title>PagePals - {_.get(readerInfo, 'nickname', 'Anonymous')}</title>
			</Helmet>
			<Box sx={{ height: '100%', mx: mdUp ? 20 : 2, my: 10 }}>
				<Box
					sx={{
					  gap: 2,
					  display: 'flex',
					  alignItems: 'center',
					  flexWrap: 'wrap',
					}}
				>
					<Grid container columnSpacing={4} width={'100%'}>
						<Grid item xs={12} lg={8}>
							<Box
								sx={{
								  height: '100%',
								  borderRadius: 3,
								  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
								}}
							>
								<ReaderProfileCard reader={readerInfo} />
							</Box>
						</Grid>
						<Grid item xs={12} lg={4}>
							<Box
								sx={{
								  height: '100%',
								  borderRadius: 3,
								  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
								  width: '100%',
								}}
							>
								<iframe
									src={
										_.get(
										  readerInfo,
										  'profile.introductionVideoUrl',
										)}
									style={{ borderRadius: '18px' }}
									width="100%"
									height="100%"
									title="video"
								/>

							</Box>
						</Grid>
					</Grid>
				</Box>

				<Box
					sx={{
					  width: '100%',
					  mt: 5,
					  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
					  borderRadius: 3,
					  p: 4,
					}}
				>
					<Typography variant="h4">Top Services</Typography>

					<ListBookForReader readerId={readerId} />
				</Box>

				<Box
					sx={{
					  width: '100%',
					  mt: 5,
					  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
					  borderRadius: 3,
					  p: 4,
					}}
				>
					<Typography variant="h4">Ongoing Seminar</Typography>

					<ListSeminarForReader readerId={readerId} />
				</Box>

				<Box
					sx={{
					  width: '100%',
					  mt: 5,
					  bgcolor: 'grey.100',
					  borderRadius: 3,
					  p: 4,
					}}
				>
					<Typography variant="h4" gutterBottom>
						Reviews
					</Typography>
					<Grid container columnSpacing={4} width={'100%'} mt={4}>
						<Grid item xs={12} lg={4}>
							<Box sx={{
							  width: '100%',
							  bgcolor: 'white',
							  p: 2,
							  borderRadius: 3,
							  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
							}}>
								<Typography variant='h5'>Customer reviews</Typography>
								<Box display="flex" alignItems="center" sx={{
								  gap: 1,
								  display: 'flex',
								  alignItems: 'center',
								  mt: 1,
								  mb: 2,
								}}>
									<Rating name="read-only" value={
										_.get(readerInfo, 'profile.rating', 0)
									} readOnly precision={0.1} />
									<Typography variant='h6'>{`${
										_.get(readerInfo, 'profile.rating', 0)
									} out of 5`}</Typography>
								</Box>

								<Button variant="outlined" color='error' onClick={() => {
								  if (isGuest) {
								    showNotification('warning', 'Please login to report');
								    return;
								  }
								  handleReportReader();
								}}>Report this reader</Button>
							</Box>
						</Grid>
						<Grid item xs={12} lg={8}>
							<ReaderReviews readerId={readerId} />
						</Grid>
					</Grid>
				</Box>

			</Box>
		</>
  );
};

export default ReaderProfile;
