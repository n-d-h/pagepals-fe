import { useQuery } from '@apollo/client';
import { Box, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handleFriendlyError } from '../../../../components/common_services/CommonServices';
import { TablePaginationCustom } from '../../../../components/table';
import { selectUser } from '../../../../redux/slices/authSlice';
import { getBooksByReader } from '../../../../services/apolo/queries';
import { NothingTooSeePage } from '../../../NothingToSeePage';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import { ProfileServiceContext } from './ProfileServiceContext';
import ServicesTable from './ServicesTable';

const ProfileServices = () => {
  const userProfile = useSelector(selectUser);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

  const {
    loading, setLoading,
  } = useContext(
    ProfileServiceContext,
  );

  const {
    data: readerServices,
    loading: readerServicesLoading,
    error: readerServicesError,
    refetch: refetchReaderServices,
  } = useQuery(getBooksByReader, {
    variables: {
      id: _.get(userProfile, 'reader.id', ''),
      page,
      pageSize: rowsPerPage,
      title: search,
    },
    onError: (e) => {
      handleFriendlyError(e, 'Cannot fetch services');
    },
    fetchPolicy: 'no-cache',
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleChangeSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    setLoading(readerServicesLoading);
  }
  , [readerServicesLoading]);

  if (loading) {
    return <BackdropLoading />;
  }

  if (readerServicesError) {
    return <Box className="flex" sx={{
		  height: '100%',
    }}>
		  <NothingTooSeePage />
		</Box>;
	  }

  return (
		<Box sx={{ mt: 0, height: '100%', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: 2 }}>
			{readerServicesLoading && search === ''
			  ? (
				<BackdropLoading />
			    )
			  : (
				<Grid container spacing={0}>
					<Grid item xs={12}>
						<ServicesTable
							title="Current Services"
							tableData={_.get(readerServices, 'getReaderBooks.list', [])}
							subheader="List of books that you are offering services for."
							handleChangeSearch={handleChangeSearch}
							searchValue={search}
							refetchReaderServices={refetchReaderServices}
							readerServicesLoading={readerServicesLoading}
							tableLabels={[
							  { id: 'book', label: 'Book' },
							  { id: 'service', label: 'Services' },
							  { id: 'price', label: 'Price' },
							  { id: 'duration', label: 'Duration' },
							  { id: 'rating', label: 'Rating' },
							  { id: 'status', label: 'Status' },
							  { id: '' },
							]}
						/>
					</Grid>

					<Grid item xs={8}></Grid>

					<Grid item xs={4}>
						<Box
							sx={{
							  width: '100%',
							  display: 'flex',
							  justifyContent: 'flex-end',
							}}
						>
							<Box
								sx={{
								  bgcolor: 'background.paper',
								  width: 'fit-content',
								  borderRadius: 2,
								}}
							>
								<TablePaginationCustom
									count={
										_.get(readerServices, 'getReaderBooks.paging.totalOfElements', 0)
									}
									page={page}
									rowsPerPage={rowsPerPage}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
								/>
							</Box>
						</Box>
					</Grid>
				</Grid>
			    )}
		</Box>
  );
};

export default ProfileServices;
