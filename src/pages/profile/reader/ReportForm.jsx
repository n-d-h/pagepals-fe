import { useMutation } from '@apollo/client';
import { Box, Divider, TextField } from '@mui/material';
import React, { useState } from 'react';
import { handleFriendlyError, showNotification } from '../../../components/common_services/CommonServices';
import { createReportMutation } from '../../../services/apolo/mutations';
import { LoadingButton } from '@mui/lab';

const READER_REPORT_REASON = [
  'Bias or Unprofessionalism',
  'Failure to Meet Deadlines',
  'Inadequate Customer Service',
  'Inaccurate or Misleading Information',
];

const BOOKING_REPORT_REASON = [
  'No-Show or Cancellation',
  'Unprofessional Behavior',
  'Poor Quality of Service',
  'Lack of Preparation',
  'Miscommunication or Misrepresentation',
];

const ReportForm = (props) => {
  const { customerId, reportId, type, closeDialog, closeDetailDialog } = props;

  const [sendReport, { loading: reportLoading }] = useMutation(createReportMutation, {
    onCompleted: () => {
      showNotification('success', 'Submit report successfully');
      closeDialog();
      closeDetailDialog();
    },
    onError: (e) => {
      handleFriendlyError(e, 'Cannot submit report. Please try again later');
    },
  });

  const [report, setreport] = useState('');

  return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3, py: 2 }}>
            {type === 'READER' && (READER_REPORT_REASON.map((reason) => (
                <Box key={reason} width={'70%'}>
                <LoadingButton
                    variant="outlined"
                    fullWidth
                    color="error"
                    onClick={() => {
                      sendReport({
                        variables: {
                          customerId,
                          reason,
                          reportId,
                          type,
                        },
                      });
                    }}
                    loading={reportLoading}
                >
                    {reason}
                </LoadingButton>
                </Box>
            )))}

            {type === 'BOOKING' && (BOOKING_REPORT_REASON.map((reason) => (
                <Box key={reason} width={'70%'}>
                <LoadingButton
                    variant="outlined"
                    fullWidth
                    color="error"
                    onClick={() => {
                      sendReport({
                        variables: {
                          customerId,
                          reason,
                          reportId,
                          type,
                        },
                      });
                    }}
                    loading={reportLoading}
                >
                    {reason}
                </LoadingButton>
                </Box>
            )))}

            <Divider orientation="horizontal" flexItem>OR</Divider>

            <TextField label="Other reason" multiline value={report} onChange={(e) => setreport(e.target.value)} rows={3} fullWidth />
            <LoadingButton
                variant="contained"
                color="error"
                onClick={() => {
                  sendReport({
                    variables: {
                      customerId,
                      reason: report,
                      reportId,
                      type,
                    },
                  });
                }}
                loading={reportLoading}
            >
                Report
            </LoadingButton>
        </Box>
  );
};

export default ReportForm;
