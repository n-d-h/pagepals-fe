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
import Link from '@mui/material/Link';
import RouterLink from '../../../../../components/router/router-link';
import { paths } from '../../../../../components/router/paths';


// ----------------------------------------------------------------------

// const lastRequests = [
//   {
//     answers: [
//       {
//         id: "1",
//         content: "bac",
//         question: [{
//           id: "1",
//           content: "bac",
//         }]
//       }],
//     id: "1",
//     description: "description",
//     createdAt: "",
//     staffId: "staffId",
//     staffName: "staffName",
//     state: "REJECT",
//     updatedAt: "",
//     reader: {
//       id: "1",
//       audioDescriptionUrl: "",
//       avatarUrl: "",
//       countryAccent: "",
//       createdAt: "",
//       deletedAt: "",
//       description: "",
//       genre: "",
//       introductionVideoUrl: "",
//       language: "",
//       nickname: "",
//       updatedAt: "",
//       readerRequestReference: {
//         account: {
//           id: "",
//           username: "",
//           email: "",
//         }
//       }
//     },
//     interviews: [{
//       id: "1",
//       note: "",
//       interviewAt: "",
//       result: "",
//       state: "",
//       meeting: {
//         id: "",
//         meetingCode: "",
//         password: "",
//       }
//     }]
//   },
//   {
//     answers: [
//       {
//         id: "",
//         content: "",
//         question: [{
//           id: "",
//           content: "",
//         }]
//       }],
//     id: "",
//     description: "",
//     createdAt: "",
//     staffId: "",
//     staffName: "",
//     state: "REJECT",
//     updatedAt: "",
//     reader: {
//       id: "",
//       audioDescriptionUrl: "",
//       avatarUrl: "",
//       countryAccent: "",
//       createdAt: "",
//       deletedAt: "",
//       description: "",
//       genre: "",
//       introductionVideoUrl: "",
//       language: "",
//       nickname: "",
//       updatedAt: "",
//       readerRequestReference: {
//         account: {
//           id: "",
//           username: "",
//           email: "",
//         }
//       }
//     },
//     interviews: [{
//       id: "",
//       note: "",
//       interviewAt: "",
//       result: "",
//       state: "",
//       meeting: {
//         id: "",
//         meetingCode: "",
//         password: "",
//       }
//     }]
//   }
// ]

export default function HistoryDetailsContent({ post, isCustomer }) {
  const {
    answers,
    createdAt,
    id,
    interviewAt,
    meetingCode,
    staffName,
    state,
    updatedAt,
    // interviews,
    lastRequests,
  } = post;

  const [expanded, setExpanded] = useState({});

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
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h4">Request History</Typography>

      {!(lastRequests === null || lastRequests.length < 1) ?
        (<Grid item container xs={12} rowSpacing={2} rowGap={1} mt={1}>
          {lastRequests?.map((request, index) => (
            <Grid item xs={12} key={index} sx={{
              bgcolor: 'white',
              borderRadius: 2,
            }}>
              <Accordion expanded={
                expanded[request.id]
              }
                onChange={() => {
                  setExpanded({
                    ...expanded,
                    [request.id]: !expanded[request.id],
                  });
                }}>
                <AccordionSummary
                  expandIcon={<Iconify icon="ic:baseline-expand-more" />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderBottom: expanded[request.id] ? 'none' : '1px solid #e0e0e0',
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16,
                    borderBottomRightRadius: expanded[request.id] ? 0 : 16,
                    borderBottomLeftRadius: expanded[request.id] ? 0 : 16,
                    p: 2,
                  }}
                >

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" mr='3px'>Request ID </Typography>
                    <Typography variant="body2"> [{request?.id}]</Typography>
                  </Box>


                </AccordionSummary>
                <AccordionDetails sx={{
                  border: '1px solid #e0e0e0',
                  borderTop: 'none',
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 16,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Status</Typography>
                    <Label
                      variant="soft"
                      color={
                        (request?.state.toLowerCase() === 'pass' && 'success') ||
                        (request?.state.toLowerCase() === 'reject' && 'error') ||
                        'warning'
                      }
                    >
                      {request.state ? request.state : 'NotDefined'}
                    </Label>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Staff ID</Typography>
                    <Typography variant="body2" >{request?.staffId}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Staff Name</Typography>
                    <Typography variant="body2" >{request?.staffName}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold" >Description</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{request?.description}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}></Typography>
                    <Link
                      color="inherit"
                      target="_blank"
                      component={RouterLink}
                      href={paths.dashboard.readerRequestDetail(request?.id)}
                    >
                      <Button
                        color="success"
                        variant="contained"
                        sx={{ textTransform: 'capitalize' }}
                      >View Detail</Button>
                    </Link>
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
        {renderHistory}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
      </Grid>
    </Grid>
  );
}

HistoryDetailsContent.propTypes = {
  post: PropTypes.object,
};
