import { AES, enc, mode, pad } from 'crypto-js';
import { uniqueId } from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';

export function showNotification (type, message, config) {
  let showMessage;
  if (type === 'success') showMessage = toast.success;
  else if (type === 'info') showMessage = toast.info;
  else if (type === 'warning') showMessage = toast.warning;
  else if (type === 'error') showMessage = toast.error;
  else showMessage = toast;
  showMessage(message, {
    position: 'bottom-right',
    autoClose: 3000,
    newestOnTop: true,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
    theme: 'colored',
    ...config,
  });
}

export const decodeVerificationCode = (encodedCode) => {
  const key = enc.Utf8.parse(import.meta.env.VITE_CRYPTO_SECRET_KEY);
  const decryptedBytes = AES.decrypt(encodedCode, key, {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  });
  const decodedCode = decryptedBytes.toString(enc.Utf8);

  return decodedCode;
};

export const prepareDataForEventCalendar = (data) => {
  const events = [];
  data.forEach((workingDate) => {
    const date = workingDate.date;
    workingDate.timeSlots.forEach((timeSlot) => {
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.S'; // Specify your date format
      const startTimeFormat = 'HH:mm:ss'; // Specify your time format
      const dateTimeFormat = `${dateFormat} ${startTimeFormat}`; // Combine formats for date and time

      // Parse the date and startTime using the specified format
      const startMoment = moment(
				`${moment(date).format('YYYY-MM-DD')} ${timeSlot.startTime}`,
				dateTimeFormat,
      );

      const endMoment = moment(
        `${moment(date).format('YYYY-MM-DD')} ${timeSlot.endTime}`,
        dateTimeFormat,
      );

      const event = {
        id: timeSlot.id || (timeSlot.isSeminar && uniqueId('seminar-')),
        title: timeSlot.isSeminar ? 'Seminar' : timeSlot.isBooked ? 'Service Booked' : 'Service',
        color: timeSlot.isSeminar ? '#FFD666' : timeSlot.isBooked ? '#F4F6F8' : '#00A76F',
        textColor: timeSlot.isSeminar ? '#FFD666' : timeSlot.isBooked ? '#808080' : '#00A76F',
        start: startMoment.valueOf(), // Convert to Unix timestamp
        end: endMoment.valueOf(), // Add 1 hour for the end time
      };
      events.push(event);
    });
  });
  return events;
};

export const prepareDataForWorkingTimeSubmissions = (time, readerId, isWeekly = false) => {
  return {
    workingTime: {
      readerId,
      isWeekly,
      list: [
        {
          date: moment(time.startTime).format('YYYY-MM-DD'),
          startTime: moment(time.startTime).format('YYYY-MM-DD HH:mm:ss'),
          duration: 60,
          // endTime: moment(time.endTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
    },
  };
};

export const prepareDataForWorkingTimeRangeSubmissions = (time, readerId, isWeekly = false) => {
  let startTime = moment(time.startTime);
  const endTime = moment(time.endTime);
  const list = [];

  while (startTime < endTime) {
    const nextHour = moment(startTime).add(1, 'hours');
    list.push({
      date: startTime.format('YYYY-MM-DD'),
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      duration: 60,
    });
    startTime = nextHour; // Correctly update the startTime to the next hour
  }

  return {
    workingTime: {
      readerId,
      isWeekly,
      list,
    },
  };
};

export const roundedTimeToADefinedInterval = (
  time = Date.now(),
  timeInterval = 60,
  roundingMethod = 'floor',
  format = 'LLL',
) => {
  // Convert the time to a moment object
  const momentTime = moment(time);

  // Calculate the total minutes from the start of the day
  const totalMinutes = momentTime.hours() * 60 + momentTime.minutes();

  // Calculate the rounded minutes based on the rounding method
  let roundedMinutes;
  switch (roundingMethod) {
    case 'ceil':
      roundedMinutes = Math.ceil(totalMinutes / timeInterval) * timeInterval;
      break;
    case 'floor':
      roundedMinutes = Math.floor(totalMinutes / timeInterval) * timeInterval;
      break;
    case 'round':
      roundedMinutes = Math.round(totalMinutes / timeInterval) * timeInterval;
      break;
    default:
      roundedMinutes = totalMinutes; // No rounding
  }

  // Set the rounded time
  momentTime.startOf('day').add(roundedMinutes, 'minutes');

  // Format and return the rounded time
  return momentTime.format(format);
};

export const prepareCalendarDataForCustomerBooking = (data) => {
  const events = [];
  data.forEach((booking) => {
    const event = {
      id: booking.id,
      title: _.get(
        booking,
        'service.book.title',
        'No title available',
      ),
      start: moment(booking.startAt).valueOf(),
      end: moment(booking.startAt).add(60, 'minutes').valueOf(),
      backgroundColor: '#00A76F',
      borderColor: '#00A76F',
      textColor: '#00A76F',
      row: {
        service: {
          duration: 60,
        },
        meeting: {
          meetingCode:
          _.get(booking, 'meeting.meetingCode', 'No meeting code available'),
        },
      },
    };
    events.push(event);
  });
  return events;
};

export const handleFriendlyError = (error, message) => {
  if (_.get(error, 'graphQLErrors[0].extensions.status') &&
  _.get(error, 'graphQLErrors[0].extensions.status') !== 500
  ) {
    showNotification('error', _.get(error, 'message'));
  } else {
    showNotification('error', message);
  }
};

export function isScrollToBottom (event) {
  const element = event.currentTarget;

  return isElementScrolledToBottom(element);
}

function isElementScrolledToBottom (element) {
  const scrollPosition = element.scrollTop;
  const visibleHeight = element.clientHeight;
  const contentHeight = element.scrollHeight;

  // Account for the zoom level
  const zoomLevel = document.documentElement.clientWidth / window.innerWidth;
  const adjustedVisibleHeight = visibleHeight * zoomLevel;
  const adjustedContentHeight = contentHeight * zoomLevel;

  // Consider a small threshold to account for rounding errors
  const threshold = 1;

  return (
    adjustedVisibleHeight + scrollPosition + threshold >= adjustedContentHeight
  );
}
