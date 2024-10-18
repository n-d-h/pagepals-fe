import orderBy from 'lodash/orderBy';
import { useCallback, useState } from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';

import PostSort from '../request/PostSort';
import PostListUpdate from './request/PostListUpdate';

import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/slices/authSlice';
// import { getListUpdateRequestedReader } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';

// ----------------------------------------------------------------------

const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function UpdateRequestManagementScreen () {
  const user = useSelector(selectUser);

  const [sortBy, setSortBy] = useState('latest');

  const [posts, setPosts] = useState([]);

  const dataFiltered = applyFilter({
    inputData: posts,
    sortBy,
  });

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const setDataFetching = (data) => {
    setPosts(_.get(data, 'getAllUpdateRequestedReader.list', []));
  };

  // const { loading, error, data } = useQuery(getListUpdateRequestedReader, {
  //   variables: { page: 0, pageSize: 10 },
  //   onCompleted: setDataFetching,
  //   fetchPolicy: 'no-cache',
  // });

  // if (loading) return <BackdropLoading />;

  return (
    <Container maxWidth='xl'>
      <CustomBreadcrumbs
        heading="List"
        links={[
          {
            name: 'Dashboard',
          },
          {
            name: 'Request Management',
          },
          {
            name: 'Update Request Management',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>

      {/* <PostListUpdate posts={dataFiltered} pagination={data?.getAllUpdateRequestedReader?.pagination} /> */}
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, sortBy }) => {
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  return inputData;
};
