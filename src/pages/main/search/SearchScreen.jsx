import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import SearchBar from '../../../components/search_bar/SearchBar';
import BooksSearch from './BooksSearch';
import ReadersSearch from './ReadersSearch';

const SearchScreen = (props) => {
  const location = useLocation();
  if (!location.state) {
    location.state = {
      searchKey: '',
      searchType: 'Readers',
    };
  }
  const { searchKey, searchType } = location.state;

  const isGuest = location.pathname.includes('guest');

  const [currentSearchKey, setCurrentSearchKey] = useState(searchKey || '');
  const [currentSearchType, setCurrentSearchType] = useState(searchType || 'Readers');

  const handleFilterChange = () => {
    setCurrentSearchType((prevType) => (prevType === 'Readers' ? 'Books' : 'Readers'));
  };

  const onSearchClick = () => {
  };

  return (
    <>
    <Helmet>
      <title>PagePals - Search</title>
    </Helmet>
    <Box
      sx={{
        width: '100%',
        py: 5,
        px: 20,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SearchBar searchKey={currentSearchKey} setSearchKey={setCurrentSearchKey} searchType={currentSearchType} handleFilterChange={handleFilterChange} onSearchClick={onSearchClick}/>

      {currentSearchType === 'Readers'
        ? (
        <ReadersSearch searchKey={currentSearchKey} isGuest={isGuest}/>
          )
        : (
        <BooksSearch searchKey={currentSearchKey} isGuest={isGuest}/>
          )}
    </Box>
  </>
  );
};

export default SearchScreen;
