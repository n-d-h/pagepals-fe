import * as Yup from 'yup';

export const EventSchema = Yup.object().shape({
  advertiseEndAt: Yup.string().default(''),
  advertiseStartAt: Yup.string().default(''),
  isFeatured: Yup.boolean().default(false),
  limitCustomer: Yup.number().required('Limit Customer is required'),
  price: Yup.number().default(0).required('Price is required'),
  startAt: Yup.string().required('Start Date is required'),
});
