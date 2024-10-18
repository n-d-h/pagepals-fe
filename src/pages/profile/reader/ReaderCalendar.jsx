import { Box } from '@mui/material';
import { Calendar } from 'react-date-range';
import PropTypes from 'prop-types';
import moment from 'moment';

const ReaderCalendar = ({ currentDate, handleChangeDate, workDays }) => {
  return (
		<Box
			sx={{
			  width: '100%',
			  height: '100%',
			  display: 'flex',
			  justifyContent: 'center',
			  alignContent: 'center',
			}}
		>
			<Calendar
				color={'#00A76F'}
				onChange={(item) => handleChangeDate(item)}
				date={currentDate}
				minDate={new Date()}
				disabledDay={(day) => {
				  return !workDays.some((date) => {
				    return moment(date).isSame(day, 'day');
				  });
				}}
			/>
		</Box>
  );
};

export default ReaderCalendar;

ReaderCalendar.propTypes = {
  currentDate: PropTypes.instanceOf(Date),
  handleChangeDate: PropTypes.func,
};
