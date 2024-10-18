import { Box, Chip, Grid, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

const ReportStatusEnum = {
  PENDING: {
    label: 'Pending',
    color: 'warning',
  },
  REFUNDED: {
    label: 'Refunded',
    color: 'success',
  },
};

const ReportCustomerInformation = ({ report }) => {
  return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height: '100%', bgcolor: 'white', p: 2, borderRadius: 2 }}>
            <Typography variant="h6">Report Information</Typography>

            <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={700}>Report ID</Typography>

                        <Typography variant="body2">{report?.id}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={700}>Report Reason</Typography>

                        <Typography variant="body2" color='error'>{report?.reason}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={700}>Report Status</Typography>

                        <Chip label={ReportStatusEnum[report?.state]?.label} color={ReportStatusEnum[report?.state]?.color} variant='outlined' />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={700}>Report At</Typography>

                        <Typography variant="body2">{moment(report?.updatedAt).format('LLLL')}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={700}>Report Customer </Typography>

                        <Typography variant="body2">{_.get(report, 'customer.fullName')}</Typography>
                    </Box>
                </Grid>

            </Grid>
        </Box>
  );
};

export default ReportCustomerInformation;
