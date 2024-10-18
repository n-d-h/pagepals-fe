/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useMutation } from '@apollo/client';
import { Box, Grid, List, ListItem, ListItemIcon } from '@mui/material';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import { handleFriendlyError, showNotification } from '../../../../../components/common_services/CommonServices';
import Iconify from '../../../../../components/iconify';
import CustomImage from '../../../../../components/image/CustomImage';
import { paths } from '../../../../../components/router/paths';
// import { acceptUpdateRequestedReader, rejectUpdateRequestedReader } from '../../../../../services/apolo/mutations';
import BackdropLoading from '../../../../backdrop_loading/BackdropLoading';
import { countries, uniqueLanguages } from '../../../../profile/personal/data';
import UpdateRequestToolBar from '../request/UpdateRequestToolBar';

// ----------------------------------------------------------------------

export default function UpdateInformation ({ post }) {
  const {
    id,
    audioDescriptionUrl,
    avatarUrl,
    countryAccent,
    description,
    genres,
    introductionVideoUrl,
    languages,
    nickname,
    preference,
  } = post;
  const [updateDescription, setUpdateDescription] = useState('');

  const listGenres = preference?.genre.split(',').map(genre => genre.trim());
  const listLanguages = preference?.language.split(',').map(lang => lang.trim());

  const countriesObj = countries.find((country) => country.label.includes(countryAccent || 'Vietnam'));

  const renderContent = (
        <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Typography variant="h4">Reader Update Information</Typography>
            <Stack direction="row" alignItems="center" spacing={40}>
                <Stack>
                    <Typography variant="h6" gutterBottom>Nick Name</Typography>
                    <Typography variant="body1">{nickname || 'N/A'}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="h6" gutterBottom>Country Accent</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                            key={countriesObj?.value}
                            icon={`circle-flags:${countriesObj?.code?.toLowerCase()}`}
                            width={18}
                            sx={{ mr: 1 }}
                        />
                        <Typography variant="body1">
                            {countriesObj?.label || countryAccent}
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
            <Typography variant="h6">Desciption</Typography>
            <Typography variant="body1">{description || ''}</Typography>

            <Stack spacing={2}>
                <Typography variant="h6">Genres</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {genres.map((genre) => (
                        <Chip key={genre} label={genre} variant="soft" />
                    ))}
                </Stack>
            </Stack>

            <Stack spacing={2}>
                <Typography variant="h6">Languages</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {languages.map((language) => {
                      const languageObj = uniqueLanguages.find((country) => country.includes(language));
                      return (
                            <Chip key={language} label={
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

  const renderAccount = (
        <Stack component={Card} spacing={2} sx={{ p: 3, mb: 5, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Typography variant="h6">Account Information</Typography>
            <List>
                {[
                  {
                    label: 'Account ID',
                    value: _.get(preference, 'account.id', 'N/A'),
                    icon: <Iconify icon="solar:user-id-bold" width={24} />,
                  },
                  {
                    label: 'Username',
                    value: _.get(preference, 'account.username', 'N/A'),
                    icon: <Iconify icon="solar:user-bold" width={24} />,
                  },
                  {
                    label: 'Phone Number',
                    value: _.get(preference, 'account.phoneNumber', 'N/A'),
                    icon: <Iconify icon="solar:phone-calling-bold" width={24} />,
                  },
                  {
                    label: 'Email',
                    value: _.get(preference, 'account.email', 'N/A'),
                    icon: <Iconify icon="material-symbols:mail" width={24} />,
                  },
                ].map((item) => (
                    <ListItem key={item.label} spacing={1.5} direction="row">
                        <ListItemIcon>{item.icon}</ListItemIcon>
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
                    </ListItem>
                ))}
            </List>
        </Stack>
  );

  const renderVideo = (
        <Stack component={Card} spacing={2} sx={{ p: 3, height: 600, mt: 5, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Typography variant="h6">Reader Introduction Video</Typography>
            <ReactPlayer url={introductionVideoUrl} width="100%" height="100%" controls />
        </Stack>
  );

  const renderAvt = (
        <Stack component={Card} spacing={2} sx={{ p: 3, boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
            <Typography variant="h6">Reader Avatar</Typography>
            <CustomImage alt={nickname} src={avatarUrl} sx={{ height: 1, borderRadius: 1.5 }} />
        </Stack>
  );

  const navigate = useNavigate();

  // const [rejectRequest, { loading: rejectLoading }] = useMutation(rejectUpdateRequestedReader, {
  //   onError: (e) => {
  //     handleFriendlyError(e, 'Update failed');
  //   },
  //   onCompleted: () => {
  //     showNotification('success', 'Reject successfully');
  //     navigate(paths.dashboard.updateRequestManagement);
  //   },
  // });

  // const [acceptRequest, { loading: acceptLoading }] = useMutation(acceptUpdateRequestedReader, {
  //   onError: (e) => {
  //     handleFriendlyError(e, 'Update failed');
  //   },
  //   onCompleted: () => {
  //     showNotification('success', 'Accept successfully');
  //     navigate(paths.dashboard.updateRequestManagement);
  //   },
  // });

  // const handleRejectConfirmation = async () => {
  //   await rejectRequest({
  //     variables: {
  //       id,
  //     },
  //   });
  // };

  // const handleAcceptConfirmation = async () => {
  //   await acceptRequest({
  //     variables: {
  //       id,
  //     },
  //   });
  // };

  // if (rejectLoading || acceptLoading) return <BackdropLoading />;
  return (
        <Container maxWidth="xl">
            <UpdateRequestToolBar
                description={updateDescription}
                setDescription={setUpdateDescription}
                // onReject={handleRejectConfirmation}
                // onAcceptRequest={handleAcceptConfirmation}
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {renderContent}

                    {renderVideo}
                </Grid>

                <Grid item xs={12} md={4}>
                    {renderAccount}
                    {renderAvt}
                </Grid>
            </Grid>
        </Container>
  );
}

UpdateInformation.propTypes = {
  post: PropTypes.object,
};
