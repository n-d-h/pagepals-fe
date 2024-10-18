import { Box, Chip, Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
// import Markdown from '../../../components/markdown/MarkDown';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { useParams } from 'react-router';
import StickyBox from 'react-sticky-box';
import rehypeRaw from 'rehype-raw';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import Markdown from '../../../components/markdown/MarkDown';
import { getReaderProfileDetail, getServiceByID } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReaderCalendar from '../../profile/reader/ReaderCalendar';
import { TimeSlots } from '../../profile/reader/TimeSlot';
import ReviewCarousel from './ReviewCarousel';
import ServiceInfo from './ServiceInfo';

const ReaderService = () => {
  const { id } = useParams();

  const { data, loading } = useQuery(getServiceByID, {
    variables: {
      id,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Error while getting service');
    },
  });

  const [readerInfo, setReaderInfo] = useState({});
  const { data: timeData, refetch } = useQuery(getReaderProfileDetail, {
    variables: {
      id: _.get(data, 'serviceById.reader.id'),
    },
    onError: (e) => {
      if (_.get(
        data,
        'serviceById.reader.id',
      )) { handleFriendlyError(e, 'Error while getting reader profile'); }
    },
    fetchPolicy: 'no-cache',
  });

  const { getReaderProfile } = timeData || {};

  const readerProfile = () => {
    if (!getReaderProfile) return {};

    const { profile, workingTimeList } = getReaderProfile;

    return {
      profile: {
        ...profile,
        nickname: _.get(profile, 'nickname', 'Anonymous'),
      },
      workingTime: _.get(workingTimeList, 'workingDates', {}),
    };
  };

  const [currentChosenDate, setCurrentChosenDate] = useState(new Date());
  const [chosenTimeFrame, setChosenTimeFrame] = useState([]);

  const handleChangeDate = (date) => {
    setCurrentChosenDate(date);
    const timeFrame = _.get(readerInfo, 'workingTime', []).find(
      (item) => moment(item?.date).isSame(date, 'day'));
    const timeSlot = _.get(timeFrame, 'timeSlots', []);
    setChosenTimeFrame(timeSlot);
  };

  useEffect(() => {
    const readerProfileInfo = readerProfile();

    setReaderInfo(readerProfileInfo);
  }, [timeData]);

  useEffect(() => {
    if (_.get(readerInfo, 'workingTime.length') > 0) {
      handleChangeDate(currentChosenDate);
    }
  }, [readerInfo]);

  if (loading) return <BackdropLoading />;

  return (
    <Box sx={{
      height: '100%',

      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      p: 4,
      mx: 20,

      position: 'relative',
    }}>
      <Box sx={{
        width: '60%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',

        gap: 5,
      }}>

        <ServiceInfo data={data} />

        <ReviewCarousel data={data} />

        <Grid container sx={{
          bgcolor: 'white',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          px: 4,
          py: 4,
          borderRadius: 2,
          gap: 3,
        }}>
          <Grid item xs={12} lg={3}>
            <Box
              sx={{
                height: 270,
                width: '100%',
                alignSelf: 'start',
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              }}
              component={'img'}
              alt="book cover"
              src={
                _.get(data, 'serviceById.book.thumbnailUrl')
              } ></Box>

          </Grid>
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              {_.get(
                data,
                'serviceById.book.title',
              )}
            </Typography>
            <Typography variant="h6" fontWeight={800} color={'GrayText'}>
              {_.get(data, 'serviceById.book.authors[0].name')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              <Typography variant="body1" fontWeight={400} color={'GrayText'}>
                Category:{' '}

                <Chip
                  key={_.get(data, 'serviceById.book.categories[0].id')}
                  variant="outlined"
                  size="small"
                  label={_.get(data, 'serviceById.book.categories[0].name', 'Unknown')}
                  sx={{ mr: 1 }}
                />

              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              <Typography variant="body2" gutterBottom color={'GrayText'}>
                Publisher: {_.get(data, 'serviceById.book.publisher')} {' '} ({_.get(data, 'serviceById.book.publishedDate')})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
              <Typography variant="body2" gutterBottom color={'GrayText'}>
                Language: {_.get(data, 'serviceById.book.language')}
              </Typography>
            </Box>
            <Typography variant="caption" gutterBottom fontWeight={400}>
              {_.get(data, 'serviceById.book.description')}
            </Typography>
          </Grid>
          <Grid item flexGrow={1} />

        </Grid>

        {/* <Divider sx={{ width: '100%', my: 2 }} /> */}

        <Box container sx={{
          width: '100%',
          borderRadius: 2,
          bgcolor: 'white',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          px: 4,
          py: 2,
        }}>
          <Typography variant="h4" fontWeight={800} gutterBottom textAlign={'center'}>
            About this service
          </Typography>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Markdown
            rehypePlugins={[rehypeRaw]}
          >
            {_.get(
              data,
              'serviceById.description',
            )
            }
          </Markdown>
        </Box>

      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: _.get(readerInfo, 'workingTime.length') > 0 ? '3%' : '5%',
          bottom: 0,
          right: '-5%',
          width: '40%',
        }}
      >
        <StickyBox offsetTop={100}>
          <Box
            sx={{
              bgcolor: 'white',
              height: '100%',
              borderRadius: 2,
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              mb: 4,
              px: 4,
              py: 2,
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight={800} textAlign={'center'}>
              Service Information
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" fontWeight={400} sx={{ color: 'GrayText' }}>
                Price
              </Typography>

              <Chip variant="outlined" color='primary' sx={{ fontWeight: 700 }} size='standard' label={`${_.get(data, 'serviceById.price', 0)} pals`} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight={400} sx={{ color: 'GrayText' }}>
                Duration
              </Typography>

              <Chip variant="outlined" color='info' sx={{ fontWeight: 700 }} size='standard' label={`${_.get(data, 'serviceById.duration', 0)} minutes`} />

            </Box>

          </Box>

          <Box
            sx={{
              bgcolor: 'white',
              height: '100%',
              borderRadius: 2,
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              mb: _.get(readerInfo, 'workingTime.length') > 0 ? 0 : 4,
              px: 4,
              py: 2,
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight={800} textAlign={'center'}>
              Service Short Description
            </Typography>

            <Divider sx={{ width: '100%', my: 2 }} />

            <Typography variant="body1" fontWeight={500} sx={{ color: '#607d8b' }}>
              {_.get(data, 'serviceById.shortDescription', 'No short description for this service')}
            </Typography>
          </Box>

          {_.get(readerInfo, 'workingTime.length') > 0
            ? (
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  minHeight: '40vh',
                }}
              >
                <Grid container width={'100%'} mt={4} rowGap={4}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        bgcolor: 'white',
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                      }}
                    >

                      <Typography variant="h5" fontWeight={800} textAlign={'center'} py={2}>
                        Choose a date to start booking
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ReaderCalendar
                          currentDate={currentChosenDate}
                          handleChangeDate={handleChangeDate}
                          workDays={_.get(readerInfo, 'workingTime', [])?.map((item) => moment(item?.date))}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        height: '100%',
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                      }}
                    >
                      <TimeSlots
                        isGuest={true}
                        chosenTimeFrame={chosenTimeFrame}
                        date={currentChosenDate}
                        readerId={_.get(getReaderProfile, 'profile.id')}
                        refetch={refetch}
                        service={_.get(data, 'serviceById')}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )
            : (
              <Box sx={{
                width: '100%',
                height: '40vh',
                bgcolor: 'grey.200',
                display: 'flex',
                borderRadius: 2,
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              }}>
                <Typography variant="h6" mt={2} color={'GrayText'} fontWeight={200}>No working time found</Typography>
              </Box>
            )}
        </StickyBox>
      </Box>

    </Box>
  );
};

export default ReaderService;
