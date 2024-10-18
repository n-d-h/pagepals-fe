import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from '../../../../components/router/paths';

import { useMutation } from '@apollo/client';
import moment from 'moment';
import { generatePath, useNavigate } from 'react-router';
import ContentDialog from '../../../../components/animate/dialog/ContentDialog';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import Iconify from '../../../../components/iconify';
import { acceptRequestMutation, rejectRequestMutation, updateRequestInterviewMutation, updateRequestToScheduling, updateInterview } from '../../../../services/apolo/mutations';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import AnswerDetailsContent from './component/AnswerDetailsContent';
import InformationDetailsContent from './component/InformationDetailsContent';
import InterviewDetailsContent from './component/InterviewDetailsContent';
import JobDetailsToolbar from './component/JobDetailsToolbar';
import { Button, TextField } from '@mui/material';
import HistoryDetailsContent from './component/HistoryDetailsContent';
import InterviewUpdateForm from './component/InterviewUpdateForm';
import RejectRequestForm from './component/RejectRequestForm';

// ----------------------------------------------------------------------

const JOB_DETAILS_TABS = [
  { value: 'answer', label: 'Answer' },
  { value: 'information', label: 'Information' },
  { value: 'interview', label: 'Interview' },
  { value: 'history', label: 'History' },
];

export const JOB_PUBLISH_OPTIONS = [
  {
    value: 'interviewing',
    label: 'Interviewing',
  },
  {
    value: 'reject',
    label: 'Reject',
  },
];

export default function ReaderRequestDetailView({ post, user, refetch }) {
  const [currentTab, setCurrentTab] = useState('answer');
  const [interviewDate, setInterviewDate] = useState(moment());
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');


  const [openDialog, closeDialog] = useDialog();

  const [updateRequestInterview, { loading: updateLoading }] = useMutation(updateRequestInterviewMutation);

  const [rejectRequest, { loading: rejectLoading }] = useMutation(rejectRequestMutation, {
    onCompleted: () => {
      showNotification('success', 'Update successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Update fail');
    },
  });

  const [acceptRequest, { loading: acceptLoading }] = useMutation(acceptRequestMutation, {
    onCompleted: () => {
      showNotification('success', 'Update successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Update fail');
    },
  });

  const [acceptSchedule, { loading: acceptScheduleLoading }] = useMutation(updateRequestToScheduling, {
    onCompleted: () => {
      showNotification('success', 'Update successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Update fail');
    },
  });

  const [acceptUpdateInterview, { loading: acceptUpdateInterviewLoading }] = useMutation(updateInterview, {
    onCompleted: () => {
      showNotification('success', 'Update successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'Update fail');
    },
  });



  // if(updateLoading || rejectLoading || acceptLoading) return <BackdropLoading />;

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    // setPublish(newValue);
  }, []);

  const handleRejectConfirmation = async () => {

    if(reason.trim() === '') {
      showNotification('error', 'Please input reason');
      return;
    }

    try {
      await rejectRequest({
        variables: {
          requestId: post.id,
          staffId: user?.id,
          reason: reason,
          description,
        },
      });
    } catch (error) {
    }finally {
      closeDialog();
    }
  };

  const handleAcceptConfirmation = async () => {
    try {
      await acceptRequest({
        variables: {
          requestId: post.id,
          staffId: user?.id,
          description,
        },
      });
    } catch (error) {
    }
  };

  const handleInterviewConfirm = async () => {
    try {
      await acceptSchedule({
        variables: {
          requestId: post.id,
          staffId: user?.id,
          description,
        },
      });
    } catch (error) {}
  };

  const handleInterview = async () => {
    const callBackDialog = (state) => {
      if (state) {
        handleInterviewConfirm();
      }
      closeDialog();
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Confirmation"
          content={
            <>
              Confirmation to update request of reader {post.reader.nickname} to interview
            </>
          }
          agreeButtonName={'Confirm'}
          showActions={true}

          callbackFnc={callBackDialog}
        />
      ),
    });
  };
  
  const handleReject = async () => {
    const callBackDialog = (state) => {
      if (state) {
          handleRejectConfirmation();
          // closeDialog();
      } else {
        closeDialog();
      }
    };

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Confirmation"
          form={RejectRequestForm}
          assetForm={{
            data: post,
            refetch,
            closeDialog: callBackDialog,
            user: user,
          }}
          showActions={false}

          callbackFnc={callBackDialog}
        />
      ),
    });
  };

  const handleAccept = async () => {
    const callBackDialog = (state) => {
      if (state) {
        handleAcceptConfirmation();
      }
      closeDialog();
    };

    const interview = post.interviews.find((interview) => interview.result === 'ACCEPTED');

    if(interview === undefined) {
      showNotification('error', 'This request is not qualified for accepting (no accepted interview)');
      return;
    }

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Confirmation"
          content={
            <>
              Confirmation to accept request of reader {post.reader.nickname}
            </>
          }
          agreeButtonName={'Confirm'}

          showActions={true}

          callbackFnc={callBackDialog}
        />
      ),
    });
  };

  const handleUpdateInterview = async (id) => {
    const callBackDialog = (state) => {
      closeDialog();
    };

    const updateInterview = async (data) => {

      const variables = {
        interviewId: id,
        note: data.note,
        state: data.state.toUpperCase(),
        result: data.result.toUpperCase(),
      };

      try {
        await acceptUpdateInterview({
          variables: variables
        });
        closeDialog();
        refetch();
      } catch (error) {
      }
    }

    openDialog({
      maxWidth: 'xs',
      fullWidth: true,
      children: (
        <ContentDialog
          title="Confirmation"
          form={InterviewUpdateForm}
          assetForm={{
            onUpdate: updateInterview,
            onClose: callBackDialog,
            setNote: setNote,
          }}

          showActions={false}

          callbackFnc={callBackDialog}
        />
      ),
    });
  };
  const navigate = useNavigate();

  const [openJoinDialog, closeJoinDialog] = useDialog();

  const handleJoinClick = (data) => {
    console.log(post.meetingCode);
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
          role: 1,
        });

        navigate(path);
      }
    });
  };

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {JOB_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'interview' && post?.staffId !== user?.id
              ? (
                <Iconify icon="material-symbols:lock" />
              )
              : (
                ''
              )
          }
          disabled={tab.value === 'interview' && post?.staffId !== user?.id}
        />
      ))}
    </Tabs>
  );

  if (acceptLoading || rejectLoading || updateLoading) return <BackdropLoading />;

  return (
    <Container maxWidth='lg'>
      <JobDetailsToolbar
        backLink={paths.dashboard.readerRequestManagement}
        // editLink={paths.dashboard.job.edit(`${currentJob?.id}`)}
        liveLink="#"
        // publish={publish || ''}
        state={post.state}
        onReject={handleReject}
        onAcceptRequest={handleAccept}
        onInterview={handleInterview}
        interviewDate={interviewDate}
        setInterviewDate={setInterviewDate}
        description={description}
        setDescription={setDescription}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {currentTab === 'answer' && <AnswerDetailsContent post={post} />}

      {currentTab === 'information' && <InformationDetailsContent post={post} />}

      {currentTab === 'interview' && <InterviewDetailsContent post={post} handleJoinClick={handleJoinClick} handleUpdateInterview={handleUpdateInterview} handleInterview={handleInterview}/>}

      {currentTab === 'history' && <HistoryDetailsContent post={post} handleJoinClick={handleJoinClick} />}
    </Container>
  );
}

ReaderRequestDetailView.propTypes = {
  id: PropTypes.string,
};
