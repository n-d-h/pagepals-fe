import { Suspense } from 'react';
import { Outlet } from 'react-router';
import AuthGuard from '../../auth/AuthGuard';
import { LoadingPage } from '../../pages/LoadingPage';
import DashboardLayout from '../../pages/dashboard';
import AnalyticScreen from '../../pages/dashboard/analytics/AnalyticScreen';
import CustomerManagementScreen from '../../pages/dashboard/customer_management/CustomerManagementScreen';
import OverviewScreen from '../../pages/dashboard/overview/OverviewScreen';
import ReaderManagementScreen from '../../pages/dashboard/reader_management/ReaderManagementScreen';
import ReaderRequestDetailScreen from '../../pages/dashboard/reader_request_management/ReaderRequestDetailScreen';
import ReaderRequestManagementScreen from '../../pages/dashboard/reader_request_management/ReaderRequestManagementScreen';
import ReportBookingDetailScreen from '../../pages/dashboard/report_booking_management/ReportBookingDetailScreen';
import ReportBookingScreen from '../../pages/dashboard/report_booking_management/ReportBookingScreen';
import ReportReaderDetailScreen from '../../pages/dashboard/report_reader_management/ReportReaderDetailScreen';
import ReportReaderManagementScreen from '../../pages/dashboard/report_reader_management/ReportReaderManagementScreen';
import SettingManagementScreen from '../../pages/dashboard/setting_management/SettingManagementScreen';
import StaffManagementScreen from '../../pages/dashboard/staff_management/StaffManagementScreen';
import ReaderWithdrawalManagement from '../../pages/dashboard/withdrawal/ReaderWithdrawalManagement';
import MeetingZoomScreen from '../../pages/main/meeting/MeetingZoomScreen';
import SeminarManagementList from '../../pages/dashboard/seminar_management/SeminarManagementList';
import SeminarManagementDetail from '../../pages/dashboard/seminar_management/SeminarManagementDetail';
import ViewRecording from '../../pages/profile/personal/schedule/ViewRecording';
/* eslint-disable no-unused-vars */
export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard isStaffOrAdmin={true}>
        <DashboardLayout>
          <Suspense fallback={<LoadingPage height={'100vh'} />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>

    ),
    children: [
      {
        index: true,
        element: <OverviewScreen />,
      },
      {
        path: 'analytics',
        element: <AnalyticScreen />,
      },
      {
        path: 'staff-management',
        element: <StaffManagementScreen />,
      },
      {
        path: 'setting-management',
        element: <SettingManagementScreen />,
      },
      {
        path: 'customer-management',
        element: <CustomerManagementScreen />,
      },
      {
        path: 'reader-management',
        element: <ReaderManagementScreen />,
      },
      {
        path: 'request',
        children: [
          { element: <ReaderRequestManagementScreen />, index: true },
          {
            path: ':id/detail',
            element: <ReaderRequestDetailScreen />,
          },
          {
            path: 'withdrawal',
            element: <ReaderWithdrawalManagement />,
          },
          {
            path: 'seminar',
            element: <SeminarManagementList />,
          },
          {
            path: 'seminar/:id/detail',
            element: <SeminarManagementDetail />,
          },
        ],
      },
      {
        path: 'report',
        children: [
          { element: <ReportBookingScreen />, index: true },
          {
            path: ':id/detail',
            element: <ReportBookingDetailScreen />,
          },
          {
            path: 'view-recording/:playUrl',
            element: <ViewRecording />,
          },
          {
            path: 'reader',
            element: <ReportReaderManagementScreen />,
          },
          {
            path: 'reader/:id/detail',
            element: <ReportReaderDetailScreen />,
          },

        ],
      },
      {
        path: 'meeting-zoom',
        children: [
          { path: ':id/:role/detail', element: <MeetingZoomScreen /> },
        ],
      },
    ],
  },
];
