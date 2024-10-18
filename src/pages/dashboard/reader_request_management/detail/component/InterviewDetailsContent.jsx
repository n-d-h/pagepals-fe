import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { fDate } from '../../../../../utils/format-time';

import { Accordion, AccordionDetails, AccordionSummary, Box, Button } from '@mui/material';
import Iconify from '../../../../../components/iconify';
import moment from 'moment';
import Label from '../../../../../components/label';
import { useState } from 'react';
import CustomImage from '../../../../../components/image/CustomImage';
import image from '../../../../../assets/landing/no-data.webp';
import scheduleImage from '../../../../../assets/landing/scheduling.png';
import { useDialog } from '../../../../../components/animate/dialog/DialogProvider';
import RecordingForm from './RecordingForm';
import ContentDialog from '../../../../../components/animate/dialog/ContentDialog';


// ----------------------------------------------------------------------

const interviews = [
  // {
  //   id: "123123123",
  //   note: "abc",
  //   interviewAt: "2024-01-02 12:00:00",
  //   result: "PENDING",
  //   state: "PENDING",
  //   meeting: {
  //     id: "123123123",
  //     meetingCode: "123561123",
  //     password: "",
  //   }
  // },
  // {
  //   id: "456456456",
  //   note: "abc",
  //   interviewAt: "2024-01-02 12:00:00",
  //   result: "ACCEPTED",
  //   state: "DONE",
  //   meeting: {
  //     id: "456456456",
  //     meetingCode: "123561123",
  //     password: "",
  //   }
  // },
  // {
  //   id: "789789789",
  //   note: "abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc",
  //   interviewAt: "2024-01-02 12:00:00",
  //   result: "REJECTED",
  //   state: "MISSED",
  //   meeting: {
  //     id: "789789789",
  //     meetingCode: "123561123",
  //     password: "",
  //   }
  // },
]

