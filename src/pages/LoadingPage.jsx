import { Box } from '@mui/material';

export const LoadingPage = ({ height }) => {
  const loaderStyle = {
    position: 'relative',
    width: '120px',
    height: '90px',
    margin: '0 auto',
  };

  const beforeStyle = {
    position: 'absolute',
    bottom: '30px',
    left: '50px',
    height: '30px',
    width: '30px',
    borderRadius: '50%',
    background: '#FF3D00',
    animation: 'loading-bounce 0.5s ease-in-out infinite alternate',
  };

  const afterStyle = {
    position: 'absolute',
    right: '0',
    top: '0',
    height: '7px',
    width: '45px',
    borderRadius: '4px',
    boxShadow: '0 5px 0 #fff, -35px 50px 0 #000, -70px 95px 0 #000', // Middle shadows in black
    animation: 'loading-step 1s ease-in-out infinite',
  };

  return (
        <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height,
            }}
        >
            <style>
                {`
          @keyframes loading-bounce {
            0% { transform: scale(1, 0.7) }
            40% { transform: scale(0.8, 1.2) }
            60% { transform: scale(1, 1) }
            100% { bottom: 140px }
          }

          @keyframes loading-step {
            0% {
              box-shadow: 0 10px 0 rgba(0,0,0,0), 0 10px 0 #fff, -35px 50px 0 #000, -70px 90px 0 #000;
            }
            100% {
              box-shadow: 0 10px 0 #fff, -35px 50px 0 #000, -70px 90px 0 #000, -70px 90px 0 rgba(0,0,0,0);
            }
          }
        `}
            </style>
            <div style={loaderStyle}>
                <div style={beforeStyle}></div>
                <div style={afterStyle}></div>
            </div>
        </Box>
  );
};
