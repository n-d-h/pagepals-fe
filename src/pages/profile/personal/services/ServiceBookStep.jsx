/* eslint-disable no-unused-vars */
import { useQuery } from '@apollo/client';
import {
  Autocomplete,
  Avatar,
  Box,
  Grid,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { showNotification } from '../../../../components/common_services/CommonServices';
import Iconify from '../../../../components/iconify';
import { readerGetServicesBook } from '../../../../services/apolo/queries';

const ServiceBookStep = () => {
  const methods = useFormContext();

  const { setValue, getValues } = methods;

  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');

  const [searchBookTitle, setSearchBookTitle] = useState('');
  const [searchBookAuthor, setSearchBookAuthor] = useState('');
  const [searchBookPage, setSearchBookPage] = useState(1);

  const book = getValues('book');

  const {
    refetch: searchBookCalled,
    data: searchBook,
    loading: searchBookLoading,
    error: searchBookError,
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
		<Grid container spacing={3} mt={2}>
			<Grid item xs={12} lg={6}>
				<TextField
					fullWidth
					label="Book Title"
					value={bookTitle}
					onChange={(e) => setBookTitle(e.target.value)}
				/>
			</Grid>

			<Grid item xs={12} lg={6}>
				<TextField
					fullWidth
					label="Author"
					value={bookAuthor}
					onChange={(e) => setBookAuthor(e.target.value)}
				/>
			</Grid>

			<Grid item xs={12}>
				<Autocomplete
					disabled={!bookTitle || !bookAuthor}
					onChange={(e, value) => {
					  setValue('book', {
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
					getOptionLabel={(option) => _.get(option, 'volumeInfo.title', 'Unknown')}
					loading={searchBookLoading}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Choose Book"
							variant="outlined"
							onClick={handleSearchBook}
							InputProps={{
							  ...params.InputProps,
							  endAdornment: searchBookLoading && <Iconify icon='eos-icons:loading' />,
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
									<Box sx={{ position: 'relative', mr: 2 }}>
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
									</Box>
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
  );
};

export default ServiceBookStep;
