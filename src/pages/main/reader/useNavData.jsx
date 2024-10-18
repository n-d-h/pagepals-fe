import { useMemo } from 'react';
import Iconify from '../../../components/iconify';
import { paths } from '../../../components/router/paths';

const icon = (name, props) => (
  <Iconify icon={name} {...props} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  mainReader: icon('solar:chart-bold'),
  editReader: icon('ph:book-open-user-fill'),
  schedule: icon('healthicons:group-discussion-meetingx3'),
  wallet: icon('solar:wallet-bold'),
  seminar: icon('ph:video-conference-fill'),
  services: icon('iconamoon:category-fill'),
  calendar: icon('solar:calendar-bold'),

};

// ----------------------------------------------------------------------

export function useNavDataReader () {
  const navReader = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Reader',
        items: [
          // { title: 'Edit', path: paths.main.editReader, icon: ICONS.editReader },
          { title: 'Detail', path: paths.main.reader, icon: ICONS.editReader },
          { title: 'Meetings', path: paths.main.schedule, icon: ICONS.schedule },
          { title: 'Services', path: paths.main.services, icon: ICONS.services },
          { title: 'Seminars', path: paths.main.seminar, icon: ICONS.seminar },
          { title: 'Calendar', path: paths.main.calendar, icon: ICONS.calendar },
          { title: 'Wallet', path: paths.main.wallet, icon: ICONS.wallet },
          // { title: 'Dashboard', path: paths.main.reader, icon: ICONS.mainReader },
          { title: 'Dashboard', path: paths.main.dashboard, icon: ICONS.mainReader },
        ],
      },
    ],
    [],
  );

  return navReader;
}
