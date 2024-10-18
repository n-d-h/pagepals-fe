import * as Yup from 'yup';

export default Yup.object().shape({
  amount: Yup.number().required('Amount is required').default(0),
  bankName: Yup.string().required('Bank name is required'),
  bankAccountNumber: Yup.string().required('Card number is required'),
  bankAccountName: Yup.string().required('Card name is required'),
});
