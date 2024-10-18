import orderBy from 'lodash/orderBy';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import Label from '../../../components/label';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

import PostSort from './request/PostSort';
import PostListHorizontal from './request/PostListHorizontal';

import { useQuery } from '@apollo/client';
import { getReaderRequest } from '../../../services/apolo/queries';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/slices/authSlice';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

// ----------------------------------------------------------------------

const defaultFilters = {
  state: 'all',
};

const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function ReaderRequestManagementScreen() {
  const user = useSelector(selectUser);

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  const [posts, setPosts] = useState([]);

  const dataFiltered = applyFilter({
    inputData: posts,
    filters,
    sortBy,
    user,
  });

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('state', newValue);
    },
    [handleFilters],
  );

  const setDataFetching = (data) => {
    setPosts(data.getListRequest);
  };

  const { loading, error, data } = useQuery(getReaderRequest, {
    onCompleted: setDataFetching,
  });

  if (loading) return <BackdropLoading />;

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
            name: 'Reader Request Management',
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

      <Tabs
        value={filters.state}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'pending', 'scheduling', 'interviewing', 'pass', 'reject'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.state) && 'filled') || 'soft'}
                color={(tab === 'published' && 'info') || 'default'}
              >
                {tab === 'all' && posts.length}

                {tab === 'pending' &&
                  posts.filter((post) => post.state === 'ANSWER_CHECKING').length}
                {tab === 'scheduling' &&
                   posts.filter((post) => post.state === 'INTERVIEW_SCHEDULING' && post.staffId === user?.id).length}

                {tab === 'interviewing' &&
                  posts.filter((post) => post.state === 'INTERVIEW_PENDING' && post.staffId === user?.id).length}

                {tab === 'pass' &&
                  posts.filter((post) => post.state === 'PASS').length}

                {tab === 'reject' &&
                  posts.filter((post) => post.state === 'REJECT').length}

              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PostListHorizontal posts={dataFiltered} user={user} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, user }) => {
  const { state } = filters;

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }
  'all', 'pending', 'interviewing', 'pass', 'reject';

  if (state !== 'all') {
    if (state === 'pending') { inputData = inputData.filter((post) => post.state === 'ANSWER_CHECKING'); }
    if (state === 'interviewing') { inputData = inputData.filter((post) => post.state === 'INTERVIEW_PENDING' && post.staffId === user?.id); }
    if (state === 'scheduling') { inputData = inputData.filter((post) => post.state === 'INTERVIEW_SCHEDULING' && post.staffId === user?.id); }
    if (state === 'pass') { inputData = inputData.filter((post) => post.state === 'PASS'); }
    if (state === 'reject') { inputData = inputData.filter((post) => post.state === 'REJECT'); }
  }

  return inputData;
};
