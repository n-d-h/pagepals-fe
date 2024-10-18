import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../../../../components/search_bar/SearchBar';
import { paths } from '../../../../components/router/paths';
import { Typography } from '@mui/material';

const MainNavbar = () => {
  const [searchKey, setSearchKey] = useState('');
  const [searchType, setSearchType] = useState('Readers');
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterChange = () => {
    setSearchType((prevType) => (prevType === 'Readers' ? 'Books' : 'Readers'));
  };

  const onSearchClick = () => {
    if (location.pathname !== paths.main.search && location.pathname.includes('main')) {
      console.log('searchKey:', searchKey);
      navigate(paths.main.search, { state: { searchKey, searchType } });
    } else if (location.pathname !== paths.guest.search && location.pathname.includes('guest')) {
      navigate(paths.guest.search, { state: { searchKey, searchType } });
    }
  };

  // Check if the current route is the search page
  if (location.pathname === paths.main.search || location.pathname === paths.guest.search) {
    return <Typography variant="h4" sx={{ textAlign: 'center', color:'white' }}>Search Screen</Typography>;
  }

  return (
    <SearchBar
      searchKey={searchKey}
      setSearchKey={setSearchKey}
      searchType={searchType}
      handleFilterChange={handleFilterChange}
      onSearchClick={onSearchClick} />
  );
};

export default MainNavbar;
