import {
  Avatar,
  Box,
  Button,
  Rating,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useResponsive } from '../../../components/hooks/use-responsive';
import { paths } from '../../../components/router/paths';
import RouterLink from '../../../components/router/router-link';

const ReaderMiniProfileCard = (props) => {
  const mdUp = useResponsive('up', 'md');
  const { reader, isGuest } = props;

  return (
		<Box
			sx={{
			  height: '100%',
			  display: 'flex',
			  flexDirection: 'column',
			  alignItems: 'flex-start',
			  p: 2,
			  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
			  borderRadius: 3,

			}}
		>
			<Box
				sx={{
				  display: 'flex',
				  justifyContent: 'space-between',
				  width: '100%',
				}}
			>
				<Box
					sx={{
					  display: 'flex',
					  flexDirection: mdUp ? 'row' : 'column',
					  gap: 3,
					  width: '100%',
					}}
				>
					<Box
						sx={{
						  display: 'flex',
						  flexDirection: 'column',
						  alignItems: 'center',
						  gap: 2,
						  height: '100%',
						  position: 'relative',
						}}
					>
						<Avatar
							sx={{ width: 75, height: 75 }}
							src={_.get(reader, 'imageUrl')}
						/>
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
						<Typography variant="h6" fontWeight={600}>
							{_.get(reader, 'serviceType.name', 'No Name')}
						</Typography>

						<Typography
							variant="body1"
							fontWeight={200}
							color={'GrayText'}
							gutterBottom
						>
							{_.get(reader, 'price')} pals
						</Typography>

						<Rating
							value={_.get(reader, 'reader.rating')}
							size="small"
							precision={0.5}
							readOnly
						/>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
					<Link
						component={RouterLink}
						to={
							isGuest
							  ? paths.guest.service(_.get(reader, 'id'))
							  : paths.main.service(_.get(reader, 'id'))}
						underline="none"
					>
						<Button variant="contained" color="primary" fullWidth>
							View
						</Button>
					</Link>
				</Box>
			</Box>
		</Box>
  );
};

ReaderMiniProfileCard.propTypes = {};

export default ReaderMiniProfileCard;
