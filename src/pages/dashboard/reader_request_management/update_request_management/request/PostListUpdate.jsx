import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { PostItemSkeleton } from '../../../reader_request_management/request/PostItemSkeleton';
import PostItemUpdate from './PostItemUpdate';
import CustomImage from '../../../../../components/image/CustomImage';
import image from '../../../../../assets/landing/no-data.webp';

// ----------------------------------------------------------------------

export default function PostListUpdate ({ posts, loading, pagination }) {
  const renderSkeleton = (
        <>
            {[...Array(16)].map((_, index) => (
                <PostItemSkeleton key={index} variant="horizontal" />
            ))}
        </>
  );

  const renderList = (
        <>
            {posts.length === 0
              ? (
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <CustomImage src={image} sx={{ width: 320, height: 240 }} />
                    <Box sx={{ mt: 5, color: 'text.secondary' }}>No data</Box>
                </Box>
                )
              : (posts.map((post) => (
                <PostItemUpdate key={post.id} post={post} />
                )))}

        </>
  );

  return (
        <>
            {posts.length === 0
              ? (
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <CustomImage src={image} sx={{ width: '35%', height: '20%' }} />
                    <Box sx={{ mt: -15, color: 'text.secondary', fontSize: 20 }}>There is nothing in this list</Box>
                </Box>
                )
              : (
                <Box
                    gap={3}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    }}
                >
                    {loading ? renderSkeleton : renderList}
                </Box>
                )}

            {posts.length > 8 && (
                <Pagination
                    count={pagination.totalOfElements || 8}
                    sx={{
                      mt: 8,
                      [`& .${paginationClasses.ul}`]: {
                        justifyContent: 'center',
                      },
                    }}
                />
            )}
        </>
  );
}

PostListUpdate.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
