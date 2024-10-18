import { useQuery } from '@apollo/client';
import { Avatar, Box, Grid, ListItemText, MenuItem, Pagination, Paper, Select, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Image from '../../../components/shadcn-ui/image';
import { getSeminarListByStaff } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const SeminarStatus = {
  PENDING: {
    label: 'Pending',
    color: 'warning',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'success',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'error',
  },
};

const SeminarManagementList = () => {
  const [page, setPage] = useState(0);
  const [state, setState] = useState('PENDING');

  const navigate = useNavigate();

  const { data, loading, error } = useQuery(getSeminarListByStaff
    , {
      fetchPolicy: 'no-cache',
      variables: {
        page,
        state,
      },
      onError: (e) => {
        handleFriendlyError(e, 'Failed to load data');
      },
    });

  if (loading) return <BackdropLoading />;

  if (error) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>

            <NothingTooSeePage />
        </Box>;
  }

  return (
            <Box sx={{
              width: '100%',
              mt: 5,
              ml: 2,
              flexDirection: 'column',
              gap: 3,
            }}
                className="flex"
            >

                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Seminar Management</Typography>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <Select value={state} onChange={(e) => setState(e.target.value)}>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="ACCEPTED">Accepted</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>

                </Box>

                <Grid container spacing={2}>
                    {_.get(data, 'getAllSeminarRequestsByState.list', []).map((seminar, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Paper
                                onClick={() => navigate(`${_.get(seminar, 'id')}/detail`)}
                                sx={{
                                  mr: 3,
                                  borderRadius: 2,
                                  position: 'relative',
                                  transition: 'transform 0.2s',
                                  ':hover': {
                                    cursor: 'pointer',
                                    transform: 'translateY(-5px)',
                                  },
                                }}
                            >
                                <Stack
                                    spacing={2}
                                    sx={{
                                      px: 2,
                                      pb: 1,
                                      pt: 2.5,
                                    }}
                                >

                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar alt={_.get(seminar, 'reader.nickname')} src={_.get(seminar, 'reader.avatarUrl')} />
                                        <ListItemText
                                            primary={`${_.get(seminar, 'title')} by ${_.get(seminar, 'reader.nickname')}`}
                                            secondary={<Label variant="filled" color={
                                                SeminarStatus[_.get(
                                                  seminar,
                                                  'state',
                                                )].color
                                            }>{SeminarStatus[_.get(
                                              seminar,
                                              'state',
                                            )].label}</Label>}
                                            secondaryTypographyProps={{ variant: 'caption', mt: 0.5 }}
                                        />
                                    </Stack>

                                    <Stack
                                        rowGap={1.5}
                                        columnGap={3}
                                        flexWrap="wrap"
                                        direction="row"
                                        alignItems="center"
                                        sx={{ color: 'text.secondary', typography: 'caption' }}
                                    >
                                        <Stack direction="row" alignItems="center">
                                            <Iconify width={16} icon="game-icons:duration" sx={{ mr: 0.5, flexShrink: 0 }} />
                                            {_.get(seminar, 'duration')} minutes
                                        </Stack>

                                        {_.get(seminar, 'rejectReason') && (
                                            <Typography color={'error'} variant='caption'>
                                                {_.get(seminar, 'rejectReason')}
                                            </Typography>
                                        )}

                                    </Stack>
                                </Stack>

                                <Box sx={{ p: 1, position: 'relative' }}>
                                    <Image alt={_.get(seminar, 'title')} src={_.get(seminar, 'imageUrl')} ratio="16/9" sx={{ borderRadius: 1.5 }} />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                            <Pagination count={_.get(data, 'getAllEventsNotJoinByCustomer.pagination.totalOfPages')}
                                page={page + 1}
                                onChange={(e, value) => setPage(value - 1)}
                            />
                        </Box>
                    </Grid>

                </Grid>
            </Box>
  );
};

export default SeminarManagementList;
