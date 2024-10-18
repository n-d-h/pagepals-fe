import { useQuery } from '@apollo/client';
import { AccordionSummary, Autocomplete, Box, Card, CardContent, CardHeader, Grid, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router';
import Editor from '../../../../components/editor/editor';
import Iconify from '../../../../components/iconify';
import Upload from '../../../../components/shadcn-ui/upload/upload';
import { getServicebyId } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import ReaderBookCardV2 from '../../reader/ReaderBookCardV2';
import ReaderServiceModify from './ReaderServiceModify';

const ReaderServiceDetail = () => {
  const [file, setFile] = useState(null);
  const id = useParams().id;

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        }),
      );
    }
  }, [setFile]);

  const { data, loading: serviceDetailLoading, error } = useQuery(getServicebyId, {
    variables: {
      id,
    },
    fetchPolicy: 'no-cache',
  });
  const bookData = data?.serviceById?.book || {};
  const [book, setBook] = useState(bookData);
  const [expanded, setExpanded] = useState({});

  const desHTML = data?.serviceById?.description || '';
  const image = _.get(data, 'serviceById.imageUrl', null);
  const serviceType = _.get(data, 'serviceById.serviceType', null);
  const priceData = _.get(data, 'serviceById.price', 0);
  const shortDescriptionData = data?.serviceById?.shortDescription || '';

  const [price, setPrice] = useState(priceData);
  const [description, setDescription] = useState(desHTML);
  const [shortDescription, setShortDescription] = useState(shortDescriptionData);

  const [loading, setLoading] = useState(serviceDetailLoading);
  useEffect(() => {
    setDescription(desHTML);
    setFile(image);
    setPrice(priceData);
    setBook(bookData);
    setLoading(serviceDetailLoading);
    setShortDescription(shortDescriptionData)
  }, [desHTML, image, priceData, bookData, serviceDetailLoading, loading, shortDescriptionData]);

  if (!desHTML || !image || !serviceType || !priceData || !bookData || loading) {
    return <BackdropLoading />;
  }

  // if (loading) return <BackdropLoading />;

  if (error) {
    return <Typography>Something went wrong!</Typography>;
  }

  return (
    <Grid container spacing={2} alignItems={'start'} sx={{ width: '100%', height: '100%' }}>
      <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          width: '70%',
        }}>
          <Box sx={{
            py: 1,
            width: '30%',
            borderRadius: 1,
            border: '1px solid #b3d1b5',
            boxShadow: 'rgba(34, 197, 94, 0.16) 0px 7px 29px 0px',
            backgroundColor: 'rgba(34, 197, 94, 0.16)',
          }}>
            <Typography variant="body1" color={'#118D57'} textAlign={'center'} fontWeight={600}>Service info</Typography>
          </Box>
          <Box sx={{
            px: 2,
            py: 1,
            borderRadius: 1,
            border: '1px solid #e0e0e0',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            alignItems: 'center',
          }}>
            <Iconify icon="bi:clock" width={20} height={20} color="black" />
            <Typography variant="body1" color={'black'} textAlign={'center'} fontWeight={600}>60 minutes</Typography>
          </Box>
        </Box>

        <ReaderServiceModify
          shortDescription={shortDescription}
          description={description}
          image={file || image}
          serviceTypeId={serviceType?.id}
          price={Number(price)}
          serviceId={id}
          setLoading={setLoading}
          bookId={book?.id} />
      </Grid>
      <Grid item xs={12} md={12}>

        <AccordionSummary
          expanded={
            expanded[book.id]
          }
          onClick={() => {
            setExpanded({
              ...expanded,
              [book.id]: !expanded[book.id],
            });
          }}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: 'white',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            p: 2,
          }}
        >
          <ReaderBookCardV2
            book={book} option={'noView'} wrapperStyles={{
              p: 0,
            }}
            open={expanded[book.id]}
            seeMore={true}
          />
        </AccordionSummary>
      </Grid>
      <Grid item xs={12} md={8}>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Service Description" />
            <CardContent>
              <Editor
                id="full-editor"
                initialValue={description}
                setValue={setDescription}
              />
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Service Image" />
            <CardContent>
              <Upload
                file={file}
                maxSize={3145728}
                onDrop={handleDropSingleFile}
                onDelete={() => setFile(null)} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Service Type" />
            <CardContent>
              <Autocomplete
                name="serviceType"
                label="Service Type"
                disabled
                readOnly={true}
                options={['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Westerns', 'Dystopian', 'Contemporary', 'Biographies', 'Autobiographies', 'Historical', 'Horror', 'Self-Help', 'Cookbooks', 'Travel', 'Children', 'Young Adult', 'Poetry', 'Art', 'Diaries', 'Journals', 'Prayer Books', 'Series', 'Trilogy', 'Anthology', 'Encyclopedias', 'Dictionaries', 'Comics', 'Plays', 'Screenplays', 'Libretto', 'Lyrics', 'Speeches', 'Essays', 'Criticism', 'Memoirs', 'Letters', 'Audiobooks', 'Ebooks', 'Graphic Novels', 'Other']}
                getOptionLabel={(option) => option}
                onChange={(event, value) => { console.log(value); }}
                value={serviceType?.name}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField {...params} />
                )}
              />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Service Short Description" />
            <CardContent>
              <TextField
                fullWidth
                name="shortDescription"
                required
                value={shortDescription}
                multiline
                helperText=
                {`length: ${shortDescription?.length || 0}/120`}
                FormHelperTextProps={{
                  sx: {
                    textAlign: 'right'
                  }
                }}
                inputProps={{ maxLength: 120 }}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#e0e0e0',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}>
          <Card>
            <CardHeader title="Service Price" />
            <CardContent>
              <TextField
                fullWidth
                name="price"
                required
                value={price}
                helperText=
                {'Income will be deducted 10% of the total price.'}
                inputProps={{
                  min: 1,
                  step: 1,
                }}
                type="number"
                InputProps={{
                  endAdornment: <Typography variant="subtitle1" sx={{ color: 'green' }}>pals</Typography>,
                }}
                onChange={(e) => setPrice(e.target.value)}
              />
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid >
  );
};

export default ReaderServiceDetail;
