import { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { storage } from '../../../../../auth/firebase';
import { handleFriendlyError, showNotification } from '../../../../../components/common_services/CommonServices';
import { paths } from '../../../../../components/router/paths';
import { selectUser } from '../../../../../redux/slices/authSlice';
import { selectRevenueShare } from '../../../../../redux/slices/settingsSlice';
import { createServiceMutation } from '../../../../../services/apolo/mutations';
import { getReaderServiceType } from '../../../../../services/apolo/queries';
import BackdropLoading from '../../../../backdrop_loading/BackdropLoading';
import CreateStep1 from './CreateStep1';
import CreateStep2 from './CreateStep2';
import CreateStep3 from './CreateStep3';

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Service Book',
    description: `For each service that you create, you have to describe the book that the service is related to.
                  You can search and select the book from the list of books that system provides,
                  or you can create a new book if the book is not available in the list.`,
  },
  {
    label: 'Service Info',
    description: `To create a service, you have to select the type of service from the list 
                  of service types that system provides then input the price and the image for your service.`,
  },
  {
    label: 'Service Description',
    description: 'To finish creating the service, you have to provide a description for the service.',
  },
];

export default function CreateServiceStepper() {
  const navigate = useNavigate();
  const userProfile = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  // _.get(userProfile, 'reader.id', ''),

  const [step1Error, setStep1Error] = useState(false);
  const [step2Error, setStep2Error] = useState(false);
  const [step3Error, setStep3Error] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const handleUploadFileToFirebaseAndSetToForm = async (file) => {
    if (!file) return null;

    if (typeof file === 'string') return file;

    setIsLoading(true);
    try {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      setIsLoading(false);
      return downloadURL;
    } catch (error) {
      setIsLoading(false);
      showNotification('error', 'An error occurred during file upload 1.');
    }
  };

  const [createService, { loading: createLoading }] = useMutation(createServiceMutation, {
    onCompleted: () => {
      showNotification('success', 'Service created successfully');
    },

    onError: (e) => {
      handleFriendlyError(e, 'Failed to create service');
    },
  });

  const handleNext = async () => {
    if (activeStep === 0) {
      if (currentTab === 'one') {
        if (!book.id) {
          setStep1Error(true);
          return;
        }
      } else {
        if (!newBook.volumeInfo.title || !newBook.volumeInfo.authors || !newBook.volumeInfo.categories || !newBook.volumeInfo.description ||
          !newBook.volumeInfo.language || !newBook.volumeInfo.pageCount || !newBook.volumeInfo.publishedDate || !newBook.volumeInfo.publisher ||
          !bookFile
        ) {
          setStep1Error(true);
          return;
        }
      }

      setStep1Error(false);
    }

    if (activeStep === 1) {
      if (!serviceType || !serviceFile || !price || !shortDescription) {
        setStep2Error(true);
        return;
      }
      setStep2Error(false);
    }

    if (activeStep === 2) {
      if (!description) {
        setStep3Error(true);
        return;
      }

      setStep3Error(false);

      if (currentTab === 'one') {
        const serviceImageUrl = await Promise.resolve(handleUploadFileToFirebaseAndSetToForm(serviceFile));
        if (!serviceImageUrl) {
          showNotification('error', 'An error occurred during file upload 2.');
          return;
        }
        await createService({
          variables: {
            service: {
              book,
              readerId: _.get(userProfile, 'reader.id', ''),
              shortDescription,
              description,
              price,
              serviceTypeId: serviceType.id,
              imageUrl: serviceImageUrl,
              duration: 60,
            },
          },
        }).then((result) => {
          navigate(paths.main.readerServiceDetail(result.data.createService.id), { replace: true });
        });
      } else {
        const [newBookImageUrl, serviceImageUrl] = await Promise.all([
          handleUploadFileToFirebaseAndSetToForm(bookFile),
          handleUploadFileToFirebaseAndSetToForm(serviceFile),
        ]);
        if (!newBookImageUrl || !serviceImageUrl) {
          showNotification('error', 'An error occurred during file upload 2.');
          return;
        }

        const updatedVolumeInfo = {
          ...newBook.volumeInfo,
          imageLinks: {
            thumbnail: newBookImageUrl,
            smallThumbnail: newBookImageUrl,
          },
        };

        const updatedNewBook = {
          ...newBook,
          volumeInfo: updatedVolumeInfo,
        };
        await createService({
          variables: {
            service: {
              book: updatedNewBook,
              readerId: _.get(userProfile, 'reader.id', ''),
              shortDescription,
              description,
              price,
              serviceTypeId: serviceType.id,
              imageUrl: serviceImageUrl,
              duration: 60,
            },
          },
        }).then((result) => {
          navigate(paths.main.readerServiceDetail(result.data.createService.id), { replace: true });
        });
      }
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');
  const title = urlParams.get('title') || '';

  const [book, setBook] = useState({
    id: bookId || null,
    volumeInfo: {
      title: title,
      authors: [],
      categories: [],
      imageLinks: {
        thumbnail: '',
        smallThumbnail: '',
      },
      description: '',
      language: '',
      pageCount: 0,
      publishedDate: new Date(),
      publisher: '',
    },
  });
  const [newBook, setNewBook] = useState({
    id: '',
    volumeInfo: {
      title: '',
      authors: [],
      categories: [],
      imageLinks: {
        thumbnail: '',
        smallThumbnail: '',
      },
      description: '',
      language: '',
      pageCount: 0,
      publishedDate: new Date(),
      publisher: '',
    },
  });
  const [description, setDescription] = useState('');
  const [bookFile, setBookFile] = useState(null);
  const [serviceFile, setServiceFile] = useState(null);
  const [serviceType, setServiceType] = useState(null);
  const [price, setPrice] = useState(1);
  const [shortDescription, setShortDescription] = useState('');
  const [currentTab, setCurrentTab] = useState('one');

  const { data, loading } = useQuery(getReaderServiceType, {
    onError: (e) => {
      handleFriendlyError(e, 'Failed to fetch service type. Try again later.');
    },
  });

  const revenueShared = useSelector(selectRevenueShare);

  if (isLoading || createLoading) return <BackdropLoading />;

  return (
    <Grid container spacing={2} alignItems={'start'} sx={{ width: '100%', height: '100%' }}>
      <Grid item xs={12} lg={12}>
        <Box sx={{
          py: 1,
          width: '30%',
          borderRadius: 1,
          border: '1px solid #b3d1b5',
          boxShadow: 'rgba(34, 197, 94, 0.16) 0px 7px 29px 0px',
          backgroundColor: 'rgba(34, 197, 94, 0.16)',
        }}>
          <Typography variant="body1" color={'#118D57'} textAlign={'center'} fontWeight={600}>Create Service</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Box sx={{
          width: '100%',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: 'white',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          padding: 2,
        }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={index === 2 ? <Typography variant="caption">Last step</Typography> : null}
                  error={index === 0 ? step1Error : index === 1 ? step2Error : step3Error}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography color={'GrayText'} sx={{ opacity: '0.7' }} >{step.description}</Typography>
                  {index === 0 &&
                    <CreateStep1
                      book={book}
                      newBook={newBook}
                      setBook={setBook}
                      setNewBook={setNewBook}
                      file={bookFile}
                      setFile={setBookFile}
                      currentTab={currentTab}
                      setCurrentTab={setCurrentTab}
                    />}
                  {index === 1 &&
                    <CreateStep2
                      data={data}
                      loading={loading}
                      revenueShared={revenueShared}
                      file={serviceFile}
                      setFile={setServiceFile}
                      serviceType={serviceType}
                      setServiceType={setServiceType}
                      price={price}
                      setPrice={setPrice}
                      shortDescription={shortDescription}
                      setShortDescription={setShortDescription}
                    />}
                  {index === 2 && <CreateStep3 description={description} setDescription={setDescription} />}
                  <Box sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={handleNext}>
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    {index > 0 && (
                      <Button onClick={handleBack}>
                        Back
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* {activeStep === steps.length && (
            <Paper
              sx={{
                p: 3,
                mt: 3,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Typography sx={{ mb: 2 }}>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset}>Reset</Button>
            </Paper>
          )} */}
        </Box>
      </Grid>
    </Grid>
  );
}
