import { Box } from '@mui/material';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/slices/authSlice';

const MeetingView = (props) => {
  const { endCall, data } = props;
  const [countdown, setCountdown] = useState(_.get(data.row, 'service.duration'));

  const roomID = _.get(data.row, 'meeting.meetingCode');
  const userInfo = useSelector(selectUser);

  const myMeeting = async (element) => {
    // generate Kit Token
    const appID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      _.get(userInfo, 'customer.id') || _.get(userInfo, 'id'),
      _.get(userInfo, 'username'),
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      maxUsers: 2,
      videoResolutionDefault: 'HD',
      onLeaveRoom: endCall,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?roomID=' +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const countdownTimeout = setTimeout(() => {
      endCall();
    }, countdown * 1000 * 60 * 60 * 60);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(countdownTimeout);
    };
  }, []);

  return (
    <Box
      sx={{
        width: '95vw',
        height: '80vh',
        position: 'relative',
      }}
    >
      {/* <Box sx={{ position: 'absolute', top: 15, right: 25, width: 50, height: 50 }}>
        <Box sx={{
          bgcolor: 'primary.main',
          borderRadius: 99999,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography variant="h4" sx={{ color: '#fff' }}>
            {countdown}
          </Typography>
        </Box>
      </Box> */}
      <Box ref={myMeeting} sx={{ width: '100%', height: '100%' }}></Box>
    </Box>
  );
};

export default MeetingView;
