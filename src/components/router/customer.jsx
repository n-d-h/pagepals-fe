import BrowseScreen from '../../pages/main/browse/BrowseScreen';
import EventDetails from '../../pages/main/event/EventDetails';
import EventList from '../../pages/main/event/EventList';
import HomeScreen from '../../pages/main/home/HomeScreen';
import MainPageLayout from '../../pages/main/main_page/MainPage';
import SearchScreen from '../../pages/main/search/SearchScreen';
import ReaderService from '../../pages/main/service/ReaderService';
import UserProfilePage from '../../pages/profile/UserProfilePage';
import BookView from '../../pages/profile/book/BookView';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const guestRoutes = [
  {
    element: (
		<MainPageLayout></MainPageLayout>
    ),
    path: 'guest',
    children: [
      {
        index: true,
        element: <HomeScreen isGuest={true}/>,
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
        path: 'user',
        children: [
          { path: ':id/profile', element: <UserProfilePage isGuest={true} /> },
        ],
      },
      {
        path: 'event',
        children: [
          { index: true, element: <EventList/> },
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
        path: 'service',
        children: [
          { path: ':id', element: <ReaderService /> },
        ],
      },
    ],
  },
];
