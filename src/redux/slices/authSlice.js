/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  loginWithFacebook,
  loginWithGoogle,
  logout as firebaseLogout,
  GetUser,
  methodLoginWithGoogle,
} from '../../auth/loginMethods';
import { showNotification } from '../../components/common_services/CommonServices';
import { setActive } from './loadingSlice';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  accessToken: '',
  refreshToken: '',
  isAuthenticatedUser: false,
  isAuthenticatedAdmin: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticatedUser = true;
      state.isLoading = false;
      state.error = null;
    },
    setAccessToken: (state, action) => {
      localStorage.setItem('accessToken', action.payload);
      state.user.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.user.refreshToken = action.payload;
    },
    setAdmin: (state, action) => {
      state.user = action.payload;
      state.isAuthenticatedAdmin = true;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isAuthenticatedUser = false;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticatedUser = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUser, setError, logout, setAccessToken, setRefreshToken } =
	authSlice.actions;

export const loginWithGoogleThunk = () => async (dispatch) => {
  try {
    dispatch(setActive(true));
    const { user } = await loginWithGoogle(); // Call the loginWithGoogle API function
    // call login API

    const { accessToken } = await methodLoginWithGoogle(user.accessToken);

    const decodedToken = jwtDecode(accessToken);
    localStorage.setItem('accessToken', accessToken);

    const response = await GetUser(decodedToken.username, dispatch);

    if (response) {
      showNotification('success', 'Login successful');
      dispatch(setUser(response));
    } else {
      dispatch(setActive(false));
      showNotification('error', 'Login failed');
    }
    return response;
  } catch (error) {
    dispatch(setActive(false));
  } finally {
    dispatch(setActive(false));
    dispatch(setActive(false));
  }
};

export const loginWithFacebookThunk = () => async (dispatch) => {
  try {
    dispatch(setActive(true));
    const { user, accessToken } = await loginWithFacebook(); // Call the loginWithFacebook API function
    dispatch(setUser(user));
    showNotification('success', 'Login successful');

    return user;
  } catch (error) {
    dispatch(setActive(false));
    showNotification('error', 'Something went wrong');
  } finally {
    dispatch(setActive(false));
  }
};

export const setLoginInternal = (token) => {
  return async (dispatch) => {
    try {
      dispatch(setActive(true));
      const { accessToken, refreshToken } = token;
      localStorage.setItem('accessToken', accessToken);
      // setAccessToken(accessToken);
      // setRefreshToken(refreshToken);
      const decodedToken = jwtDecode(accessToken);

      const response = await GetUser(decodedToken.username, dispatch);
      showNotification('success', 'Login successful');
      dispatch(setUser(response)); // Assuming setUser is a Redux action creator
    } catch (error) {
    } finally {
      dispatch(setActive(false));
    }
  };
};

export const logoutFirebaseThunk = () => async (dispatch) => {
  try {
    dispatch(setActive(true));
    await firebaseLogout();
    // add dtb logout
    dispatch(logout());
    showNotification('success', 'Logout successful');
  } catch (error) {
    showNotification('error', 'Logout failed');
    dispatch(setActive(false));
  } finally {
    dispatch(setActive(false));
  }
};

const authReducer = authSlice.reducer;
export const selectUser = (state) => state.auth.user;

export const selectUserRole = (state) => state.auth.user && state.auth.user.role.name;

export const selectUserAuthenticated = (state) =>
  state.auth.isAuthenticatedUser;

export const selectAdminAuthenticated = (state) =>
  state.auth.isAuthenticatedAdmin;

export default authReducer;
