import { useLazyQuery, useQuery } from '@apollo/client';
import { Box, Button, Card, Grid, Stack, Tab, Tabs, Typography, tabsClasses } from '@mui/material';
import { Calendar } from 'react-date-range';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router';
import openDeleteDialog from '../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import Iconify from '../../../components/iconify';
import { paths } from '../../../components/router/paths';
import { selectUser } from '../../../redux/slices/authSlice';
import { getBecomeAReaderRequestDetailQuery, getWorkingTimeByStaff } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import AnswerDetailsContent from '../../dashboard/reader_request_management/detail/component/AnswerDetailsContent';
import InformationDetailsContent from '../../dashboard/reader_request_management/detail/component/InformationDetailsContent';
import InterviewDetailsContent from '../../dashboard/reader_request_management/detail/component/InterviewDetailsContent';
import CustomImage from '../../../components/image/CustomImage';
import image from '../../../assets/landing/no-request.png';
import HistoryRequest from './component/HistoryRequest';
import { TimeSlotStaff } from './component/TimeSlotStaff';
import _ from 'lodash';


const timeSlots = [];
const startTime = new Date();
startTime.setHours(9, 0, 0); // Set start time to 9:00 AM

const endTime = new Date();
endTime.setHours(17, 0, 0); // Set end time to 5:00 PM

const interval = 30; // Time interval in minutes

while (startTime <= endTime) {
  const formattedStartTime = startTime.toTimeString().slice(0, 8); // Format start time as "hh:mm:ss"
  timeSlots.push({ startTime: formattedStartTime });

  startTime.setMinutes(startTime.getMinutes() + interval); // Increment start time by the interval
}

const BecomeAReaderStatus = () => {
  const userProfile = useSelector(selectUser);
  const navigate = useNavigate();

  const readerId = _.get(userProfile, 'reader.id');

  if(!readerId) {
    navigate(paths.main.registerReader);
  }

  const [currentTab, setCurrentTab] = useState('information');
  const [currentChosenDate, setCurrentChosenDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000));
  const [chosenTimeFrame, setChosenTimeFrame] = useState(timeSlots);
  const [staffWorkingDate, setStaffWorkingDate] = useState([]);

  const [getStaffTimeSlot, { dataTimeSlot, loading: timeSlotLoading }] = useLazyQuery(getWorkingTimeByStaff, {
    onCompleted: (data) => {
      setStaffWorkingDate(_.get(data, 'getWorkingTimeListByStaffId.workingDates', []));
    },
  });

  const onCompletedLoadingRequest = (data) => {
    const staffId = _.get(data, 'getRequestByReaderId.staffId');
    getStaffTimeSlot({
      variables: {
        staffId,
      },
    });
  }

  const { data, loading, refetch } = useQuery(getBecomeAReaderRequestDetailQuery, {
    variables: {
      id: _.get(userProfile, 'reader.id'),
    },
    onCompleted: onCompletedLoadingRequest,
    onError: (e) => {
      navigate(paths.main.root);
      handleFriendlyError(e, 'Cannot fetch your request detail');
    },
  });

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleChangeDate = (date) => {
    setCurrentChosenDate(date);
  };

  const [openJoinDialog, closeJoinDialog] = useDialog();
  const handleJoinClick = (data) => {
    openDeleteDialog({
      title: 'Join Room',
      content: 'Are you sure you want to join this conference?',
      dialog: [openJoinDialog, closeJoinDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        const path = generatePath('/meeting-zoom/:MeetingID/:role/detail', {
          MeetingID: data,
          role: 0,
        });

        navigate(path);
      }
    });
  };

  const renderEmptyContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', mr: 2 }}>
      <Typography variant="h4">No Pending Request</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>
        <CustomImage src={image} sx={{ width: 320, height: 320 }} />
        <Button
          color="success"
          variant="contained"
          sx={{ textTransform: 'capitalize' }}
          onClick={() => navigate(paths.main.registerReader)}
        >
          Send a Request Now
        </Button>
      </Box>
    </Stack>
  );

  const renderScheduling = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', mr: 2 }}>
      <Typography variant="h4">Choose a time to meet our Staff</Typography>

      <Grid container spacing={4}>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>
            <Calendar

              color={'#00A76F'}
              onChange={(item) => handleChangeDate(item)}
              date={currentChosenDate}
              minDate={new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)}
              maxDate={new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)}
            // disabledDay={(day) => {
            //   return !workDays.some((date) => {
            //     return moment(date).isSame(day, 'day');
            //   });
            // }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>

            <TimeSlotStaff
              chosenTimeFrame={chosenTimeFrame}
              date={currentChosenDate}
              staffWorkingDate={staffWorkingDate}
              staffName={_.get(data, 'getRequestByReaderId.staffName')}
              requestId={_.get(data, 'getRequestByReaderId.id')}
              refetch={refetch}
            />
          </Box>
        </Grid>

      </Grid>

    </Stack>
  );

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        px: 20,
        py: 5,
      }}
    >
      <Grid
        container
        rowSpacing={4}
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Your Request Detail
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            centered
            sx={{
              width: '100%',
              height: '100%',
              [`& .${tabsClasses.flexContainer}`]: {
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            <Tab
              value={'information'}
              icon={<Iconify icon={'heroicons-outline:information-circle'} />}
              label={'Information'}
              sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}></Tab>
            <Tab
              value={'answers'}
              icon={<Iconify icon={'ph:note'} />}
              label={'Answers'}
              disabled={_.get(data, 'getRequestByReaderId.id') === null}
              sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}></Tab>
            <Tab
              value={'interview'}
              icon={<Iconify icon={'mage:video-fill'} />}
              label={'Interview'}
              disabled={_.get(data, 'getRequestByReaderId.state') !== 'INTERVIEW_SCHEDULING' && _.get(data, 'getRequestByReaderId.state') !== 'INTERVIEW_PENDING'}
              sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}></Tab>
            <Tab
              value={'history'}
              icon={<Iconify icon={'ic:baseline-history'} />}
              label={'History'}
              sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}></Tab>

          </Tabs>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: '100%', bgcolor: 'background.grey' }}>
            {/* {currentTab === 'information' && data?.getRequestByReaderId?.id !== null ? (
              <InformationDetailsContent
                post={_.get(data, 'getRequestByReaderId', {})}
                isCustomer
              />
            ) : renderEmptyContent} */}

            {currentTab === 'information' && data?.getRequestByReaderId?.id !== null && (
              <InformationDetailsContent
                post={_.get(data, 'getRequestByReaderId', {})}
                isCustomer
              />
            )}
            
            {currentTab === 'information' && data?.getRequestByReaderId?.id === null && (
              renderEmptyContent
            )}

            {currentTab === 'answers' && (
              <Box>
                <AnswerDetailsContent post={_.get(data, 'getRequestByReaderId', {})} isCustomer />
              </Box>
            )}
            
            {currentTab === 'interview' && data?.getRequestByReaderId?.state === 'INTERVIEW_PENDING' && (
              <Box>
                <InterviewDetailsContent post={_.get(data, 'getRequestByReaderId', {})} handleJoinClick={handleJoinClick} isCustomer />
              </Box>
            )}

            {currentTab === 'interview' && data?.getRequestByReaderId?.state === 'INTERVIEW_SCHEDULING' && (
              renderScheduling
            )}


            {currentTab === 'history' && (
              <Box>
                <HistoryRequest post={_.get(data, 'getRequestByReaderId', {})} />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BecomeAReaderStatus;
