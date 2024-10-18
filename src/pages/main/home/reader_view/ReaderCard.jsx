/* eslint-disable no-unused-vars */
import { useTheme } from '@emotion/react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Link,
  ListItemText,
  Rating,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import PropTypes from 'prop-types';
import { countries } from '../../../../assets/data/countries';
import Iconify from '../../../../components/iconify';
import { paths } from '../../../../components/router/paths';
import RouterLink from '../../../../components/router/router-link';
import Image from '../../../../components/shadcn-ui/image';
import AvatarShape from './avatar-shape';
import Video from '../../../../components/shadcn-ui/video/Video';
import { useState } from 'react';
import { useResponsive } from '../../../../components/hooks/use-responsive';

const LanguageFlag = ({ languageFlag }) => {
  const language = countries.find((country) => country?.label === languageFlag);

  return (
		<Box
			sx={{
			  display: 'flex',
			  alignItems: 'center',
			  justifyContent: 'center',
			}}
		>
			{!language
			  ? (
					<Typography variant="body2" fontWeight={200}>
						{languageFlag}
					</Typography>
			    )
			  : (
					<>
						<Iconify
							key={language.code}
							icon={`circle-flags:${language?.code?.toLowerCase()}`}
							width={16}
							sx={{ mr: 1 }}
						/>
						<Typography variant="body2" fontWeight={200}>
							{languageFlag}
						</Typography>
					</>
			    )}
		</Box>
  );
};

const ReaderCard = (props) => {
  const { reader, isGuest } = props;

  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const isLargeScreen = window.innerWidth > 2000;

  const readerMainGenre = _.get(reader, 'genre', '')?.split(',')[0];
  const readerMainLanguage = _.get(reader, 'language', '')?.split(',')[0];

  const [onHover, setOnHover] = useState(false);

  return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onMouseEnter={() => {
		  setOnHover(true);
		}} onMouseLeave={() => {
		  setOnHover(false);
		}}>
			<Card

				sx={{
				  textAlign: 'center',
				  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				  transition: 'transform 0.2s ease-in-out, box-shadow 0.15s ease-in-out',
				  minHeight: 500,
				  maxHeight: '60vh',

				  width: '20vw',
				  ':hover': {
				    boxShadow: !props.isStaff && 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				    transform: !props.isStaff && 'translateY(-4px)',
				  },
				}}
			>
				<Box sx={{ position: 'relative' }}>
					<AvatarShape
						sx={{
						  left: 0,
						  right: 0,
						  zIndex: 10,
						  mx: 'auto',
						  bottom: -26,
						  position: 'absolute',
						}}
					/>

					<Avatar
						alt={reader.nickname}
						src={reader.avatarUrl || 'https://via.placeholder.com/300'}
						sx={{
						  width: 64,
						  height: 64,
						  zIndex: 11,
						  left: 0,
						  right: 0,
						  bottom: -32,
						  mx: 'auto',
						  position: 'absolute',
						}}
					/>
					<Image
						src={reader.thumbnailUrl}
						alt={reader.nickname}
						overlay={alpha(theme.palette.grey[900], 0.48)}
						isHover={onHover}
						ratio="16/9"
						minHeight={isLargeScreen ? 300 : 200}
						maxHeight={isLargeScreen ? '20vh' : 200}
						width="100%"
					/>
				</Box>

				<ListItemText
					sx={{ mt: 7, mb: 1 }}
					primary={reader.nickname}
					secondary={<LanguageFlag languageFlag={reader.countryAccent} />}
					primaryTypographyProps={{ typography: 'subtitle1' }}
					secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
				/>

				<Stack
					direction="row"
					alignItems="center"
					justifyContent="center"
					sx={{ mb: 2.5 }}
				>
					<Rating value={reader.rating} precision={0.1} readOnly />
				</Stack>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Box
					display="grid"
					gridTemplateColumns="repeat(2, 1fr)"
					sx={{ py: 3, typography: 'subtitle1' }}
				>
					<div>
						<Typography
							variant="caption"
							component="div"
							sx={{ mb: 0.5, color: 'text.secondary' }}
						>
							Genre
						</Typography>

						<Chip label={readerMainGenre} size="small" color="default" />
					</div>

					<div>
						<Typography
							variant="caption"
							component="div"
							sx={{ mb: 0.5, color: 'text.secondary' }}
						>
							Accent
						</Typography>

						{readerMainLanguage}
					</div>
				</Box>

				{!props.isStaff && (
					<>
						<Divider sx={{ borderStyle: 'dashed' }} />

						<Box
							sx={{
							  width: '100%',
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center',
							  py: 2,
							}}
						>
							<Link
								component={RouterLink}
								to={isGuest
								  ? paths.guest.user(reader.id)
								  : paths.main.user(reader.id)}
								underline="none"
							>
								<Button
									variant="contained"
									color="primary"
									size="small"
									endIcon={<Iconify icon="mdi:arrow-right" width={16} height={16} />}
								>
									Book now
								</Button>
							</Link>
						</Box>
					</>
				)}

			</Card>
		</Box>
  );
};

export default ReaderCard;

ReaderCard.propTypes = {
  reader: PropTypes.object,
};

ReaderCard.defaultProps = {
  reader: {},
};
