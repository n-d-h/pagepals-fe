import moment from 'moment';
import { useCallback, useRef, useState } from 'react';
import { showNotification } from '../../../../components/common_services/CommonServices';

// ----------------------------------------------------------------------

const useCalendar = () => {
  const calendarRef = useRef(null);

  const [date, setDate] = useState(new Date());

  const [openForm, setOpenForm] = useState(false);

  const [selectEventId, setSelectEventId] = useState('');

  const [selectedRange, setSelectedRange] = useState(null);

  const [view, setView] = useState('timeGridWeek');

  const onOpenForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const onCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectEventId('');
  }, []);

  const onInitialView = useCallback(() => {
    if (calendarRef.current) {
      const newView = 'timeGridWeek';
      onChangeView(newView);
    }
  }, [calendarRef]);

  const onChangeView = useCallback(
    (newView) => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarRef],
  );

  const onDateToday = useCallback(() => {
    if (calendarRef) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, [calendarRef]);

  const onDatePrev = useCallback(() => {
    if (calendarRef) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, [calendarRef]);

  const onDateNext = useCallback(() => {
    if (calendarRef) {
      const calendarApi = calendarRef.current.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, [calendarRef]);

  const onSelectRange = useCallback(
    (arg) => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();

        calendarApi.unselect();
      }

      if (moment(arg.start).isBefore(moment().add(1, 'day'))) {
        showNotification('error', 'You cannot create a working time before the next 24 hours');
        return;
      }

      if (moment(arg.start).isSame(moment(arg.end), 'day') === false) {
        showNotification('error', 'Working time must be in the same day');
        return;
      }

      onOpenForm();
      setSelectedRange({
        start: moment(arg.start).format(),
        end: moment(arg.end).format(),
        isRange: moment(arg.end).diff(moment(arg.start), 'hours') > 1,
      });
    },
    [calendarRef, onOpenForm],
  );

  const onDateClick = useCallback(
    (arg) => {
      const { date } = arg;

      if (moment(arg.start).isBefore(moment().add(1, 'day'))) {
        return;
      }

      onOpenForm();
      setSelectedRange({
        start: moment(date).format('LLLL'),
        end: moment(date).add(1, 'day').format('LLLL'),
      });
    },
    [onOpenForm],
  );

  const onClickEvent = useCallback(
    (arg) => {
      const { event } = arg;

      onOpenForm();
      setSelectEventId(event.id);
    },
    [onOpenForm],
  );

  const onResizeEvent = useCallback((arg, updateEvent) => {
    const { event } = arg;

    updateEvent(
      {
        id: event.id,
        start: moment(event.start).format(),
        end: moment(event.end).format(),
      },
      'resize',
    );
  }, []);

  const onDropEvent = useCallback((arg, updateEvent) => {
    const { event } = arg;
    updateEvent(
      {
        id: event.id,
        start: moment(event.start).format(),
        end: moment(event.end).format(),
      },
      'move',
    );
  }, []);

  const onClickEventInFilters = useCallback(
    (eventId) => {
      if (eventId) {
        onOpenForm();
        setSelectEventId(eventId);
      }
    },
    [onOpenForm],
  );

  return {
    //
    calendarRef,
    view,
    date,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDateClick,
    onDropEvent,
    onClickEvent,
    onChangeView,
    onSelectRange,
    onResizeEvent,
    onInitialView,
    //
    openForm,
    onOpenForm,
    onCloseForm,
    //
    selectEventId,
    selectedRange,
    //
    onClickEventInFilters,
  };
};

export default useCalendar;
