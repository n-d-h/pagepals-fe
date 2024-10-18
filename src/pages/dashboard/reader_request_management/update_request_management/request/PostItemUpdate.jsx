import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

import { useResponsive } from '../../../../../components/hooks/use-responsive';

import CustomPopover, { usePopover } from '../../../../../components/custom-popover';
import Iconify from '../../../../../components/iconify';
import CustomImage from '../../../../../components/image/CustomImage';
import Label from '../../../../../components/label';
import TextMaxLine from '../../../../../components/text-max-line';
import { Link } from 'react-router-dom';
import { paths } from '../../../../../components/router/paths';
import RouterLink from '../../../../../components/router/router-link';
import { countries } from '../../../../profile/personal/data';

// ----------------------------------------------------------------------

export default function PostItemUpdate ({ post }) {
  const popover = usePopover();

  // const router = useRouter();
  const avatar = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${Math.floor(Math.random() * 20) + 1}.jpg`;

  const smUp = useResponsive('up', 'sm');

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

  return (
        <>
            <Stack component={Card} direction="row">
                <Stack
                    sx={{
                      p: (theme) => theme.spacing(3, 3, 2, 3),
                      flexGrow: 1,
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Label variant="soft" color={'warning'}>
                            UPDATE REQUEST
                        </Label>

                        <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                            {countryAccent}
                        </Box>
                    </Stack>

                    <Stack spacing={1} flexGrow={1}>

                        <Link
                            color='inherit'
                            component={RouterLink}
                            to={paths.dashboard.updateRequestDetail(preference?.id)}
                        >
                            <TextMaxLine variant="subtitle2" line={1}>
                                {nickname}
                            </TextMaxLine>
                        </Link>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {languages.map((lang, index) => {
                              const languageObj = countries.find((country) => country.language.includes(lang));
                              return (
                                    <Chip key={index} label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Iconify
                                                key={languageObj?.value}
                                                icon={`circle-flags:${languageObj?.code?.toLowerCase()}`}
                                                width={18}
                                                sx={{ mr: 1 }}
                                            />
                                            <Typography variant="body1">
                                                {languageObj?.label}
                                            </Typography>
                                        </Box>
                                    } variant="soft" />
                              );
                            })}
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {genres.map((item, index) => (
                                <Chip key={index} size="small" label={item} variant='outlined' />
                            ))}
                        </Box>

                        <TextMaxLine variant="body2" sx={{ color: 'text.secondary', minWidth: '100%' }}>
                            {description}
                        </TextMaxLine>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-horizontal-fill" />
                        </IconButton>

                        <Stack
                            spacing={1.5}
                            flexGrow={1}
                            direction="row"
                            flexWrap="wrap"
                            justifyContent="flex-end"
                            sx={{
                              typography: 'caption',
                              color: 'text.disabled',
                            }}
                        >
                            <Stack direction="row" alignItems="center">
                                <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
                                {/* {answers.length}/3 */}
                            </Stack>

                            {/* <Stack direction="row" alignItems="center">
                                <Iconify icon="material-symbols:manage-accounts" width={16} sx={{ mr: 0.5 }} />
                                {staffName !== null ? staffName : 'Not assigned'}
                            </Stack> */}
                        </Stack>
                    </Stack>
                </Stack>

                {smUp && (
                    <Box
                        sx={{
                          width: 230,
                          height: 300,
                          position: 'relative',
                          flexShrink: 0,
                          p: 1,
                          alignSelf: 'center',
                        }}
                    >
                        <CustomImage alt={avatar} src={avatarUrl || avatar} sx={{ height: 1, borderRadius: 1.5 }} />
                    </Box>
                )}
            </Stack>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="bottom-center"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                      popover.onClose();
                      // router.push(paths.dashboard.post.details(title));
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                      popover.onClose();
                      // router.push(paths.dashboard.post.edit(title));
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                      popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>
        </>
  );
}

PostItemUpdate.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.object,
    coverUrl: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    totalComments: PropTypes.number,
    totalShares: PropTypes.number,
    totalViews: PropTypes.number,
  }),
};
