import { Box, Rating, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "../../../../components/router/paths";
import RouterLink from "../../../../components/router/router-link";
import Iconify from "../../../../components/iconify";


const ReaderServiceCard = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        p: 2,
        gap: 1,
        border: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        borderRadius: 3,
        position: 'relative',
        ':hover': {
          cursor: 'pointer',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    ><Link
      component={RouterLink}
      to={paths.main.readerServiceDetail(service.id)}
      underline="none"
    >
        <Box sx={{
          height: 220,
          width: '100%',
          alignSelf: 'start',
          borderRadius: 3,
          overflow: 'hidden',

        }}>
          <Box
            sx={{
              height: 220,
              width: '100%',
              alignSelf: 'start',
              borderRadius: 3,
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              overflow: 'hidden',
            }}
            component={'img'}
            alt="book cover"
            src={_.get(service, 'imageUrl', 'https://firebasestorage.googleapis.com/v0/b/authen-6cf1b.appspot.com/o/private_image%2Fdownload.jpg?alt=media&token=ed4273f6-cd3f-4945-8115-2c8b41ca821a')}
          /></Box>
        <Typography variant="h6" fontWeight={500} color={'#000'}>
          {_.get(service, 'serviceType.name')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

          <Box sx={{
            height: 45,
          }}>
            <Typography
              variant="body2"
              fontWeight={400}
              color={'GrayText'}
              sx={{
                opacity: 0.7,
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}>
              {_.get(service, 'shortDescription', '')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 1 }}>
            {/* <Iconify icon='mdi:star' color={'#FFAB00'} /> */}
            <Rating value={_.get(service, 'rating', 0)} readOnly precision={0.5} />
            <Typography variant="body1" fontWeight={800} color={'#FFAB00'}>
              {_.get(service, 'rating', 0)}
            </Typography>

            <Typography variant="body2" fontWeight={400} color={'GrayText'} sx={{ opacity: 0.7 }}>
              ({_.get(service, 'totalOfBooking', 0)})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'start', width: '100%', gap: 0.5, mt: 0.7 }}>
            <Iconify icon='noto:money-bag' />
            <Typography variant="body2" fontWeight={700} color={'green'} sx={{ opacity: 0.7 }}>
              {_.get(service, 'price')} pals
            </Typography>
          </Box>

        </Box>

      </Link>
    </Box>
  );
};

export default ReaderServiceCard;
