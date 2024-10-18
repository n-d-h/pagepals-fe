import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    name: 'FaceBook',
    icon: 'eva:facebook-fill',
    color: '#1877F2',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: 'ant-design:instagram-filled',
    color: '#E02D69',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    icon: 'eva:linkedin-fill',
    color: '#007EBB',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    color: '#00AAEC',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

export default function ProfileHome ({ info }) {
  const renderAbout = (
		<Card>
			<CardHeader title="About" />

			<Stack spacing={2} sx={{ p: 3 }}>
				<Box sx={{ typography: 'body2' }}>{_.get(info, 'quote')}</Box>

				<Stack direction="row" spacing={2}>
					<Iconify icon="mingcute:location-fill" width={24} />

					<Box sx={{ typography: 'body2' }}>
						{'Live at '}
						<Link variant="subtitle2" color="inherit">
							{_.get(info, 'country') || 'Vietnam'}
						</Link>
					</Box>
				</Stack>

				<Stack direction="row" sx={{ typography: 'body2' }}>
					<Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
					{_.get(info, 'email') || 'haianh12122002@gmail.com'}
				</Stack>

				<Stack direction="row" spacing={2}>
					<Iconify icon="ic:round-business-center" width={24} />

					<Box sx={{ typography: 'body2' }}>
						{_.get(info, 'role1') || 'Book Enthusiast'} {'at '}
						<Link variant="subtitle2" color="inherit">
							{_.get(info, 'company') || 'PagePals'}
						</Link>
					</Box>
				</Stack>

				<Stack direction="row" spacing={2}>
					<Iconify icon="ic:round-business-center" width={24} />

					<Box sx={{ typography: 'body2' }}>
						{'Studied at '}
						<Link variant="subtitle2" color="inherit">
							{_.get(info, 'school') || 'FPT University'}
						</Link>
					</Box>
				</Stack>
			</Stack>
		</Card>
  );

  const renderSocials = (
		<Card>
			<CardHeader title="Social" />

			<Stack spacing={2} sx={{ p: 3 }}>
				{_socials.map((link) => (
					<Stack
						key={link.name}
						spacing={2}
						direction="row"
						sx={{ wordBreak: 'break-all', typography: 'body2' }}
					>
						<Iconify
							icon={link.icon}
							width={24}
							sx={{
							  flexShrink: 0,
							  color: link.color,
							}}
						/>
						<Link
							color="inherit"
							href={link.path}
							target="_blank"
							sx={{
							  '&:hover': {
							    textDecoration: 'underline',
							    cursor: 'pointer',
							  },
							}}
						>
							{link.path}
						</Link>
					</Stack>
				))}
			</Stack>
		</Card>
  );

  return (
		<Grid container spacing={3}>
			<Grid xs={12} md={4}>
				<Stack spacing={3}>
					{/* {renderFollows} */}

					{renderAbout}

					{renderSocials}
				</Stack>
			</Grid>
		</Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
};
