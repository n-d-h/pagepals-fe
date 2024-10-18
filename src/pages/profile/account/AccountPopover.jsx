import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useRouter } from '../../../components/hooks/use-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  logoutFirebaseThunk,
  selectUser,
} from '../../../redux/slices/authSlice';
import usePopover from '../../../components/custom-popover/use-popover';
import { varHover } from '../../../components/animate/variants';
import CustomPopover from '../../../components/custom-popover/custom-popover';
import { paths } from '../../../components/router/paths';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/main',
    onlyFor: ['CUSTOMER', 'READER', 'READER_PENDING'],
  },
  {
    label: 'Profile',
    linkTo: paths.main.profile,
    onlyFor: ['CUSTOMER', 'READER', 'READER_PENDING'],
  },
  {
    label: 'Reader',
    linkTo: paths.main.reader,
    onlyFor: ['READER'],
  },
  {
    label: 'Become a Reader!',
    linkTo: paths.main.becomeReader,
    onlyFor: ['CUSTOMER'],
    specialState: 'ACTIVE',
  },
  {
    label: 'Reader Application',
    linkTo: paths.main.becomeReader,
    onlyFor: ['CUSTOMER'],
    specialState: 'READER_PENDING',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover () {
  const router = useRouter();

  const user = useSelector(selectUser);

  const userRole = _.get(user, 'role.name', 'isNotReader');

  const dispatch = useDispatch();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await dispatch(logoutFirebaseThunk());
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  return (
		<>

			<IconButton
				component={m.button}
				whileTap="tap"
				whileHover="hover"
				variants={varHover(1.05)}
				onClick={popover.onOpen}
				sx={{
				  width: 50,
				  height: 50,
				  background: (theme) => alpha(theme.palette.grey[500], 0.08),
				  ...(popover.open && {
				    background: (theme) =>
							`linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
				  }),
				}}
			>
				<Avatar
					src={_.get(user, 'customer.imageUrl')}
					alt={user?.username}
					sx={{
					  width: 48,
					  height: 48,
					  border: (theme) => `solid 2px ${theme.palette.background.default}`,
					}}
				>
					{user?.username?.charAt(0).toUpperCase()}
				</Avatar>
			</IconButton>

			<CustomPopover
				open={popover.open}
				onClose={popover.onClose}
				sx={{ width: 200, p: 0 }}
			>
				<Box sx={{ p: 2, pb: 1.5 }}>
					<Typography variant="subtitle2" noWrap>
						{user?.username}
					</Typography>

					<Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
						{user?.email}
					</Typography>
				</Box>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Stack sx={{ p: 1 }}>
					{OPTIONS.map((option) => {
					  if (option.onlyFor && !_.get(option, 'onlyFor').includes(userRole)) {
					    return null;
					  }

					  if (option.specialState && option.specialState !== user?.accountState?.name) {
					    return null;
					  }

					 return (
						<MenuItem
							key={option.label}
							onClick={() => handleClickItem(option.linkTo)}
						>
							{option.label}
						</MenuItem>
					  );
					})}
				</Stack>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<MenuItem
					onClick={handleLogout}
					sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
				>
					Logout
				</MenuItem>
			</CustomPopover>
		</>
  );
}
