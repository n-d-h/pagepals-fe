import * as Yup from 'yup';

const EventSchema = Yup.object().shape({
  start: Yup.mixed(),
  end: Yup.mixed(),
});

export default EventSchema;
