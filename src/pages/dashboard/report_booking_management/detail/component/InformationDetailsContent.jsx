/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from '../../../../../components/iconify';
import CustomImage from '../../../../../components/image/CustomImage';
import ReactPlayer from 'react-player';
import { countries, uniqueLanguages } from '../../../../profile/personal/data';
import { Box, Grid, List, ListItem, ListItemIcon } from '@mui/material';

// ----------------------------------------------------------------------

export default function InformationDetailsContent ({ post, isCustomer }) {
  const {
    reader,
  } = post;

  const listGenre = reader?.genre.split(',');
  const listLanguage = reader?.language.split(',').map(lang => lang.trim());

  const countriesObj = countries.find((country) => country.label === reader?.countryAccent);

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', mr: 2 }}>
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
              icon={`circle-flags:${countriesObj.code.toLowerCase()}`}
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
          {listGenre.map((genre) => (
            <Chip key={genre} label={genre} variant="soft" />
          ))}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Languages</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {listLanguage.map((listLanguage) => {
            const languageObj = uniqueLanguages.find((country) => country === listLanguage);
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

  const renderAccount = (
    <Stack component={Card} spacing={2} sx={{ p: 3, mb: 5, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h6">Account Information</Typography>
      <List>
        {[
          {
            label: 'Account ID',
            value: _.get(reader, 'account.id', 'null'),
            icon: <Iconify icon="solar:user-id-bold" width={24} />,
          },
          {
            label: 'Username',
            value: _.get(reader, 'account.username', 'null'),
            icon: <Iconify icon="solar:user-bold" width={24} />,
          },
          {
            label: 'Phone Number',
            value: _.get(reader, 'account.phoneNumber', 'null'),
            icon: <Iconify icon="solar:phone-calling-bold" width={24} />,
          },
          {
            label: 'Email',
            value: _.get(reader, 'account.email', 'null'),
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
    <Stack component={Card} spacing={2} sx={{ p: 3, height: 600, mt: 5, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', mr: 2 }}>
      <Typography variant="h6">Reader Introduction Video</Typography>
      <ReactPlayer url={reader.introductionVideoUrl} width="100%" height="100%" controls />
    </Stack>
  );

  const renderAvt = (
    <Stack component={Card} spacing={2} sx={{ p: 3, boxShadow: isCustomer && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
      <Typography variant="h6">Reader Avatar</Typography>
      <CustomImage alt={reader?.nickname} src={reader?.avatarUrl} sx={{ height: 1, borderRadius: 1.5 }} />
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}

        {renderVideo}
      </Grid>

      <Grid xs={12} md={4}>
        {renderAccount}
        {renderAvt}
      </Grid>
    </Grid>
  );
}

InformationDetailsContent.propTypes = {
  post: PropTypes.object,
};
