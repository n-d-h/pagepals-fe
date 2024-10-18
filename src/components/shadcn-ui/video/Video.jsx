/* eslint-disable react/display-name */
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { getRatio } from '../image/utils';

// Utility function for aspect ratio - You may need to adjust or remove this based on your use case

const Video = forwardRef(
  (
    {
      ratio,
      overlay,
      controls = false,
      autoplay = true,
      loop = false,
      muted = true,
      src,
      type = 'video/mp4', // Default video type; adjust as needed
      isHover,
      sx,
      ...other
    },
    ref,
  ) => {
    const theme = useTheme();

    const videoRef = useRef(null);

    useEffect(() => {
      if (isHover) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
    , [isHover]);

    const overlayStyles = !!overlay && {
      '&:before': {
        content: "''",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 1,
        position: 'absolute',
        background: overlay || alpha(theme.palette.grey[900], 0.48),
      },
    };

    const content = (
      <Box
        component="video"
        ref={ref || videoRef}
        sx={{
          width: 1,
          height: 1,
          objectFit: 'cover',
          verticalAlign: 'bottom',
          // ...(!!ratio && {
          //   top: 0,
          //   left: 0,
          //   position: 'absolute',
          // }),
          ...sx,
        }}
        autoPlay={autoplay}
        controls={controls}
        loop={loop}

        muted={muted}
        {...other}
      >
        <source src={src} type={type}/>
        Your browser does not support the video tag.
      </Box>
    );

    return (
      <Box
        component="span"
        className="component-video"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          verticalAlign: 'bottom',
          display: 'inline-block',
          width: 1,
          height: '100%',
          '& span.component-video-wrapper': {
            width: 1,
            height: 1,
            verticalAlign: 'bottom',
            backgroundSize: 'cover !important',
            ...(!!ratio && {
              pt: getRatio(ratio),
            }),
          },
          ...overlayStyles,
        }}
        {...other}
      >
        {content}
      </Box>
    );
  },
);

Video.propTypes = {
  autoplay: PropTypes.bool,
  controls: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  ratio: PropTypes.oneOf([
    '4/3',
    '3/4',
    '6/4',
    '4/6',
    '16/9',
    '9/16',
    '21/9',
    '9/21',
    '1/1',
  ]),
  src: PropTypes.string.isRequired,
  type: PropTypes.string,
  sx: PropTypes.object,
};

export default Video;
