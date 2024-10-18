import * as Yup from 'yup';

const UpdateReaderSchema = Yup.object().shape({

  audioDescriptionUrl: Yup.string(),
  avatarUrl: Yup.string(),
  countryAccent: Yup.string().required('Country accent is required'),
  description: Yup.string()
    .required('Description is required')
    .test('inappropriate-content', 'Description contains inappropriate content', (value) => {
    // Add your logic to check for inappropriate content here
    // Return true if the description is appropriate, false otherwise
      const inappropriateWords = ['sex', 'fuck', 'bitch', 'slut', 'asshole', 'faggot', 'nigga', 'nigger', 'retard']; // Extend this list as needed
      // Check if the description includes any inappropriate words
      const containsInappropriate = inappropriateWords.some(word => value && value.toLowerCase().includes(word));
      return !containsInappropriate; // Return false if inappropriate content is found
    }),
  introductionVideoUrl: Yup.string(),
  languages: Yup.array().required('Language is required'),
  genres: Yup.array().required('Genres is required'),
  nickname: Yup.string().required('Nickname is required'),

});

export default UpdateReaderSchema;
