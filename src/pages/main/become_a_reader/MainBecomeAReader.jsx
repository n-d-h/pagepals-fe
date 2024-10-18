import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../../../redux/slices/authSlice';
import BecomeAReaderStatus from './BecomeAReaderStatus';
import BecomeAReader from './BecomeAReader';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../../auth/loginMethods';
import BackdropLoading from '../../backdrop_loading/BackdropLoading';

const MainBecomeAReader = () => {
  const userProfile = useSelector(selectUser);

  const accountState = _.get(userProfile, 'accountState.name');

  const dispatch = useDispatch();

  const { loading: loadingData } = useQuery(GET_USER, {
    variables: {
      username: userProfile?.username,
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      dispatch(setUser(data.getAccountByUsername));
    },
  });

  if (loadingData) {
    return <BackdropLoading />;
  }

  return <BecomeAReaderStatus />;
  // if (accountState === 'READER_PENDING') {
  // }

  // if (accountState === 'ACTIVE') {
  //   return <BecomeAReader />;
  // }
};

export default MainBecomeAReader;
