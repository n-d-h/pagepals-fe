/* eslint-disable multiline-ternary */
import { useQuery } from '@apollo/client';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Calendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Card } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router';
import openDeleteDialog from '../../../../components/animate/dialog/DeleteDialog';
import { useDialog } from '../../../../components/animate/dialog/DialogProvider';
import { prepareCalendarDataForCustomerBooking, showNotification } from '../../../../components/common_services/CommonServices';
import { selectUser } from '../../../../redux/slices/authSlice';
import {
  getProfileSchedule,
} from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import CalendarToolbar from '../calendar/CalendarToolbar';
import { StyledCalendar } from '../calendar/StyledCalendar';
import useCalendar from '../calendar/useCalendarHook';

const CalendarSchedule = () => {
  const {
    calendarRef,
    view,
    date,
    onDatePrev,
    onDateNext,
    onDateToday,
    onChangeView,
  } = useCalendar();

  const userProfile = useSelector(selectUser);

  const handleQueryVariables = () => ({
    variables: {
      id: _.get(userProfile, 'customer.id', ''),
      filter: {
        page: 0,
        pageSize: 100,
        sort: '',
        bookingState: 'PENDING',
      },
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: customerData,
    loading: customerLoading,
  } = useQuery(getProfileSchedule, handleQueryVariables());

  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const [openJoinDialog, closeJoinDialog] = useDialog();
  const handleJoinClick = (data) => {
    openDeleteDialog({
      title: 'Join Room',
      content: 'Are you sure you want to join this conference?',
      dialog: [openJoinDialog, closeJoinDialog],
      dialogProps: {
        buttonStyle: {
          primary: true,
          variant: 'contained',
        },
      },
    }).then((result) => {
      if (result) {
        const path = generatePath('/meeting-zoom/:MeetingID/:role/detail', {
          MeetingID: _.get(data, 'row.meeting.meetingCode'),
          role: 0,
        });

        navigate(path);
      }
    });
  };

  const handleOnClickEvent = (event) => {
    const initialCurrentEvent = events.find((e) => e.id === event.id);
    const startAtMoment = moment(initialCurrentEvent.start).format('LLLL'); // Converts the startAt to a moment object
    const endAt = moment(initialCurrentEvent.end).format('LLLL'); // This calculates the end time by adding the duration to startAt
    const now = moment(); // Gets the current time

    if (
      now.isSameOrAfter(startAtMoment) && now.isSameOrBefore(endAt)
    ) {
      handleJoinClick(initialCurrentEvent);
    } else {
      showNotification('warning', 'The meeting has not started yet', {
        position: 'top-center',
        autoClose: 2000,
        newestOnTop: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    if (customerData) {
      const list = _.get(customerData, 'getListBookingByCustomer.list', []);
      const eventsList = prepareCalendarDataForCustomerBooking(list);
      setEvents(eventsList);
    }
  }, [customerData]);

  if (customerLoading) {
    return <BackdropLoading />;
  }

  return (
		<>
			<Card
				sx={{
				  borderRadius: 4,
				  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				}}
			>
				<StyledCalendar>
					<CalendarToolbar
						date={date}
						view={view}
						onNextDate={onDateNext}
						onPrevDate={onDatePrev}
						onToday={onDateToday}
						onChangeView={onChangeView}
					/>
					<Calendar
						weekends
						rerenderDelay={10}
						ref={calendarRef}
						initialDate={date}
						initialView={view}
						dayMaxEventRows={3}
						eventDisplay="block"
						events={events}
						headerToolbar={false}
						eventClick={(arg) => {
						  const { event } = arg;
						  handleOnClickEvent(event);
						}}
						plugins={[
						  listPlugin,
						  dayGridPlugin,
						  timelinePlugin,
						  timeGridPlugin,
						  interactionPlugin,
						]}
					/>
				</StyledCalendar>
			</Card>

		</>
  );
};

export default CalendarSchedule;
