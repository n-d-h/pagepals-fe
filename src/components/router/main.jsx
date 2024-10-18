import AuthGuard from '../../auth/AuthGuard';
import BecomeAReader from '../../pages/main/become_a_reader/BecomeAReader';
import BecomeAReaderStatus from '../../pages/main/become_a_reader/BecomeAReaderStatus';
import MainBecomeAReader from '../../pages/main/become_a_reader/MainBecomeAReader';
import BrowseScreen from '../../pages/main/browse/BrowseScreen';
import ChatScreen from '../../pages/main/chat/ChatScreen';
import EventDetails from '../../pages/main/event/EventDetails';
import EventList from '../../pages/main/event/EventList';
import HomeScreen from '../../pages/main/home/HomeScreen';
import MainPageLayout from '../../pages/main/main_page/MainPage';
import MeetingZoomScreen from '../../pages/main/meeting/MeetingZoomScreen';
import Payment from '../../pages/main/payment/Payment';
import MainReader from '../../pages/main/reader/MainReader';
import MainReaderEdit from '../../pages/main/reader/MainReaderEdit';
import ReaderControlScreen from '../../pages/main/reader/ReaderControlScreen';
import SearchScreen from '../../pages/main/search/SearchScreen';
import ReaderSeminar from '../../pages/main/seminar/ReaderSeminar';
import SeminarDetailView from '../../pages/main/seminar/SeminarDetailView';
import CreateSeminarStepper from '../../pages/main/seminar/create/CreateSeminarStepper';
import ReaderService from '../../pages/main/service/ReaderService';
import SocialView from '../../pages/main/social/SocialView';
import UserProfilePage from '../../pages/profile/UserProfilePage';
import BookView from '../../pages/profile/book/BookView';
import PersonalAccount from '../../pages/profile/personal/PersonalAccount';
import CalendarView from '../../pages/profile/personal/calendar/CalendarView';
import ReaderWallet from '../../pages/profile/personal/readerWallet/ReaderWallet';
import ReaderSchedule from '../../pages/profile/personal/schedule/ReaderSchedule';
import ViewRecording from '../../pages/profile/personal/schedule/ViewRecording';
import { ProfileServiceContextProvider } from '../../pages/profile/personal/services/ProfileServiceContext';
import ProfileServices from '../../pages/profile/personal/services/ProfileServices';
import ReaderBookServices from '../../pages/profile/personal/services/ReaderBookServices';
import ReaderServiceDetail from '../../pages/profile/personal/services/ReaderServiceDetail';
import CreateServiceStepper from '../../pages/profile/personal/services/create/CreateServiceStepper';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <AuthGuard isStaffOrAdmin={false}>
        <MainPageLayout></MainPageLayout>
      </AuthGuard>
    ),
    path: 'main',
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
      {
        path: 'search',
        element: <SearchScreen />,
      },
      {
        path: 'browse',
        element: <BrowseScreen />,
      },
      {
        path: 'chat',
        element: <ChatScreen />,
      },
      {
        path: 'social',
        element: <SocialView />,
      },
      {
        path: 'event',
        children: [
          { index: true, element: <EventList /> },
          { path: ':id/detail', element: <EventDetails /> },
        ],
      },
      {
        path: 'book',
        children: [
          // { element: <UserProfilePage />, index: true },
          { path: ':id/detail', element: <BookView /> },
        ],

      },
      {
        path: 'view-recording',
        children: [
          { path: ':playUrl', element: <ViewRecording /> },
        ]
      },
      {
        path: 'user',
        children: [
          // { element: <UserProfilePage />, index: true },
          // { path: "profile", element: <UserProfilePage /> },
          // { path: "cards", element: <UserCardsPage /> },
          // { path: "list", element: <UserListPage /> },
          { path: 'profile', element: <PersonalAccount /> },
          { path: ':id/profile', element: <UserProfilePage /> },
          { path: 'payment', element: <Payment /> },
          // { path: "account", element: <UserAccountPage /> },
        ],
      },
      {
        path: 'reader',
        element: <ReaderControlScreen />,
        children: [
          // { index: true, element: <MainReader /> },
          { index: true, element: <MainReaderEdit /> },
          // { path: 'edit', element: <MainReaderEdit /> },
          { path: 'dashboard', element: <MainReader /> },
          { path: 'schedule', element: <ReaderSchedule /> },
          { path: 'wallet', element: <ReaderWallet /> },
          { path: 'seminar', element: <ReaderSeminar /> },
          { path: 'seminar/:id/view', element: <SeminarDetailView editable={false} /> },
          { path: 'seminar/:id/edit', element: <SeminarDetailView editable={true} /> },
          { path: 'seminar/create', element: <CreateSeminarStepper /> },
          {
            path: 'services',
            element: <ProfileServiceContextProvider>
              <ProfileServices /></ProfileServiceContextProvider>,
          },
          { path: 'services/book/:id', element: <ReaderBookServices /> },
          { path: 'service/:id', element: <ReaderServiceDetail /> },
          { path: 'service/create', element: <CreateServiceStepper /> },
          { path: 'service/create?bookId=:id&title=:title', element: <CreateServiceStepper /> },
          { path: 'calendar', element: <CalendarView /> },
        ],
      },

      {
        path: 'service',
        children: [
          { path: ':id', element: <ReaderService /> },
        ],
      },
      {
        path: 'become-a-reader',
        children: [
          { index: true, element: <MainBecomeAReader /> },
          { path: 'register', element: <BecomeAReader /> },
        ],
      },
      {
        path: 'more',
        element: <div>Search 234</div>,
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
