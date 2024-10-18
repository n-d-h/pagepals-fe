import { Avatar, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useResponsive } from '../../../components/hooks/use-responsive';
import Iconify from '../../../components/iconify';

const ReaderProfileCard = (props) => {
  const { reader, centered } = props;
  const { profile } = reader;
  const mdUp = useResponsive('up', 'md');

  return (
		<Box
			sx={{
			  height: '100%',
			  mx: mdUp ? centered ? 5 : 10 : 2,
			  display: 'flex',
			  flexDirection: 'column',
			  justifyContent: 'center',
			  alignItems: 'flex-start',
			  py: 5,
			  gap: 3,
			}}
		>
			<Box
				sx={{
				  display: 'flex',
				  flexDirection: mdUp ? 'row' : 'column',
				  justifyContent: 'space-between',
				  gap: mdUp ? 4 : 1,
				  width: '100%',
				  alignItems: centered ? 'center' : 'flex-start',
				}}
			>
				<Box
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: 'center',
					  gap: 2,
					  height: '100%',
					}}
				>

					<Avatar
						sx={{ width: 120, height: 120 }}
						src={_.get(profile, 'avatarUrl') ||
						_.get(reader, 'avatarUrl') ||
						'https://picsum.photos/200'}
					/>

					<Box sx={{ display: 'flex', flexDirection: 'row' }}>
						<Iconify
							icon="radix-icons:dot-filled"
							width={20}
							height={20}
							color={(_.get(profile, 'status') ||
								_.get(reader, 'status')) === 'ONLINE' && '#65B741'}
						/>
						<Typography variant="body1" fontWeight={200}>
							{_.get(profile, 'status') ||
							_.get(reader, 'status') === 'ONLINE'

							  ? 'Online'
							  : 'Offline'}
						</Typography>
					</Box>
				</Box>

				<Box
					sx={{
					  display: 'flex',
					  flexDirection: 'column',
					  alignItems: mdUp ? 'flex-start' : 'center',
					  justifyContent: 'center',
					  height: '100%',
					  gap: !mdUp && 1,
					}}
				>
					<Typography variant="h5" fontWeight={600}>
						{_.get(profile, 'nickname') ||
						_.get(reader, 'nickname')
						}
					</Typography>

					<Typography
						variant="body1"
						fontWeight={600}
						color={'GrayText'}
						gutterBottom
					>
						{_.get(profile, 'countryAccent') ||
							_.get(reader, 'countryAccent')
						}
					</Typography>

					<Typography variant="body2" fontWeight={200}>
						{_.get(profile, 'description') ||
						_.get(reader, 'description')
						}
					</Typography>
				</Box>

			</Box>

		</Box>
  );
};

export default ReaderProfileCard;

ReaderProfileCard.propTypes = {
  reader: PropTypes.object,
};

ReaderProfileCard.defaultProps = {
  reader: {},
};
