import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Box } from '@mui/material';
// import { joinSeminarMutation } from '../../services/apolo/mutations';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';
import MotionContainer from '../animate/motion-container';
import { varFade } from '../animate/variants';
import Iconify from '../iconify';
import { paths } from '../router/paths';
import Image from '../shadcn-ui/image';
import Carousel, { CarouselArrows, CarouselDots, useCarousel } from './index';

// ----------------------------------------------------------------------

export default function AppFeatured({ list, ...other }) {
  const carousel = useCarousel({
    speed: 800,
    autoplay: true,
    ...CarouselDots({
      sx: {
        top: 16,
        left: 16,
        position: 'absolute',
        color: 'primary.light',
      },
    }),
  });

  const location = useLocation();

  const isGuest = location.pathname.includes('guest');

  return (
    <Card {...other}>
      {list.length === 1
        ? <CarouselItem key={list[0].id} item={list[0]} active={true} isGuest={isGuest} {...other} />
        : (
          <>
            <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>

              {list.map((item, index) => (
                <CarouselItem key={item.id} item={item} active={index === carousel.currentIndex} isGuest={isGuest} {...other} />
              ))}
            </Carousel>

            <CarouselArrows
              onNext={carousel.onNext}
              onPrev={carousel.onPrev}
              sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
            /></>
        )}

    </Card>
  );
}

AppFeatured.propTypes = {
  list: PropTypes.array,
};

// ----------------------------------------------------------------------

function CarouselItem({ item, active, refetch, isGuest }) {
  const theme = useTheme();

  const { event, startAt } = item;

  const navigate = useNavigate();

  const handleSeeEvents = () => {
    isGuest ? navigate(paths.guest.eventDetail(event.id)) : navigate(paths.main.eventDetail(event.id));
  };

  const renderImg = (
    <Image
      alt={_.get(event, 'seminar.title', null)}
      src={_.get(event, 'seminar.imageUrl', null) || 'https://source.unsplash.com/1600x900/?nature,water'}
      // overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${theme.palette.grey[900]
      //   } 75%)`}
      sx={{
        width: '100%',
        height: {
          xs: 400,
          xl: 480,
        },
        // objectFit: 'center',
      }}
    />
  );

  // if (joinLoading) return <BackdropLoading />;

  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      {/* <Stack
        spacing={1}
        sx={{
          p: 3,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        

        <m.div variants={varFade().inRight}>
          <Box className='flex' sx={{
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'start',
            gap: 1,
          }}>
            <Iconify icon="fa-solid:book-reader" color="primary.light" width={18} height={18} />
            <Typography variant="subtitle1" sx={{ color: 'primary.light' }}>
              {_.get(event, 'seminar.reader.nickname', 'N/A')}
            </Typography>

          </Box>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Link color="inherit" underline="none" onClick={handleSeeEvents}>
            <Typography variant="h4" noWrap sx={{ fontWeight: 800 }}>
              {_.get(event, 'seminar.title', 'No title available')}
            </Typography>
          </Link>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography variant="h6" noWrap sx={{ color: 'primary.light' }}>
            {Math.floor(_.get(
              event,
              'seminar.duration',
            ) / 60) + ' hours ' + (_.get(event, 'seminar.duration') % 60) + ' minutes'}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography variant="body2" noWrap>
            {moment(_.get(event, 'startAt')).format('LL') + ' - ' + moment(_.get(event, 'startAt')).format('LT')}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Box className='flex' sx={{
            justifyContent: 'start',
            gap: 1,
          }}>
            <Iconify icon="ion:people-sharp" color="primary.light" width={20} height={20} />
            <Typography variant="caption" sx={{ color: 'primary.light' }}>

              {' ' + (_.get(event, 'limitCustomer') - (_.get(event, 'activeSlot'))) + '/' + _.get(event, 'limitCustomer')} booked
            </Typography>

          </Box>
        </m.div>
      </Stack> */}
      <Link color="inherit" underline="none" onClick={handleSeeEvents}>
        {renderImg}
      </Link>

    </MotionContainer>
  );
}

CarouselItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
};
