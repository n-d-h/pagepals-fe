import * as Yup from 'yup';

export const ServicesSchema = Yup.object().shape({
  price: Yup.number().required('Price is required'),
  description: Yup.string().required('Description is required'),
  duration: Yup.number().required('Duration is required'),
  readerId: Yup.string().required('Reader ID is required'),
  book: Yup.object(),
});
