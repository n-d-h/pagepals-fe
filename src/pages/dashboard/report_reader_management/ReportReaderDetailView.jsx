import { useQuery } from '@apollo/client';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import { usePopover } from '../../../components/custom-popover';
import CustomPopover from '../../../components/custom-popover/custom-popover';
import Iconify from '../../../components/iconify';
import { getReportListByReader } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReaderCard from '../../main/home/reader_view/ReaderCard';

const ReportReaderDetailView = ({ report }) => {
  const { data: reportListData, loading: reportListLoading } = useQuery(getReportListByReader, {
    variables: {
      id: _.get(report, 'reportedId', ''),
    },
    fetchPolicy: 'no-cache',
  });

  const popover = usePopover();

  if (reportListLoading) {
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
                        <Typography variant="body2">{_.get(reportListData, 'getReportGenericByIdAndType.reader.id', 'No ID')}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" >Reader Name</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2">{_.get(reportListData, 'getReportGenericByIdAndType.reader.nickname', 'Anonymous')}</Typography>
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

                <Grid item container xs={12} rowSpacing={2} rowGap={1} mt={1}>
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
                arrow="center-top"
                sx={{ width: 'fit-content', maxWidth: '20vw', p: 0, maxHeight: '20vh' }}
            >
        <ReaderCard isStaff reader={_.get(reportListData, 'getReportGenericByIdAndType.reader', 'Anonymous')} />
            </CustomPopover>
        </Box>
  );
};

export default ReportReaderDetailView;
