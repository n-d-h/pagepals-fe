import { useQuery } from '@apollo/client';
import { Box, Container, Stack } from '@mui/material';
import { orderBy } from 'lodash';
import React, { useCallback, useState } from 'react';
import image from '../../../assets/landing/no-data.webp';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/custom-breadcrumbs';
import CustomImage from '../../../components/image/CustomImage';
import { paths } from '../../../components/router/paths';
import { getReportReaders } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import JobSort from '../report_booking_management/component/JobSort';
import ReportReaderList from './ReportReaderList';

const JOB_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

const ReportReaderManagementScreen = () => {
  const [sortBy, setSortBy] = useState('latest');
  const [list, setList] = useState('');

  const dataFiltered = applyFilter({
    inputData: list,
    sortBy,
  });

  const notFound = !dataFiltered.length;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const setDataFetching = (data) => {
    setList(data.listReportReader);
  };

  const { loading } = useQuery(getReportReaders, {
    onCompleted: setDataFetching,
    fetchPolicy: 'no-cache',
  });

  if (loading) return <BackdropLoading />;

  const renderFilters = (
            <Stack
                spacing={3}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-end', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
            >

                <Stack direction="row" spacing={1} flexShrink={0}>

                    <JobSort sort={sortBy} onSort={handleSortBy} sortOptions={JOB_SORT_OPTIONS} />
                </Stack>
            </Stack>
  );

  return (
    <Container maxWidth='xl'>
        <CustomBreadcrumbs
            heading="Report Reader Management"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              {
                name: 'Report Reader Management',
              },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
        />

        <Stack
            spacing={2.5}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
        >
            {renderFilters}

        </Stack>

        {notFound &&
            <Box sx={{ mt: 5, textAlign: 'center' }}>
                <CustomImage src={image} sx={{ width: 320, height: 240 }} />
                <Box sx={{ mt: 5, color: 'text.secondary' }}>No data</Box>
            </Box>}

              <ReportReaderList reports={dataFiltered} />
          </Container>
  );
};

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, sortBy }) => {
  // SORT BY
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['listReport[0].createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['listReport[0].createdAt'], ['asc']);
  }

  return inputData;
};

export default ReportReaderManagementScreen;
