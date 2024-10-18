import { useMutation } from '@apollo/client';
import { Box, Button, Grid, Paper, Step, StepContent, StepLabel, Stepper, Typography, alpha } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { storage } from '../../../../auth/firebase';
import { handleFriendlyError, showNotification } from '../../../../components/common_services/CommonServices';
import { paths } from '../../../../components/router/paths';
import { selectUser } from '../../../../redux/slices/authSlice';
import { createSeminarMutation, createServiceMutation } from '../../../../services/apolo/mutations';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import CreateStep1 from '../../../profile/personal/services/create/CreateStep1';
import CreateStep3 from '../../../profile/personal/services/create/CreateStep3';
import CreateSeminarStep2 from './CreateSeminarStep2';

const steps = [
  {
    label: 'Seminar Book',
    description: `For each seminar that you create, you have to describe the book that the seminar is related to.
                    You can search and select the book from the list of books that system provides,
                    or you can create a new book if the book is not available in the list.`,
  },
  {
    label: 'Seminar Info',
    description: `To create a seminar, you have to select the type of service from the list 
                    of service types that system provides then input the price and the image for your service.`,
  },
  {
    label: 'Seminar Description',
    description: 'To finish creating the seminar, you have to provide a description for the seminar.',
  },
];

export default function CreateSeminarStepper() {
  const navigate = useNavigate();
  const userProfile = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const [errorStep1, setErrorStep1] = useState(false);
  const [errorStep2, setErrorStep2] = useState(false);
  const [errorStep3, setErrorStep3] = useState(false);

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

  const [createSeminar, { loading: createLoading }] = useMutation(createSeminarMutation, {
    onCompleted: () => {
      showNotification('success', 'Seminar created successfully');
    },

    onError: (e) => {
      showNotification('error', 'Exceed the limit of seminar request (2 per week). Please wait for the admin to approve your seminar request.');
    },
  });

  const handleNext = async () => {
    if (activeStep === 0) {
      if (currentTab === 'one') {
        if (!book.id) {
          setErrorStep1(true);
          return;
        }
      } else {
        if (!newBook.volumeInfo.title || !newBook.volumeInfo.authors || !newBook.volumeInfo.categories || !newBook.volumeInfo.description ||
          !newBook.volumeInfo.language || !newBook.volumeInfo.pageCount || !newBook.volumeInfo.publishedDate || !newBook.volumeInfo.publisher ||
          !bookFile
        ) {
          setErrorStep1(true);
          return;
        }
      }
      setErrorStep1(false);
    } else if (activeStep === 1) {
      if (!seminarFile) {
        setErrorStep2(true);
        return;
      }

      if (!seminarTitle) {
        setErrorStep2(true);
        return;
      }
      setErrorStep2(false);
    }

    if (activeStep === 2) {
      if (!description) {
        setErrorStep3(true);
        return;
      }
      setErrorStep3(false);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreate = async () => {
    if (currentTab === 'one') {
      const seminarImageUrl = await Promise.resolve(handleUploadFileToFirebaseAndSetToForm(seminarFile));
      if (!seminarImageUrl) {
        showNotification('error', 'An error occurred during file upload 2.');
        return;
      }
      await createSeminar({
        variables: {
          seminar: {
            readerId: _.get(userProfile, 'reader.id', ''),
            book,
            title: seminarTitle,
            description,
            imageUrl: seminarImageUrl,
            duration,
          },
        },
      }).then((result) => {
        navigate(paths.main.editSeminar(result.data.createSeminarRequest.id), { replace: true });
      });
    } else {
      const [newBookImageUrl, seminarImageUrl] = await Promise.all([
        handleUploadFileToFirebaseAndSetToForm(bookFile),
        handleUploadFileToFirebaseAndSetToForm(seminarFile),
      ]);
      if (!newBookImageUrl || !seminarImageUrl) {
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
      await createSeminar({
        variables: {
          seminar: {
            book: updatedNewBook,
            readerId: _.get(userProfile, 'reader.id', ''),
            title: seminarTitle,
            description,
            imageUrl: seminarImageUrl,
            duration,
          },
        },
      }).then((result) => {
        navigate(paths.main.editSeminar(result.data.createSeminarRequest.id), { replace: true });
      });
    }
  };

  const [book, setBook] = useState({
    id: null,
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
  const [seminarFile, setSeminarFile] = useState(null);
  const [seminarTitle, setSeminarTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [currentTab, setCurrentTab] = useState('one');

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
          <Typography variant="body1" color={'#118D57'} textAlign={'center'} fontWeight={600}>Create Seminar Request</Typography>
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
                  error={index === 0 ? errorStep1 : index === 1 ? errorStep2 : errorStep3}
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
                    <CreateSeminarStep2
                      file={seminarFile}
                      setFile={setSeminarFile}
                      duration={duration}
                      setDuration={setDuration}
                      title={seminarTitle}
                      setTitle={setSeminarTitle}
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
          {activeStep === steps.length && (
            <Paper
              sx={{
                p: 3,
                mt: 3,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>All steps completed - Let's create a seminar request now</Typography>
              <Typography color="text.secondary" sx={{ mb: 0.4, fontSize: 12 }}>
                Note 1: After successfully creating your seminar request, please wait for the admin's approval before creating the seminar event.
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2.5, fontSize: 12 }}>
                Note 2: You can view your seminar request in the list of seminars with a pending state after it's created.
              </Typography>
              <Button variant="contained" onClick={handleCreate} sx={{ fontWeight: 'bold', textTransform: 'none' }}>Create Now</Button>
            </Paper>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
