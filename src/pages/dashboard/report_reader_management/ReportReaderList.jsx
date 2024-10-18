import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useRouter } from '../../../components/hooks/use-router';
import ReaderReportItem from '../report_booking_management/component/ReaderReportItem';

// ----------------------------------------------------------------------

export default function ReportReaderList ({ reports }) {
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
        {reports.map((job, index) => (
          <ReaderReportItem
            key={index}
            job={job}
            onView={() => handleView(job.id)}
            onEdit={() => handleEdit(job.id)}
            onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {/* {reports.length > 8 && (
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

ReportReaderList.propTypes = {
  reports: PropTypes.array,
};
