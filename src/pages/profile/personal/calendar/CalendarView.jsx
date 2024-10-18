/* eslint-disable no-unused-vars */
/* eslint-disable multiline-ternary */
import { useMutation, useQuery } from '@apollo/client';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import Calendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Card, Dialog, DialogTitle, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { handleFriendlyError, prepareDataForEventCalendar, prepareDataForWorkingTimeRangeSubmissions, prepareDataForWorkingTimeSubmissions, showNotification } from '../../../../components/common_services/CommonServices';
import { createWorkingTimeMutation, deleteWorkingTimeMutation } from '../../../../services/apolo/mutations';
import { getReaderCalendar } from '../../../../services/apolo/queries';
import BackdropLoading from '../../../backdrop_loading/BackdropLoading';
import CalendarForm from './CalendarForm';
import CalendarToolbar from './CalendarToolbar';
import { StyledCalendar } from './StyledCalendar';
import useCalendar from './useCalendarHook';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/slices/authSlice';
import moment from 'moment';

const CalendarView = () => {
  const {
    calendarRef,
    view,
    date,
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onClickEvent,
    onDateClick,
    //
    openForm,
    onCloseForm,
    onSelectRange,
    //
    selectEventId,
    selectedRange,
    //
    // onClickEventIneFilters,
  } = useCalendar();

  const readerProfile = useSelector(selectUser);

  const { data, loading, error, refetch } = useQuery(getReaderCalendar, {
    variables: {
      id: _.get(
        readerProfile,
        'reader.id',
      ),
      date: moment(date).format('YYYY-MM-DD'),
      view,
    },
    fetchPolicy: 'no-cache',
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred getting working times');
    },
  },

  );

  const [createEvent, { loading: createLoading }] = useMutation(createWorkingTimeMutation, {
    onCompleted: (data) => {
      showNotification('success', 'Working time created successfully');
    },
    onError: (e) => {
      handleFriendlyError(e, 'An error occurred');
    },
  });

  const [calendarEvents, setEvents] = useState([]);

  useEffect(() => {
    if (
      !_.get(data, 'getReaderWorkingTimesByViewAndDate.workingDates') || error
    ) return;

    const events = prepareDataForEventCalendar(_.get(data, 'getReaderWorkingTimesByViewAndDate.workingDates'));
    setEvents(events);
  }, [_.get(data, 'getReaderWorkingTimesByViewAndDate.workingDates')]);

  // // Moved inside useEffect to ensure it's not conditionally called
  useEffect(() => {
    const initialCurrentEvent = calendarEvents.find((e) => e.id === selectEventId);
    if (!initialCurrentEvent && openForm) {
      onCloseForm();
      showNotification('error', 'Cannot edit seminar');
      return;
    }
    setCurrentEvent(initialCurrentEvent);
  }, [calendarEvents, selectEventId]);

  const [currentEvent, setCurrentEvent] = useState(null);

  const [deleteWorkingTime] = useMutation(deleteWorkingTimeMutation, {
    onCompleted: () => {
      refetch();
      showNotification('success', 'Working time deleted successfully');
    },

    onError: (e) => {
      handleFriendlyError(e, 'An error occurred');
    }
    ,
  });

  const deleteEvent = (id) => {
    deleteWorkingTime({
      variables: {
        id,
      },
    });
  };

  const updateEvent = async (updatedEvent, action) => {
    let submitDataCreateWorkingTime = {};

    if (updatedEvent.isRange) {
      submitDataCreateWorkingTime = prepareDataForWorkingTimeRangeSubmissions(updatedEvent,
        _.get(
          readerProfile,
          'reader.id',
        ),
        updatedEvent.isWeekly,
      );
    } else {
      submitDataCreateWorkingTime = prepareDataForWorkingTimeSubmissions(updatedEvent,
        _.get(
          readerProfile,
          'reader.id',
        ),
        updatedEvent.isWeekly,
      );
    }

    await createEvent({
      variables: {
        ...submitDataCreateWorkingTime,
      },
    });

    await refetch();
  };

  if (loading) return <BackdropLoading />;

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
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
          {loading ? <BackdropLoading /> : (<Calendar
  weekends
            // editable
            // droppable
            selectable
            rerenderDelay={10}
            ref={calendarRef}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            events={calendarEvents}
            headerToolbar={false}
            dateClick={onDateClick}

            select={onSelectRange}
            eventClick={(arg) => {
              onClickEvent(arg);
            }}
            eventDrop={(arg) => {
              onDropEvent(arg, updateEvent);
            }}
            plugins={[
              listPlugin,
              dayGridPlugin,
              timelinePlugin,
              timeGridPlugin,
              interactionPlugin,
            ]}
          />)}

        </StyledCalendar>
      </Card>

      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={onCloseForm}>
        <DialogTitle>
          <Typography variant="h4">
            {currentEvent ? 'Edit Working Time' : 'Add Working Time'}
          </Typography>
        </DialogTitle>

        <CalendarForm
          currentEvent={currentEvent}
          selectedRange={selectedRange}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          onClose={onCloseForm}
          createLoading={createLoading}
        />
      </Dialog>
    </>
  );
};

export default CalendarView;
