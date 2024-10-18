import { showNotification } from '../components/common_services/CommonServices';

export const toastNotification = ({ title, description, status }) => {
  // Implement your toast notification logic
//   console.log(`Toast Notification: ${title} - ${description} - ${status}`);
  showNotification('success', title, {
    position: 'top-right',
    closeOnClick: true,
    autoClose: false,
    newestOnTop: true,
  });
};

export const sendNativeNotification = ({ title, body }) => {
  // Implement your native notification logic

};
