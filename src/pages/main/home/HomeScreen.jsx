/* eslint-disable no-undef */
import { useMutation } from '@apollo/client';
import { getToken } from '@firebase/messaging';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { messaging, setupNotifications } from '../../../auth/firebase';
import { logout } from '../../../auth/loginMethods';
import { sendNativeNotification, toastNotification } from '../../../const/notificationHelpers';
import useVisibilityChange from '../../../const/useVisibilityChange';
import { selectUser } from '../../../redux/slices/authSlice';
import { updateFcmtoken } from '../../../services/apolo/mutations';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import SeminarView from './campaign_view/SeminarView';
import ReadersView from './reader_view/ReadersView';

const HomeScreen = ({ isGuest = false }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser);

  const isForeground = useVisibilityChange();

  const [updateFcm, { loading: updateFcmLoading }] = useMutation(updateFcmtoken, {
    onError: (e) => {
      dispatch(logout());
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    async function setupNotifications () {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Get the FCM token
        const token = await getToken(messaging);
        updateFcm({
          variables: {
            fcmToken: token,
            id: userProfile.id,
          },
        });
      }
    }

    setupNotifications();
    return () => {
      // Cleanup logic here
    };
  }, []);

  useEffect(() => {
    setupNotifications((message, token) => {
      if (isForeground) {
        // App is in the foreground, show toast notification
        toastNotification({
          title,
          description: body,
          status: 'info',
        });
      } else {
        // App is in the background, show native notification
        sendNativeNotification({
          title,
          body,
        });
      }
    });
  }, []);

  if (updateFcmLoading) return <BackdropLoading />;

  return (
		<>
			<Helmet>
				<title>PagePals - Home</title>
			</Helmet>

			<div className="w-full rounded-md relative flex flex-col items-center justify-center antialiased">
				<Box
					sx={{
					  width: '100%',
					  my: 5,
					  display: 'flex',
					  justifyContent: 'center',
					  alignItems: 'center',
					  zIndex: 1000,
					}}
				>
					<SeminarView isGuest={isGuest}/>
				</Box>
				<Box
					sx={{
					  width: '100%',
					  my: 5,
					  display: 'flex',
					  justifyContent: 'center',
					  alignItems: 'center',
					  zIndex: 1000,
					}}
				>
					<ReadersView isGuest={isGuest} />
				</Box>
			</div>

		</>
  );
};

export default HomeScreen;