export default function InterviewDetailsContent({ post, handleJoinClick, handleUpdateInterview, isCustomer, handleInterview }) {
  const {
    answers,
    createdAt,
    id,
    interviewAt,
    meetingCode,
    staffName,
    state,
    updatedAt,
    interviews,
  } = post;

  const [expanded, setExpanded] = useState({});

  const currentInterview = interviews.find((interview) => interview.state === 'PENDING');

  const startAtMoment = moment(currentInterview?.interviewAt).format('LLLL'); // Converts the startAt to a moment object
  const endAt = moment(startAtMoment).add(60, 'minutes').format('LLLL'); // This calculates the end time by adding the duration to startAt
  const processAt = moment(startAtMoment).add(30, 'minutes');
  const now = moment(); // Gets the current time

  const [openDialog, closeDialog] = useDialog();

  const handleOpenRecordingDialog = (meetingCode) => {
    const callBackDialog = () => {
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
				<ContentDialog
					title="Records Detail"
					form={RecordingForm}
					assetForm={{
					  meetingCode: meetingCode,
            isStaff: true,
					}}
					showActions={false}
					callbackFnc={callBackDialog}
				/>
      ),
    });
  };


  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h4">Upcoming Interview</Typography>

      <Typography variant="h6">Interview Time</Typography>
      <Typography variant="body1">{`${moment(currentInterview?.interviewAt).format('LLLL')} (Remmember to join within 60 minutes)`} </Typography>

      <Typography variant="h6">Staff Assign</Typography>
      <Typography variant="body1">{staffName}</Typography>
      {
        now.isBefore(endAt) &&
        (
          <Button
            variant="contained"
            color="primary"
            disabled={!now.isSameOrAfter(startAtMoment) || !now.isSameOrBefore(endAt)}
            onClick={() => handleJoinClick(currentInterview.meeting.meetingCode)}
          >
            Join Meeting
          </Button>
        )
      }

      {
        now.isAfter(startAtMoment) && !isCustomer &&
        (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateInterview(currentInterview.id)}
          >
            Update
          </Button>
        )
      }



    </Stack>
  );

  const renderContentEmpty = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h4">Upcoming Interview</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>
        <CustomImage src={scheduleImage} sx={{ width: 320, height: 240 }} />
        <Box sx={{ mt: 5, color: 'text.secondary' }}>Wait for the customer to choose a time</Box>
      </Box>
    </Stack>
  )

  const renderUpcomingEmpty = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h4">Upcoming Interview</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>
        <CustomImage src={scheduleImage} sx={{ width: 320, height: 240 }} />
        <Box sx={{ mt: 5, color: 'text.secondary' }}>No upcoming interview</Box>
        {!isCustomer && <Button
          color="success"
          variant="contained"
          sx={{ textTransform: 'capitalize', mt: 2 }}
          onClick={() => handleInterview()}
        >Send other interview</Button>}
      </Box>
    </Stack>
  )

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      {[
        {
          label: 'Request ID',
          value: id,
          icon: <Iconify icon="solar:user-id-bold" />,
        },
        {
          label: 'Request State',
          value: state,
          icon: <Iconify icon="fluent:status-20-filled" />,
        },
        {
          label: 'Create At',
          value: fDate(createdAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Update At',
          value: fDate(updatedAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Answer',
          value: answers.length + '/3 answer',
          icon: <Iconify icon="ic:round-question-answer" />,
        },
        {
          label: 'Staff Assign',
          value: staffName || 'No one',
          icon: <Iconify icon="solar:user-id-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          {item.label === 'Request State'
            ? (
              <ListItemText
                primary={item.label}
                secondary={item.value}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'red',
                  component: 'span',
                }}
              />
            )
            : (
              <ListItemText
                primary={item.label}
                secondary={item.value}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.primary',
                  component: 'span',
                }}
              />
            )}

        </Stack>
      ))}
    </Stack>
  );

  const renderHistory = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', mt: 3 }}>
      <Typography variant="h4">Interview History</Typography>

      {!(interviews === null || interviews.length < 1) ?
        (<Grid item container xs={12} rowSpacing={2} rowGap={1} mt={1}>
          {interviews?.map((interview, index) => (
            <Grid item xs={12} key={index} sx={{
              bgcolor: 'white',
              borderRadius: 2,
            }}>
              <Accordion expanded={
                expanded[interview.id]
              }
                onChange={() => {
                  setExpanded({
                    ...expanded,
                    [interview.id]: !expanded[interview.id],
                  });
                }}>
                <AccordionSummary
                  expandIcon={<Iconify icon="ic:baseline-expand-more" />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderBottom: expanded[interview.id] ? 'none' : '1px solid #e0e0e0',
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16,
                    borderBottomRightRadius: expanded[interview.id] ? 0 : 16,
                    borderBottomLeftRadius: expanded[interview.id] ? 0 : 16,
                    p: 2,
                  }}
                >

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" mr='3px'>Interview ID </Typography>
                    <Typography variant="body2" marginRight={1}> [{interview?.id}]</Typography>
                    <Typography variant="body2" color={'#07bc0c'} fontWeight={'bold'} >{interview?.id === currentInterview?.id && '- Current'}</Typography>
                  </Box>


                </AccordionSummary>
                <AccordionDetails sx={{
                  border: '1px solid #e0e0e0',
                  borderTop: 'none',
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 16,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Interview Status</Typography>
                    <Label
                      variant="soft"
                      color={
                        (interview.state.toLowerCase() === 'done' && 'success') ||
                        (interview.state.toLowerCase() === 'pending' && 'warning') ||
                        (interview.state.toLowerCase() === 'missed' && 'error') ||
                        'default'
                      }
                    >
                      {interview.state ? interview.state : 'NotDefined'}
                    </Label>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Interview Result</Typography>
                    <Label
                      variant="soft"
                      color={
                        (interview.result.toLowerCase() === 'accepted' && 'success') ||
                        (interview.result.toLowerCase() === 'pending' && 'warning') ||
                        (interview.result.toLowerCase() === 'rejected' && 'error') ||
                        'default'
                      }
                    >
                      {interview.result ? interview.result : 'NotDefined'}
                    </Label>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Interview At</Typography>
                    <Typography variant="body2">{interview?.interviewAt}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Note</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{interview?.note}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">Record</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenRecordingDialog(interview?.meeting.meetingCode)}
                    >Check Recording</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>)
        :
        (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 5, textAlign: 'center' }}>
            <CustomImage src={image} sx={{ width: 320, height: 240 }} />
            <Box sx={{ mt: 5, color: 'text.secondary' }}>No data</Box>
          </Box>
        )}


    </Stack>

  )

  return (
    <Grid container spacing={3}>

      <Grid xs={12} md={8} >

        {/* {interviews.length > 0 ? renderContent : renderContentEmpty} */}

        {state === 'INTERVIEW_SCHEDULING' && renderContentEmpty}
        {state === 'INTERVIEW_PENDING' && currentInterview !== undefined && renderContent}
        {state === 'INTERVIEW_PENDING' && currentInterview === undefined && renderUpcomingEmpty}

        {renderHistory}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}

        {/* {renderCompany} */}
      </Grid>
    </Grid>
  );
}

InterviewDetailsContent.propTypes = {
  post: PropTypes.object,
};
