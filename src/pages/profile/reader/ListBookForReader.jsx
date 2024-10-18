import { useQuery } from '@apollo/client';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import Iconify from '../../../components/iconify';
import { getBooksByReader } from '../../../services/apolo/queries';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import ReaderBookCardV2 from './ReaderBookCardV2';
import ServiceCard from './ServiceCard';

const ListBookForReader = ({ readerId }) => {
  const { data, loading, error } = useQuery(getBooksByReader, {
    variables: {
      id: readerId,
      page: 0,
      pageSize: 4,
      title: null,
    },
    fetchPolicy: 'no-cache',
  });

  const books = data?.getReaderBooks?.list || [];

  const [expanded, setExpanded] = useState({});

  if (loading) return <BackdropLoading />;

  if (error) {
    return <Typography>Something went wrong!</Typography>;
  }

  if (books.length === 0) {
    return <Box sx={{ width: '100%' }}>
      <Typography variant="h6" mt={2} color={'GrayText'} fontWeight={200}>No books found</Typography>
    </Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      {books.map((book) => (
        <Box width={'100%'} key={book.id} sx={{
          my: 2,
        }}>
          <Accordion expanded={
            expanded[book.book.id]
          }
            onChange={() => {
              setExpanded({
                ...expanded,
                [book.book.id]: !expanded[book.book.id],
              });
            }}
          >
            <AccordionSummary
              expandIcon={<Iconify icon='material-symbols:expand-more' />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                border: '1px solid #e0e0e0',
                borderBottom: expanded[book.book.id] ? 'none' : '1px solid #e0e0e0',
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                borderBottomRightRadius: expanded[book.book.id] ? 0 : 16,
                borderBottomLeftRadius: expanded[book.book.id] ? 0 : 16,
                p: 2,
              }}
            >
              <ReaderBookCardV2
                book={book.book} option={'noView'} wrapperStyles={{
                  p: 0,
                }}
                open={expanded[book.book.id]}
              />
            </AccordionSummary>

            <AccordionDetails sx={{
              border: '1px solid #e0e0e0',
              borderTop: 'none',
              borderBottomRightRadius: 16,
              borderBottomLeftRadius: 16,
            }}>
              <Grid container spacing={2}>
                {book?.services?.length > 0 && book.services.map((service) => (
                  <Grid item xs={12} lg={3} key={service.id} >
                    <ServiceCard service={service} />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </Box>
  );
};

export default ListBookForReader;
