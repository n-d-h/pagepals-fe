import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { useRouter } from '../../../../components/hooks/use-router';

import JobItem from './JobItem';

// ----------------------------------------------------------------------

export default function JobList ({ jobs }) {
  const router = useRouter();

  const handleView = useCallback(
    (id) => {
      // router.push(paths.dashboard.job.details(id));
    },
    [router],
  );

  const handleEdit = useCallback(
    (id) => {
      // router.push(paths.dashboard.job.edit(id));
    },
    [router],
  );

  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {jobs.map((job, index) => (
          <JobItem
            key={index}
            job={job}
            onView={() => handleView(job.id)}
            onEdit={() => handleEdit(job.id)}
            onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {/* {jobs.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )} */}
    </>
  );
}

JobList.propTypes = {
  jobs: PropTypes.array,
};