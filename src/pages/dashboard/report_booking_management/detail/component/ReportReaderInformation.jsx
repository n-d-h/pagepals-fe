import { useQuery } from '@apollo/client';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { handleFriendlyError } from '../../../../../components/common_services/CommonServices';
import { usePopover } from '../../../../../components/custom-popover';
import CustomPopover from '../../../../../components/custom-popover/custom-popover';
import Iconify from '../../../../../components/iconify';
import { getBookingDetailById, getReportListByReader } from '../../../../../services/apolo/queries';
import BackdropLoading from '../../../../backdrop_loading/BackdropLoading';
import ReaderCard from '../../../../main/home/reader_view/ReaderCard';

const ReportReaderInformation = ({ report }) => {
  const popover = usePopover();

  const { data: bookingData, loading: bookingLoading } = useQuery(getBookingDetailById, {
    variables: {
      id: report?.reportedId,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Cannot fetch booking detail');
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: reportListData, loading: reportListLoading, refetch } = useQuery(getReportListByReader, {
    variables: {
      id: _.get(bookingData, 'getBookingById.service.reader.id') || _.get(bookingData, 'getBookingById.event.seminar.reader.id'),
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (_.get(bookingData, 'getBookingById.service.reader.id') || _.get(bookingData, 'getBookingById.event.seminar.reader.id')) {
      refetch();
    }
  }, [_.get(bookingData, 'getBookingById.service.reader.id'), _.get(bookingData, 'getBookingById.event.seminar.reader.id')]);

  if (reportListLoading || bookingLoading) {
    return <BackdropLoading />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height: '100%', pr: 2, p: 2 }}>
      <Typography variant="h6">Reader Information</Typography>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight={700}>Reader Details</Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Reader ID</Typography>
            <Typography variant="body2">{_.get(bookingData, 'getBookingById.service.reader.id', _.get(bookingData, 'getBookingById.event.seminar.reader.id')) }</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" >Reader Name</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">{_.get(bookingData, 'getBookingById.service.reader.nickname', _.get(bookingData, 'getBookingById.event.seminar.reader.nickname')) }</Typography>
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="material-symbols:info" color="success" width={20} height={20} />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" fontWeight={700}>Reader Reported List</Typography>
          </Box>
        </Grid>

        <Grid item container xs={12} rowSpacing={2} mt={1}>
          {_.get(reportListData, 'getReportGenericByIdAndType.listReport.length', 0) > 0 &&
            _.get(reportListData, 'getReportGenericByIdAndType.listReport', []).map((report, index) => (
              <Grid item xs={12} key={index} sx={{
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                boxShadow: 3,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" >Report ID</Typography>
                  <Typography variant="body2">{report?.id}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" >Report Content</Typography>
                  <Typography variant="body2">{report?.reason}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" >Report Status</Typography>
                  <Typography variant="body2">{report?.state}</Typography>
                </Box>

              </Grid>
            ))}
        </Grid>
      </Grid>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top"
        sx={{ width: 'fit-content', maxWidth: '20vw', p: 0 }}
      >
        <ReaderCard isStaff reader={_.get(bookingData, 'getBookingById.service.reader', _.get(bookingData, 'getBookingById.event.seminar.reader')) } />
      </CustomPopover>
    </Box>
  );
};

export default ReportReaderInformation;
