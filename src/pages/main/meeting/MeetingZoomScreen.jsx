import { useQuery } from '@apollo/client';
import { Box, Button } from '@mui/material';
import { ZoomMtg } from '@zoom/meetingsdk';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectUser } from '../../../redux/slices/authSlice';
import { getMeetingByMeetingCode } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import './MeetingZoom.css';
import { showNotification } from '../../../components/common_services/CommonServices';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import openDeleteDialog from '../../../components/animate/dialog/DeleteDialog';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
function MeetingZoomScreen () {
  // reader : role = 1, customer : role = 0

  const userProfile = useSelector(selectUser);

  const mainPageRole = ['CUSTOMER', 'READER', 'READER_PENDING'];

  const { id, role } = useParams();

  if (!id) {
    return <NothingTooSeePage />;
  }

  const { data, loading, error } = useQuery(getMeetingByMeetingCode, {
    variables: {
      id,
    },
  });

  const [signature, setSignature] = React.useState('');

  const sdkKey = import.meta.env.VITE_ZOOM_SDK_KEY;

  const userEmail = '';
  const registrantToken = '';
  const zakToken = '';
  const leaveUrl = mainPageRole.includes(_.get(userProfile, 'role.name'))
    ? import.meta.env.VITE_RETURN_URL_MAIN_PAGE
    : import.meta.env.VITE_RETURN_URL_DASHBOARD_PAGE;

  const generateSignature = () => {
    ZoomMtg.generateSDKSignature({
      meetingNumber: id,
      role: 0,
      sdkKey,
      sdkSecret: import.meta.env.VITE_ZOOM_SDK_SECRET,
      cloudRecording: 1,
      success: function (res) {
        setSignature(res);
        startMeeting(res);
      },
      error: function (res) {
      },
    });
  };

  useEffect(() => {
    if (data?.getMeetingById) { generateSignature(); }
  }, [data]);

  const [openLeaveDialog, closeLeaveDialog] = useDialog();

  const handleLeaveMeeting = () => {
    openDeleteDialog({
      title: 'Where are you going?',
      content: 'You ain\'t leaving this meeting, are you?',
      dialog: [openLeaveDialog, closeLeaveDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {

    });
  };

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
  });


  function startMeeting (res) {
    document.getElementById('zmmtg-root').style.display = 'block';
    document.getElementById('root').style.display = 'none';
    ZoomMtg.init({
      leaveUrl, // Use a blank to intercept default leaving
      patchJsMedia: true,
      success: (initSuccess) => {
        ZoomMtg.join({
          signature: res,
          sdkKey,
          meetingNumber: _.get(data, 'getMeetingById.meetingCode'),
          passWord: _.get(data, 'getMeetingById.password'),
          userName: role == '1'
            ? _.get(userProfile, 'reader.nickname', _.get(userProfile, 'fullName'))
            : _.get(userProfile, 'customer.fullName') || 'Anonymous',
          userEmail,
          tk: registrantToken,
          zak: zakToken,

          success: (joinSuccess) => {
            console.log('Meeting joined successfully');
          },
          error: (joinError) => {
            console.error('Error joining meeting:', joinError);
          },
        });

        // Adding listeners for join and leave
        ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
          console.log('User joined:', data);
        });

        ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (event) {
          if (event.status === 'ended' || event.status === 'left') {
            console.log('Meeting ended or left:', event);
            handleLeaveMeeting().then((result) => {
              if (result) {
                window.location.href = leaveUrl; // Redirect to the desired URL if user confirms leaving
              }
            });
          }
        });
      },
      error: (initError) => {
        console.error('Error initializing the meeting:', initError);
      },
    });
  }

  if (error) {
    return <Box className="flex" sx={{
      height: '100%',
      minHeight: '80vh',
    }}>
      <NothingTooSeePage />
      </Box>;
  }

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <Box className="MeetingZoom flex" sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    }}>
              <h1>PagePals Meeting</h1>

              <Button variant='contained' color='primary' onClick={startMeeting}>Join Meeting</Button>
      </Box>
  );
}

export default MeetingZoomScreen;
