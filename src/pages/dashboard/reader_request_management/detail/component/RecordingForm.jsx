import { Button, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
import React from 'react';
import iconImage from '../../../../../assets/icons/files/ic_video.svg';
import Image from '../../../../../components/shadcn-ui/image';
import { useNavigate } from 'react-router';
import { paths } from '../../../../../components/router/paths';
import moment from 'moment';
import { getMeetingRecording } from '../../../../../services/apolo/queries';
import { useQuery } from '@apollo/client';
import BackdropLoading from '../../../../backdrop_loading/BackdropLoading';

export const DownloadRecordingButton = ({ downloadUrl, playUrl, closeDialog, isStaff }) => {
  const navigate = useNavigate();

  if (!downloadUrl) {
    return null;
  }

  if (!playUrl) {
    return null;
  }

  const handleViewRecording = () => {
    closeDialog();
    closeDialog();
    // navigate(paths.main.viewRecording(playUrl.split('/').pop()));
    // window.open(paths.main.viewRecording(playUrl.split('/').pop()), '_blank');
    if (isStaff) {
      window.open(paths.dashboard.viewRecording(playUrl.split('/').pop()), '_blank');
    } else {
      window.open(paths.main.viewRecording(playUrl.split('/').pop()), '_blank');
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <Button
        variant="contained"
        color="primary"
        size='small'
        component="a"
        onClick={handleViewRecording}
        sx={{ mb: 0, float: 'right' }}
      >
        View Recording
      </Button>
    </Box>
  );
};

const RecordingForm = ({ meetingCode, callbackFnc, isStaff }) => {
  // const formatDuration = (recordData) => {
  //   return `${_.get(recordData, 'duration', 0)} minutes`;
  const formatDuration = (start, end) => {
    const dateFormats = [
      'ddd MMM DD HH:mm:ss [ICT] YYYY', // e.g., Sat May 25 20:48:30 ICT 2024
      'YYYY-MM-DD HH:mm:ss.S',          // e.g., 2024-05-24 20:29:06.0
    ];

    const startAt = moment(start, dateFormats, true);
    const endAt = moment(end, dateFormats, true);

    if (!startAt.isValid() || !endAt.isValid()) {
      return 'Invalid date';
    }
    const duration = moment.duration(endAt.diff(startAt));

    if (duration.asHours() >= 1) {
      const hours = Math.floor(duration.asHours());
      const minutes = Math.floor(duration.minutes());
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(duration.asMinutes());
      const seconds = Math.floor(duration.seconds());
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
  };

  const { loading, data, refetch } = useQuery(getMeetingRecording, {
    variables: { meetingId: meetingCode },
  });

  if(loading) return <BackdropLoading />


  return (

    <List sx={{
      width: '100%',
    }}>
       {_.get(data, 'getMeetingRecordings.meetings', []).length === 0 && (<>No record found</>)}
      {_.get(data, 'getMeetingRecordings.meetings', []).map((item, index) => {
        const downloadItem = item.recording_files.find((file) => file.recording_type === 'shared_screen_with_speaker_view');
        return (
          <ListItem
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #E0E0E0',
              borderRadius: 1,
              mb: 1,
              backgroundColor: '#F9F9F9',
            }}
            key={index}
            secondaryAction={
              <DownloadRecordingButton
                downloadUrl={_.get(downloadItem, 'download_url', '')}
                playUrl={_.get(downloadItem, 'play_url', '')}
                closeDialog={callbackFnc}
                isStaff={isStaff}
              />
            }
          >
            <ListItemAvatar>
              <Image src={iconImage} sx={{ width: 32, height: 32 }} />

            </ListItemAvatar>

            <ListItemText
              primary={formatDuration(_.get(downloadItem, 'recording_start'), _.get(downloadItem, 'recording_end'))}
              secondary={'mp4'}
            />
          </ListItem>
        );
      })}
    </List>

  );
};

export default RecordingForm;

// 	<DownloadRecordingButton
// 		downloadPassword={_.get(recordData, 'getRecording.download_access_token', '')}
// 		downloadUrl={_.get(recordData, 'getRecording.recording_files[0].download_url', '')}
// 	/>

// import { Button, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
// import React, { useState } from 'react';
// import iconImage from '../../../../assets/icons/files/ic_video.svg';
// import Image from '../../../../components/shadcn-ui/image';

// export const DownloadRecordingButton = ({ downloadUrl, playUrl, onPlay }) => {
//   if (!downloadUrl) {
//     return null;
//   }

//   return (
//     <Box sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       gap: 2,
//     }}>
//       <Button
//         variant="contained"
//         color="primary"
//         size='small'
//         onClick={() => onPlay(playUrl)}
//         sx={{ mb: 0, float: 'right' }}
//       >
//         View Recording
//       </Button>
//     </Box>
//   );
// };

// const RecordingForm = ({ data }) => {
//   const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

//   const formatDuration = (recordData) => {
//     return `${_.get(recordData, 'duration', 0)} minutes`;
//   };

//   return (
//     <Box>
//       {selectedVideoUrl && (
//         <Box sx={{ mb: 2 }}>
//           <iframe
//             src={selectedVideoUrl}
//             width="100%"
//             height="480"
//             allow="autoplay; encrypted-media"
//             allowFullScreen
//             title="Zoom Video"
//           />
//         </Box>
//       )}
//       <List sx={{
//         width: '100%',
//       }}>
//         {_.get(data, 'meeting.records', []).map((item, index) => {
//           const downloadItem = item.recordFiles.find((file) => file.recordingType === 'shared_screen_with_speaker_view');
//           return (
//             <ListItem
//               sx={{
//                 width: '100%',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 border: '1px solid #E0E0E0',
//                 borderRadius: 1,
//                 mb: 1,
//                 backgroundColor: '#F9F9F9',
//               }}
//               key={index}
//               secondaryAction={
//                 <DownloadRecordingButton
//                   downloadUrl={_.get(downloadItem, 'downloadUrl', '')}
//                   playUrl={_.get(downloadItem, 'playUrl', '')}
//                   onPlay={(url) => setSelectedVideoUrl(url)}
//                 />
//               }
//             >
//               <ListItemAvatar>
//                 <Image src={iconImage} sx={{ width: 32, height: 32 }} />
//               </ListItemAvatar>
//               <ListItemText
//                 primary={formatDuration(item)}
//                 secondary={'mp4'}
//               />
//             </ListItem>
//           );
//         })}
//       </List>
//     </Box>
//   );
// };

// export default RecordingForm;
