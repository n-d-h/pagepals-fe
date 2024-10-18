import Iconify from '../../../../components/iconify/iconify';

export const CALENDAR_VIEW_OPTIONS = [
  {
    value: 'dayGridMonth',
    label: 'Month',
    icon: <Iconify icon="carbon:calendar" width={24} height={24} />,
  },
  { value: 'timeGridWeek', label: 'Week', icon: <Iconify icon="carbon:calendar" width={24} height={24} /> },
  { value: 'timeGridDay', label: 'Day', icon: <Iconify icon="carbon:calendar" width={24} height={24} /> },
  {
    value: 'listWeek',
    label: 'Agenda',
    icon: <Iconify icon="carbon:calendar" width={24} height={24} />,
  },
];

export const CALENDAR_TIME = 30;

export const CALENDAR_INTERVAL = 30;
