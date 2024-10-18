import { useQuery } from '@apollo/client';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import { readerGetServicesBook } from '../../../../../services/apolo/queries';
import CreateStep1Tab1 from './createStep1Tabs/Tab1';
import CreateStep1Tab2 from './createStep1Tabs/Tab2';

const TABS = [
  {
    value: 'one',
    label: 'Find system provided book',
  },
  {
    value: 'two',
    label: 'Create a new book',
  },
];

export default function CreateStep1({ book, setBook, newBook, setNewBook, file, setFile, currentTab, setCurrentTab }) {
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const [bookTitle, setBookTitle] = useState(book?.title || '');

  const [bookAuthor, setBookAuthor] = useState('');

  const [searchBookTitle, setSearchBookTitle] = useState('');
  const [searchBookAuthor, setSearchBookAuthor] = useState('');
  const [searchBookPage, setSearchBookPage] = useState(1);

  const {
    refetch: searchBookCalled,
    data: searchBook,
    loading: searchBookLoading,
  } = useQuery(readerGetServicesBook, {
    variables: {
      title: searchBookTitle,
      author: searchBookAuthor,
      page: searchBookPage,
      pageSize: 10,
    },
  });

  const handleSearchBook = () => {
    setSearchBookTitle(bookTitle);
    setSearchBookAuthor(bookAuthor);
    searchBookCalled();
  };
  return (
    <Stack spacing={2} sx={{ width: 1 }}>
      <Tabs value={currentTab} onChange={handleChangeTab}>
        {TABS.slice(0, 2).map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {
        currentTab === 'one' ? (
          <CreateStep1Tab1
            // key={tab.value}
            bookTitle={bookTitle}
            setBookTitle={setBookTitle}
            bookAuthor={bookAuthor}
            setBookAuthor={setBookAuthor}
            book={book}
            setBook={setBook}
            searchBook={searchBook}
            searchBookLoading={searchBookLoading}
            handleSearchBook={handleSearchBook} />
        ) : (
          <Box
            // key={tab.value}
            sx={{
              pl: 2,
              borderRadius: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <CreateStep1Tab2
              book={newBook}
              setBook={setNewBook}
              file={file}
              setFile={setFile} />
          </Box>
        )
      }
    </Stack>
  );
};
