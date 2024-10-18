import { useQuery } from '@apollo/client';
import { Autocomplete, Box, Grid, ListItemText, MenuItem, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { isScrollToBottom } from '../../../../../../components/common_services/CommonServices';
import Iconify from '../../../../../../components/iconify';
import ListBox from '../../../../../../components/list-box/ListBox';
import { readerGetServicesBook } from '../../../../../../services/apolo/queries';

export default function CreateStep1Tab1 ({ bookTitle, setBookTitle, bookAuthor, setBookAuthor, book, setBook, searchBook, searchBookLoading, handleSearchBook }) {
  const [extended, setExtended] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [title, setTitle] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const titleParam = urlParams.get('title') || '';
  const [searchKey, setSearchKey] = useState(titleParam);

  const {
    loading,
    data,
  } = useQuery(readerGetServicesBook, {
    variables: {
      title,
      author: ' ',
      page: 1,
      pageSize,
    },
  });

  const getOptionsDelayed = useCallback(
    _.debounce((text, callback) => {
      callback(text);
    }, 500),
    [],
  );

  return (
        <Box
            // key={tab.value}
            className='flex'
            sx={{
              pl: 2,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
        >
            <Box sx={{
              width: '66%',
            }}>
                <Autocomplete
                    ListboxComponent={ListBox}
                    options={_.get(data, 'searchBook.items') || []}
                    disabled={extended}
                    ListboxProps={{
                      style: {
                        maxHeight: 250,
                      },
                      onScroll: (event) => {
                        if (
                          isScrollToBottom(event) &&
                                pageSize < 39
                        ) {
                          if (pageSize < 34) {
                            setPageSize(pageSize + 5);
                            return;
                          } setPageSize(pageSize + 4);
                        }
                      },
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id || option.id === value
                    }
                    filterOptions={(x) => x}
                    getOptionLabel={(option) => {
                      return _.get(option, 'volumeInfo.title', '');
                    }}
                    renderOption={(props, option) => {
                      return (
                            <MenuItem {...props} key={
                                _.get(option, 'id')
                            }>
                                <Box
                                    sx={{
                                      width: '100%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      px: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex' }}>
                                        <Box sx={{ position: 'relative', mr: 2 }}>

                                        </Box>
                                        <Box sx={{
                                          position: 'relative',
                                          mr: 2,
                                          width: 70,
                                          height: 100,
                                          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                                          border: '1px solid #e0e0e0',
                                        }}

                                            component={'img'}
                                            alt="book cover"
                                            src={
                                                _.get(option, 'volumeInfo.imageLinks.thumbnail') ||
                                                _.get(option, 'volumeInfo.imageLinks.smallThumbnail')
                                            }
                                        ></Box>
                                        <ListItemText
                                            sx={{
                                              width: '60%',
                                              textOverflow: 'ellipsis',
                                            }}
                                            primary={_.get(option, 'volumeInfo.title', 'Unknown')}
                                            secondary={_.get(
                                              option,
                                              'volumeInfo.authors[0]',
                                              'Unknown',
                                            )}
                                        />

                                    </Box>

                                    <Box>
                                        <ListItemText
                                            primary={_.get(option, 'volumeInfo.categories[0]', 'Unknown')}
                                            secondary={''}
                                        />
                                    </Box>
                                </Box>
                            </MenuItem>
                      );
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        setSearchKey(newInputValue);
                        getOptionsDelayed(newInputValue, (_newInputValue) => {
                          setTitle(newInputValue);
                        });
                      }
                    }}
                    inputValue={
                      searchKey || ''
                    }
                    onChange={(e, value) => {
                      setSearchKey(value?.volumeInfo.title);
                      setBook({
                        id: value?.id,
                        volumeInfo: {
                          title: value?.volumeInfo.title,
                          authors: value?.volumeInfo.authors,
                          categories: value?.volumeInfo.categories,
                          imageLinks: {
                            thumbnail: value?.volumeInfo.imageLinks.thumbnail,
                            smallThumbnail: value?.volumeInfo.imageLinks.smallThumbnail,
                          },
                          description: value?.volumeInfo.description,
                          language: value?.volumeInfo.language,
                          pageCount: value?.volumeInfo.pageCount,
                          publishedDate: value?.volumeInfo.publishedDate,
                          publisher: value?.volumeInfo.publisher,

                        },
                      });
                    }}
                    value={book || null}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search..."
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: loading ? <Iconify icon='eos-icons:loading' /> : <Iconify icon='streamline:search-visual' />,
                            }}
                        />
                    )}
                />
            </Box>

            <Typography variant="caption" color={'GrayText'} sx={{
              mt: 2,
              ':hover': {
                cursor: 'pointer',
                color: 'text.primary',
              },
            }} onClick={() => setExtended(!extended)}>
                Can&apos;t find the book you&apos;re looking for? Click here for extended search...
            </Typography>

            <Box
                sx={{
                  width: '100%',
                  height: extended ? '100%' : 0,
                  opacity: extended ? 1 : 0,
                  transition: 'all 0.2s ease-in-out',
                  overflow: 'hidden',
                }}
            >
                <Grid container spacing={3} mt={0}>
                    <Grid item xs={12} lg={4}>
                        <TextField
                            fullWidth
                            label={bookTitle ? 'Book Title' : 'Give me a book title...'}
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <TextField
                            fullWidth
                            label={bookAuthor ? 'Authors' : 'Who is the author?'}
                            // placeholder="Who is the author?"
                            value={bookAuthor}
                            onChange={(e) => setBookAuthor(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <Autocomplete
                            disabled={!bookTitle || !bookAuthor || !book}
                            // open={bookTitle && bookAuthor}
                            onChange={(e, value) => {
                              setBook({
                                id: value?.id,
                                volumeInfo: {
                                  title: value?.volumeInfo.title,
                                  authors: value?.volumeInfo.authors,
                                  categories: value?.volumeInfo.categories,
                                  imageLinks: {
                                    thumbnail: value?.volumeInfo.imageLinks.thumbnail,
                                    smallThumbnail: value?.volumeInfo.imageLinks.smallThumbnail,
                                  },
                                  description: value?.volumeInfo.description,
                                  language: value?.volumeInfo.language,
                                  pageCount: value?.volumeInfo.pageCount,
                                  publishedDate: value?.volumeInfo.publishedDate,
                                  publisher: value?.volumeInfo.publisher,

                                },
                              });
                            }}
                            value={book || null}
                            options={searchBook?.searchBook?.items || []}
                            getOptionLabel={(option) => _.get(option, 'volumeInfo.title', 'Click here to search for book...')}
                            loading={searchBookLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={book?.volumeInfo?.title !== '' ? 'Select Book' : undefined}
                                    placeholder="You must input book title and author to search..."
                                    variant="outlined"
                                    onClick={handleSearchBook}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: searchBookLoading ? <Iconify icon='eos-icons:loading' /> : <Iconify icon='streamline:search-visual' />,
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <MenuItem {...props}>
                                    <Box
                                        sx={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          px: 2,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex' }}>
                                            {/* <Box sx={{ position: 'relative', mr: 2 }}>
                                            <Avatar
                                                src={
                                                    _.get(option, 'volumeInfo.imageLinks.thumbnail') ||
                                                    _.get(option, 'volumeInfo.imageLinks.smallThumbnail')
                                                }
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    color: 'text.secondary',
                                                    bgcolor: 'background.neutral',
                                                }}
                                            ></Avatar>
                                        </Box> */}
                                            <Box sx={{
                                              position: 'relative',
                                              mr: 2,
                                              width: 70,
                                              height: 100,
                                              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                                              border: '1px solid #e0e0e0',
                                            }}

                                                component={'img'}
                                                alt="book cover"
                                                src={
                                                    _.get(option, 'volumeInfo.imageLinks.thumbnail') ||
                                                    _.get(option, 'volumeInfo.imageLinks.smallThumbnail')
                                                }
                                            ></Box>
                                            <ListItemText
                                                sx={{
                                                  width: '60%',
                                                  textOverflow: 'ellipsis',
                                                }}
                                                primary={_.get(option, 'volumeInfo.title', 'Unknown')}
                                                secondary={_.get(
                                                  option,
                                                  'volumeInfo.authors[0]',
                                                  'Unknown',
                                                )}
                                            />

                                        </Box>

                                        <Box>
                                            <ListItemText
                                                primary={_.get(option, 'volumeInfo.categories[0]', 'Unknown')}
                                                secondary={''}
                                            />
                                        </Box>
                                    </Box>
                                </MenuItem>
                            )}
                        />
                    </Grid>

                </Grid>
            </Box>
        </Box>
  );
};
