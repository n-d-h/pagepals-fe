import * as Yup from 'yup';

export const SeminarSchema = Yup.object().shape({
  price: Yup.number().required('Price is required'),
  description: Yup.string().required('Description is required'),
  duration: Yup.number().required('Duration is required'),
  readerId: Yup.string().required('Reader ID is required'),
  book: Yup.object(),
  title: Yup.string().required('Title is required'),
  limitCustomer: Yup.number().required('Limit customer is required'),
  activeSlot: Yup.number().required('Active slot is required'),
  imageUrl: Yup.string().required('Image URL is required'),
});
