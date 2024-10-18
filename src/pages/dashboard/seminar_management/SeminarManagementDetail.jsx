import { useMutation, useQuery } from '@apollo/client';
import { AccordionSummary, Box, Card, CardContent, CardHeader, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import Editor from '../../../components/editor/editor';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Upload from '../../../components/shadcn-ui/upload/upload';
import { getSeminarRequestDetail } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReaderBookCardV2 from '../../profile/reader/ReaderBookCardV2';
import { LoadingButton } from '@mui/lab';
import { useDialog } from '../../../components/animate/dialog/DialogProvider';
import ContentDialog from '../../../components/animate/dialog/ContentDialog';
import { selectUser } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { acceptSeminarRequest, rejectSeminarRequest } from '../../../services/apolo/mutations';
import RejectForm from './RejectForm';
import { paths } from '../../../components/router/paths';

const StateLabelENUM = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

const StateColorENUM = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'error',
};

const SeminarManagementDetail = () => {
  const { id } = useParams();

  const userProfile = useSelector(selectUser);

  const navigate = useNavigate();

  const { data, loading, error } = useQuery(getSeminarRequestDetail, {
    variables: {
      id,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while getting seminar data');
    },
  });

  const [expanded, setExpanded] = React.useState({});

  const [acceptSeminar, { loading: acceptLoading }] = useMutation(acceptSeminarRequest, {
    onCompleted: () => {
      showNotification('success', 'Seminar accepted');
      closeDialog();
      navigate(paths.dashboard.seminarManagement);
    },
    onError: (e) => {
      handleFriendlyError(e, 'Seminar accept failed');
    },
  });

  const [rejectSeminar, { loading: rejectLoading }] = useMutation(rejectSeminarRequest, {

    onCompleted: () => {
      showNotification('success', 'Seminar rejected');
      closeDialog();
    },
    onError: (e) => {
      handleFriendlyError(e, 'Seminar reject failed');
    },

  });

  const [rejectReason, setRejectReason] = React.useState('');

  const [openDialog, closeDialog] = useDialog();
  const handleAcceptSeminar = () => {
    const callBackDialog = (state) => {
      if (state) {
        acceptSeminar({
          variables: {
            id,
            staffId: userProfile.id,
          },
        });
      }
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
                  <ContentDialog
                      title="Confirmation"
                      content={(
                          <Box
                              sx={{
                                height: '100%',
                                bgcolor: 'white',
                                borderRadius: 3,
                              }}
                          >
                                <Typography variant="body1" color={'black'} textAlign={'center'} fontWeight={600}>
                                    Are you sure you want to accept this seminar?
                                </Typography>
                          </Box>
                      )}
                      callbackFnc={callBackDialog}
                      showActions={true}
                      agreeButtonName={'Confirm'}
                  />
      ),
    });
  };

  const handleRejectSeminar = () => {
    const callBackDialog = () => {
      closeDialog();
    };

    const rejectSeminarRequest = async (data) => {
      rejectSeminar({
        variables: {
          id,
          staffId: userProfile.id,
          reason: data.rejectReason,
        },
      });

      callBackDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
                  <ContentDialog
                      title="Confirmation"
                      form={RejectForm}
                      callbackFnc={callBackDialog}
                      assetForm={{
                        update: rejectSeminarRequest,
                      }}
                      showActions={false}
                  />
      ),
    });
  };

  function parseDuration (duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  if (loading) {
    return <BackdropLoading />;
  }

  if (error) {
    return <Box className="flex" sx={{
      width: '100%',
      minHeight: '70vh',
      height: '100%',
    }}>
        <NothingTooSeePage />
      </Box>;
  }
  return (
    <Box sx={{
      width: '100%',
      mt: 5,
      flexDirection: 'column',
      gap: 3,

    }}
        className="flex"
    >
      <Grid container spacing={2} alignItems={'start'} sx={{ width: '90%', height: '100%', mt: 2 }}>

        <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            width: '70%',
          }}>
            <Box sx={{
              py: 1,
              width: '30%',
              borderRadius: 1,
              border: '1px solid #70b4d2',
              boxShadow: 'rgba(0, 184, 217, 0.16) 0px 7px 29px 0px',
              backgroundColor: 'rgba(0, 184, 217, 0.16)',
            }}>
              <Typography variant="body1" color={'#006C9C'} textAlign={'center'} fontWeight={600}>
                Seminar Info
              </Typography>

            </Box>

              <Box sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center',
              }}>
                <Iconify icon="bi:clock" width={20} height={20} color="black" />
                <Typography variant="body1" color={'black'} textAlign={'center'} fontWeight={600}>{parseDuration(_.get(
                  data,
                  'getSeminarRequest.duration',
                ))}</Typography>
              </Box>

          </Box>

                {_.get(data, 'getSeminarRequest.state') !== 'PENDING'
                  ? (<Box sx={{
                      width: '30%',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}>

            <Label color={StateColorENUM[_.get(data, 'getSeminarRequest.state')]}>
              {StateLabelENUM[_.get(data, 'getSeminarRequest.state')]}
            </Label>
          </Box>
                    )
                  : (
                    <Box sx={{
                      width: '30%',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                    }}>
                            <LoadingButton variant="contained" color="primary" onClick={handleAcceptSeminar} loading={loading}>
                                Accept
                            </LoadingButton>

                            <LoadingButton variant="contained" color="error" onClick={handleRejectSeminar} loading={loading}>

                                Reject
                            </LoadingButton>
                        </Box>
                    )}

        </Grid>

        {_.get(data, 'getSeminarRequest.state') === 'REJECTED' && (
          <Grid item xs={12} md={12}>
            <Box sx={{
              width: '100%',
              borderRadius: 1,
              border: '1px solid #FF0000',
              backgroundColor: 'rgba(255, 86, 48, 0.16)',
              boxShadow: 'rgba(255, 86, 48, 0.16) 0px 7px 29px 0px',
              p: 3,
            }}>
              <Typography variant="subtitle1" color={'#FF0000'} textAlign={'center'} fontWeight={600}>
                Reject Reason: {_.get(data, 'getSeminarRequest.rejectReason')}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12} md={12}>
          <AccordionSummary
            expanded={
              expanded[_.get(
                data,
                'getSeminarRequest.book.id',

              )]
            }
            onClick={() => {
              setExpanded({
                ...expanded,
                [_.get(
                  data,
                  'getSeminarRequest.book.id',

                )]: !expanded[_.get(
                  data,
                  'getSeminarRequest.book.id',

                )],
              });
            }}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              backgroundColor: 'white',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              p: 2,
            }}
          >
            <ReaderBookCardV2
              book={_.get(
                data,
                'getSeminarRequest.book',
              )} option={'noView'} wrapperStyles={{
                p: 0,
              }}
              open={expanded[_.get(
                data,
                'getSeminarRequest.book.id',

              )]}
              seeMore={true}
            />
          </AccordionSummary>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#e0e0e0',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          }}>
            <Card>
              <CardHeader title="Seminar Description" />
              <CardContent>
                <Editor
                  id="full-editor"
                  disabled={true}
                  initialValue={_.get(
                    data,
                    'getSeminarRequest.description',

                  )}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#e0e0e0',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          }}>
            <Card>
              <CardHeader title="Seminar Title" />
              <CardContent>

                    <TextField fullWidth value={_.get(
                      data,
                      'getSeminarRequest.title',

                    )} disabled />

              </CardContent>
            </Card>
          </Box>

          <Box sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#e0e0e0',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          }}>
            <Card>
              <CardHeader title="Seminar Image" />
              <CardContent>
                <Upload
                  disabled
                  file={_.get(
                    data,
                    'getSeminarRequest.imageUrl',
                  )}
                  maxSize={3145728}

                   />
              </CardContent>
            </Card>
          </Box>

        </Grid>
      </Grid >
      </Box>
  );
};

export default SeminarManagementDetail;
