import { useQuery } from '@apollo/client';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import React from 'react';
import Iconify from '../../../components/iconify';
import { getBooksByReader } from '../../../services/apolo/queries';
import ReaderBookCard from './ReaderBookCard';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const ListBookChoosingForm = (props) => {
  const { chosenBook, readerId, update } = props;

  const { data, loading, error } = useQuery(getBooksByReader, {
    variables: {
      id: readerId,
      page: 0,
      pageSize: 10,
      title: null,
    },
  });

  const books = data?.getReaderBooks?.list || [];

  const handleSelectChapter = (data) => {
    update(data);
  };

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
          <Accordion>
            <AccordionSummary
              expandIcon={<Iconify icon='material-symbols:expand-more' />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
                borderRadius: 2,
                p: 2,
              }}
            >
              <ReaderBookCard book={book.book} option={'noView'} wrapperStyles={{
                p: 0,
              }} />

            </AccordionSummary>
            <AccordionDetails>
              {book.services.map((service) => (
                <Box key={service.id} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}>

                    <Typography>{_.get(
                      service,
                      'serviceType.name',
                    )}</Typography>
                    <Typography>{service.price} pals - {service.duration} minutes</Typography>
                  </Box>

                  <Button variant="contained" color="primary"
                    disabled={chosenBook?.bookId === book.book.id && chosenBook?.serviceId === service.id}
                    onClick={() =>
                      handleSelectChapter({
                        bookName: book.book.title,
                        bookId: book.book.id,
                        serviceId: service.id,
                        serviceType: service.serviceType.name,
                        servicePrice: service.price,
                      })
                    }>
                    Choose this service
                  </Button>

                </Box>

              ))}
            </AccordionDetails>
          </Accordion>
        </Box>

      ))}

    </Box>
  );
};

export default ListBookChoosingForm;
