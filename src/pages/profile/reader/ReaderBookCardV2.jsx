import { Box, Typography } from '@mui/material';
import React from 'react';
import TextMaxLine from '../../../components/text-max-line';

const ReaderBookCardV2 = ({ book, wrapperStyles, open, seeMore }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 4,
                ...wrapperStyles,
            }}
        >
            {/* <pre>{JSON.stringify(book, null, 2)}</pre> */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        height: 100,
                        alignSelf: 'start',
                        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                        border: '1px solid #e0e0e0',
                    }}
                    component={'img'}
                    alt="book cover"
                    src={_.get(book, 'cover') || _.get(book, 'thumbnailUrl')}
                ></Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        ml: 2,
                        width: '100%',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="h4" fontWeight={800}>
                            {_.get(book, 'title')}
                        </Typography>

                        <Typography variant="body2" fontWeight={400} color={'GrayText'}>
                            {_.get(book, 'authors[0].name')}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', gap: 1, width: '100%' }}>
                        <Typography variant="body2" fontWeight={400} color={'GrayText'}>Language:</Typography>
                        <Typography variant="body2" fontWeight={400} color={'GrayText'}>
                            {_.get(book, 'language')}
                        </Typography>
                    </Box>
                    {
                        open
                            ? seeMore !== null && seeMore === true
                                ? (
                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography className="
                                            animate__animated animate__fadeIn animate_animate__faster" variant="body2" sx={{ color: 'text.secondary', minWidth: '100%' }}>
                                            {_.get(book, 'description')}
                                        </Typography>
                                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', opacity: 0.5, minWidth: '100%', cursor: 'pointer' }}>
                                            Click to see less...
                                        </Typography>
                                    </Box>
                                )
                                : (
                                    <Typography className="
                                            animate__animated animate__fadeIn animate_animate__faster" variant="body2" sx={{ color: 'text.secondary', minWidth: '100%' }}>
                                        {_.get(book, 'description')}
                                    </Typography>
                                )
                            : seeMore !== null && seeMore === true
                                ? (
                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <TextMaxLine className="
                                            animate__animated animate__fadeIn animate_animate__faster" variant="body2" sx={{ color: 'text.secondary', minWidth: '100%' }}>
                                            {_.get(book, 'description')}
                                        </TextMaxLine>
                                        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', opacity: 0.5, minWidth: '100%', cursor: 'pointer' }}>
                                            Click to see more...
                                        </Typography>
                                    </Box>
                                )
                                : (
                                    <TextMaxLine className="
                                animate__animated animate__fadeIn animate_animate__faster" variant="body2" sx={{ color: 'text.secondary', minWidth: '100%' }}>
                                        {_.get(book, 'description')}
                                    </TextMaxLine>
                                )
                    }

                </Box>
            </Box>
        </Box>
    );
};

export default ReaderBookCardV2;
