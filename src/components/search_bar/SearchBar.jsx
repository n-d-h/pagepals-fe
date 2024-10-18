import { Box, Button, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Iconify from '../iconify';

const SearchBar = (
  { searchKey, setSearchKey, searchType, handleFilterChange, onSearchClick },
) => {
  const [searchValue, setSearchValue] = useState('');

  const getOptionsDelayed = useCallback(
    _.debounce((text, callback) => {
      callback(text);
    }, 500),
    [],
  );

  return (
        <Box className="flex" width={'50%'}>

            <TextField
                sx={{
                  // backgroundColor: 'white',
                  width: '100%',
                  '.MuiInputBase-root': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    backgroundColor: 'white',
                    pl: 1,
                  },
                  ':focus': {
                    outline: 'none',
                    pl: 1,
                  },
                }}
                value={searchValue || searchKey}
                onChange={(e) => {
                  const newInputValue = e.target.value;
                  setSearchValue(newInputValue);
                  getOptionsDelayed(newInputValue, (_newInputValue) => {
                    setSearchKey(_newInputValue);
                  });
                }}
                placeholder="Input something in your interest to search..."
                InputProps={{
                  endAdornment: (
                        <Button sx={{ height: '100%' }} variant="text" onClick={handleFilterChange}
                            startIcon={<Iconify icon="tabler:filter" color="primary" size={20} />}
                        >
                            {searchType}
                        </Button>
                  ),
                }}
            />

            <Button
                sx={{
                  // height: '70%',
                  p: 2,
                  borderTopRightRadius: 25,
                  borderBottomRightRadius: 25,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: '1px solid',
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                  ':hover': {
                    boxShadow: 'none',
                  },
                }}
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSearchClick();
                }}
            >
                <Iconify icon="iconamoon:search-fill" color="primary" size={20} />
            </Button>
        </Box>
  );
};

export default SearchBar;
