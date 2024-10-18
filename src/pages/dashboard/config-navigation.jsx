import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Iconify from '../../components/iconify';
import { paths } from '../../components/router/paths';
import { selectUserRole } from '../../redux/slices/authSlice';

// ----------------------------------------------------------------------

const icon = (name, props) => (
  <Iconify icon={name} {...props} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('material-symbols:mail'),
  analytics: icon('clarity:analytics-solid'),
  user: icon('carbon:user-role'),
  staff: icon('mdi:user-badge'),
  customer: icon('fluent:person-note-24-filled'),
  reader: icon('fluent:chart-person-24-filled'),
  request: icon('basil:folder-user-solid'),
  report: icon('fluent:comment-error-16-filled'),
  setting: icon('uiw:setting'),
  seminar: icon('carbon:calendar'),
};

// ----------------------------------------------------------------------

export function useNavData () {
  const role = useSelector(selectUserRole);

  const navAdmin = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Main',
        items: [
          { title: 'overview', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'analytics', path: paths.dashboard.analytics, icon: ICONS.analytics },
        ],
      },

      // MANAGEMENT FOR ADMIN
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'staff',
            path: paths.dashboard.staffManagement,
            icon: ICONS.staff,
          },
          {
            title: 'setting',
            path: paths.dashboard.settingManagement,
            icon: ICONS.setting,
          },
        ],
      },
    ],
    [],
  );

  const navStaff = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Main',
        items: [
          { title: 'overview', path: paths.dashboard.root, icon: ICONS.dashboard },
        ],
      },

      // MANAGEMENT FOR STAFF
      // ----------------------------------------------------------------------
      {
        subheader: 'user management',
        items: [
          {
            title: 'customer',
            path: paths.dashboard.customerManagement,
            icon: ICONS.customer,
          },
          {
            title: 'reader',
            path: paths.dashboard.readerManagement,
            icon: ICONS.reader,
          },
        ],
      },

      // MANAGEMENT REQUEST
      // ----------------------------------------------------------------------
      {
        subheader: 'request management',
        items: [
          {
            title: 'request',
            path: paths.dashboard.readerRequestManagement,
            icon: ICONS.request,
            children: [
              { title: 'Become reader', path: paths.dashboard.readerRequestManagement },
              // { title: 'Update profile', path: paths.dashboard.updateRequestManagement },
              { title: 'Withdrawal', path: paths.dashboard.withdrawalRequestManagement },

              { title: 'Seminar', path: paths.dashboard.seminarManagement },
            ],
          },
        ],
      },

      // MANAGEMENT REPORT
      // ----------------------------------------------------------------------
      {
        subheader: 'report management',
        items: [
          {
            title: 'report',
            path: paths.dashboard.reportBookingManagement,
            icon: ICONS.report,
            children: [
              { title: 'Booking', path: paths.dashboard.reportBookingManagement },
              { title: 'Reader', path: paths.dashboard.reportReaderManagement },
            ],
          },
        ],
      },

    ],
    [],
  );

  return role === 'ADMIN' ? navAdmin : navStaff;
}
