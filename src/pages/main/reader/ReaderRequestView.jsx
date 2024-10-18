import { useQuery } from '@apollo/client';
import { Box, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import Iconify from '../../../components/iconify';
import UploadAvatar from '../../../components/shadcn-ui/upload/upload-avatar';
import { selectUser } from '../../../redux/slices/authSlice';
import { getReaderUpdateRequestQueries } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import { countries, uniqueLanguages } from '../../profile/personal/data';

const ReaderRequestView = () => {
  const userProfile = useSelector(selectUser);

  const { data, loading } = useQuery(getReaderUpdateRequestQueries, {
    variables: {
      id: _.get(userProfile, 'reader.id'),
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'Cannot fetch your request detail');
    },
  });

  const reader = _.get(data, 'getUpdateRequestByReaderId');

  const countriesObj = countries.find((country) => country.label === reader?.countryAccent);

  if (!data || _.isEmpty(data.getUpdateRequestByReaderId)) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>

            <NothingTooSeePage />
        </Box>;
  }

  const renderContent = (
        <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Typography variant="h4">Reader Register Information</Typography>
            <Stack direction="row" alignItems="center" spacing={40}>
                <Stack>
                    <Typography variant="h6" gutterBottom>Nick Name</Typography>
                    <Typography variant="body1">{reader?.nickname}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="h6" gutterBottom>Country Accent</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                            key={countriesObj?.value}
                            icon={`circle-flags:${countriesObj?.code.toLowerCase()}`}
                            width={18}
                            sx={{ mr: 1 }}
                        />
                        <Typography variant="body1">
                            {countriesObj?.label}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
            <Typography variant="h6">Desciption</Typography>
            <Typography variant="body1">{reader?.description || ''}</Typography>

            <Stack spacing={2}>
                <Typography variant="h6">Genres</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {reader.genres.map((genre) => (
                        <Chip key={genre} label={genre} variant="soft" />
                    ))}
                </Stack>
            </Stack>

            <Stack spacing={2}>
                <Typography variant="h6">Languages</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {reader.languages.map((listLanguage) => {
                      const languageObj = uniqueLanguages.find((language) => language === listLanguage.trim(' '));

                      return (
                            <Chip key={listLanguage} label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body1">
                                        {languageObj}
                                    </Typography>
                                </Box>
                            } variant="soft" />
                      );
                    })}
                </Stack>
            </Stack>
        </Stack>
  );

  const renderVideo = (
        <Box sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', width: 'fit-content', borderRadius: 4 }}>
            <Typography variant="h6">Requested Introduction Video</Typography>
            <ReactPlayer url={reader.introductionVideoUrl} width={'100%'} height={'100%'} controls />
        </Box>
  );

  const renderAvt = (
        <Box sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: 4, bgcolor: 'white' }}>
            <Typography variant="h6">Requested Avatar</Typography>
            {/* <CustomImage alt={reader?.nickname} src={reader?.avatarUrl} sx={{ height: 1, borderRadius: 1.5 }} /> */}
            <UploadAvatar file={reader.avatarUrl} disabled />
        </Box>
  );

  if (loading) {
    return <BackdropLoading />;
  }

  return (
        <Box sx={{ width: '100%', display: 'flex', px: 20 }}>

            <Grid container spacing={3} alignItems={'center'} height={'fit-content'}>

                <Grid xs={12} lg={8} item >
                    {renderContent}
                </Grid>

                <Grid xs={12} lg={4} item container rowSpacing={2} justifyContent={'center'}>
                    <Grid item>
                        {renderAvt}
                    </Grid>
                    <Grid item>
                        {renderVideo}
                    </Grid>

                </Grid>

            </Grid>
        </Box>
  );
};

export default ReaderRequestView;
