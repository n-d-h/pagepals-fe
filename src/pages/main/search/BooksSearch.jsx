import { useQuery } from '@apollo/client';
import { Box, Grid, Pagination } from '@mui/material';
import React, { useState } from 'react';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import { getSearchedBooks } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import BookCardForView from './BookCardForView';

const BooksSearch = ({ searchKey, isGuest }) => {
  const [page, setPage] = useState(0);

  const { data, loading } = useQuery(getSearchedBooks, {
    variables: {
      name: searchKey || '',
      pageIndex: page,
      pageSize: 8,

    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while searching for books');
    },
  });

  if (loading) return <BackdropLoading />;

  const list = _.get(data, 'getListBookForCustomer.list', []);
  const pagination = _.get(data, 'getListBookForCustomer.pagination', {});

  return (
    <Box sx={{ width: '100%' }}>

      <Box sx={{ width: '100%', mt: 5 }}>
        <Grid container spacing={4} width={'100%'}>
          {list.length > 0 && list.map((book) => (
            <Grid key={book.title} item xs={12} md={6} lg={3}>
              <BookCardForView book={book} isGuest={isGuest} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className="flex" sx={{ width: '100%', mt: 5 }}>

        <Pagination count={_.get(pagination, 'totalOfPages', 0)} page={page + 1} onChange={(event, value) => {
          setPage(value - 1);
        }} />
      </Box>

    </Box>
  );
};

export default BooksSearch;
