import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';
// import { RouterLink } from 'src/routes/components';

import { useResponsive } from '../../../../components/hooks/use-responsive';

import { fDate } from '../../../../utils/format-time';
import { fShortenNumber } from '../../../../utils/format-number';

import Label from '../../../../components/label';
import CustomImage from '../../../../components/image/CustomImage';
import Iconify from '../../../../components/iconify';
import TextMaxLine from '../../../../components/text-max-line';
import CustomPopover, { usePopover } from '../../../../components/custom-popover';
import { paths } from '../../../../components/router/paths';
import RouterLink from '../../../../components/router/router-link';

// ----------------------------------------------------------------------

export default function PostItemHorizontal ({ post, user }) {
  const popover = usePopover();

  // const router = useRouter();
  const avatarUrl = `https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_${Math.floor(Math.random() * 20) + 1}.jpg`;

  const smUp = useResponsive('up', 'sm');

  const {
    answers,
    createdAt,
    description,
    id,
    interviewAt,
    meetingCode,
    reader,
    staffId,
    staffName,
    state,
    updatedAt,
  } = post;

  const foundAnswer = answers.find(answer => answer.question.id === 'bea58d47-122f-4013-a711-c0599eedd590');

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
            <Label variant="soft" color={(state === 'ANSWER_CHECKING' && 'info') || 'default'}>
              {state}
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(createdAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>

            {staffId === null || staffId === user?.id
              ? (
                <Link
                  color="inherit"
                  component={RouterLink}
                  href={paths.dashboard.readerRequestDetail(id)}
                >
                  <TextMaxLine variant="subtitle2" line={2}>
                    {reader.nickname}
                  </TextMaxLine>
                </Link>
                )
              : (
                <TextMaxLine variant="subtitle2" line={1}>
                  {reader.nickname}
                </TextMaxLine>
                )
            }

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary', minWidth: '100%' }}>
              {foundAnswer?.content}
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
                {answers.length}/3
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="material-symbols:manage-accounts" width={16} sx={{ mr: 0.5 }} />
                {staffName !== null ? staffName : 'Not assigned'}
              </Stack>

              {/* <Stack direction="row" alignItems="center">
                <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalShares)}
              </Stack> */}
            </Stack>
          </Stack>
        </Stack>

        {smUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            {/* <Avatar
              alt={reader?.nickname}
              src={author.avatarUrl}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}
            /> */}
            <CustomImage alt={avatarUrl} src={_.get(reader, 'avatarUrl', 'avatarUrl')} sx={{ height: 1, borderRadius: 1.5 }} />
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

PostItemHorizontal.propTypes = {
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
