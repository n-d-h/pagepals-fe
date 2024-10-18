import { useQuery } from '@apollo/client';
import { Autocomplete, Box, Grid, Pagination, Rating, TextField } from '@mui/material';
import React, { useState } from 'react';
import { handleFriendlyError } from '../../../components/common_services/CommonServices';
import Iconify from '../../../components/iconify';
import { getSearchedReaders } from '../../../services/apolo/queries';
import { NothingTooSeePage } from '../../NothingToSeePage';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';
import { countries } from '../../profile/personal/data/countries';
import ReaderCard from '../home/reader_view/ReaderCard';

const ReadersSearch = ({ searchKey, isGuest = false }) => {
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);

  const { data, loading } = useQuery(getSearchedReaders, {
    variables: {
      nickname: searchKey,
      language,
      country,
      genre,
      rating,
      pageIndex,
      pageSize: 8,
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred while searching for readers');
    },
  });

  if (loading) return <BackdropLoading />;

  const list = _.get(data, 'getListReaders.list', []);

  return (
        <Box sx={{ width: '100%', maxWidth: '70vw' }}>
            <Box sx={{ gap: 2, width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Grid container spacing={2} sx={{ width: '75%', justifyContent: 'space-evenly', alignItems: 'center' }} >
                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            name="countryAccent"
                            label="Accent"
                            options={countries.map((country) => country.label)}
                            getOptionLabel={(option) => option}
                            onChange={(event, value) => setCountry(value)}
                            value={country}
                            isOptionEqualToValue={(option, value) => option === value}
                            renderInput={(params) => (
                                <TextField {...params} label="Accent" />
                            )}
                            renderOption={(props, option) => {
                              const { code, label } = countries.filter(
                                (country) => country.label === option,
                              )[0];

                              if (!label) {
                                return null;
                              }

                              return (
                                    <li {...props} key={label}>
                                        <Iconify
                                            key={label}
                                            icon={`circle-flags:${code.toLowerCase()}`}
                                            width={28}
                                            sx={{ mr: 1 }}
                                        />
                                        {label}
                                    </li>
                              );
                            }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            name="language"
                            label="Language"
                            options={countries.map((country) => country.language)}
                            getOptionLabel={(option) => option}
                            onChange={(event, value) => setLanguage(value)}
                            value={language}
                            isOptionEqualToValue={(option, value) => option === value}
                            renderInput={(params) => (
                                <TextField {...params} label="Language" />
                            )}
                            renderOption={(props, option) => {
                              const { code, language } = countries.filter(
                                (country) => country.language === option,
                              )[0];

                              if (!language) {
                                return null;
                              }

                              return (
                                    <li {...props} key={language}>
                                        <Iconify
                                            key={language}
                                            icon={`circle-flags:${code.toLowerCase()}`}
                                            width={28}
                                            sx={{ mr: 1 }}
                                        />
                                        {language}
                                    </li>
                              );
                            }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Autocomplete
                            name="genre"
                            label="Genre"
                            options={['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Westerns', 'Dystopian', 'Contemporary', 'Biographies', 'Autobiographies', 'Historical', 'Horror', 'Self-Help', 'Cookbooks', 'Travel', 'Children', 'Young Adult', 'Poetry', 'Art', 'Diaries', 'Journals', 'Prayer Books', 'Series', 'Trilogy', 'Anthology', 'Encyclopedias', 'Dictionaries', 'Comics', 'Plays', 'Screenplays', 'Libretto', 'Lyrics', 'Speeches', 'Essays', 'Criticism', 'Memoirs', 'Letters', 'Audiobooks', 'Ebooks', 'Graphic Novels', 'Other']}
                            getOptionLabel={(option) => option}
                            onChange={(event, value) => setGenre(value)}
                            value={genre}
                            isOptionEqualToValue={(option, value) => option === value}
                            renderInput={(params) => (
                                <TextField {...params} label="Genre" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                              setRating(newValue);
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '100%', mt: 5 }}>
                <Grid container spacing={4} width={'100%'}>
                    {list.length > 0 && list.map((reader) => (
                        <Grid key={reader.nickname} item xs={12} md={6} lg={4} xl={3}>
                            <ReaderCard reader={reader} isGuest={isGuest} />
                        </Grid>
                    ))}

                    {list.length === 0 && (
                        <Box sx={{ width: '100%', height: '50vh' }} className='flex'>
                            <NothingTooSeePage />
                        </Box>
                    )}
                </Grid>
            </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination count={_.get(
              data, 'getListReaders.pagination.totalOfPages', 0,
            )} page={pageIndex + 1} onChange={(event, value) => {
              setPageIndex(value - 1);
            }

            } />

            </Box>
        </Box>
  );
};

export default ReadersSearch;
