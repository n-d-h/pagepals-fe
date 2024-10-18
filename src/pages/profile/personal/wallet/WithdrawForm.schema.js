import * as Yup from 'yup';

export default Yup.object().shape({
  amount: Yup.number().required('Amount is required').default(0),
  bank: Yup.string().required('Bank is required'),
  cardNumber: Yup.string().required('Card number is required'),
  cardName: Yup.string().required('Card name is required'),
});
