export const handleApolloErrors = (error) => {
//   if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
  //     showNotification('error', 'Something wrong happened, please login again');
  //   }
  //   if (error.extensions?.code === 'FORBIDDEN') {
  //     showNotification('error', 'You are not authorized to access this page');
  //   }

  //   if (error.extensions?.code === 'BAD_USER_INPUT') {
  //     showNotification('error', error.message);
  //   }

  //   if (error.extensions?.code === 'UNAUTHENTICATED') {
  //     showNotification('error', 'You are not authenticated to access this page');
  //   }
  if (error.message === 'Response not successful: Received status code 500') {
    return 'logout';
  }
};
