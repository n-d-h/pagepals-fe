import { gql } from '@apollo/client';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { showNotification } from '../components/common_services/CommonServices';
import { client } from '../main';
import { setActive } from '../redux/slices/loadingSlice';
import { AUTH } from './firebase';

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(AUTH, provider);
  if (!result) {
    setActive(false);
    return;
  }
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  const user = result.user;
  return { user, token };
};

export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();

  await signInWithPopup(AUTH, provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // IdP data available using getAdditionalUserInfo(result)
      // ...
      return { user, accessToken };
    })
    .catch((e) => {
      showNotification('error', 'Error while logging in');
    });
};

// REGISTER
export const register = async (email, password) => {
  const newUser = await createUserWithEmailAndPassword(AUTH, email, password);

  await sendEmailVerification(newUser.user)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      const accessToken = userCredential.accessToken;

      // ...

      return { user, accessToken };
    })
    .catch((e) => {
      showNotification('error', 'Error while register');
      // ..
    });
};

// LOGOUT
export const logout = async () => {
  localStorage.removeItem('accessToken');
  await signOut(AUTH);
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(AUTH, email);
};

// ----------------------------------------------------------------------
export const GetUser = async (username, dispatch) => {
  try {
    dispatch(setActive(true)); // Assuming setActive is a Redux action creator

    const { data } = await client.query({
      query: GET_USER,
      variables: { username },
    });

    dispatch(setActive(false));
    return data.getAccount || data.getAccountByUsername;
  } catch (error) {
    dispatch(setActive(false));
    showNotification('error', 'Something went wrong');
  }
};

export const GET_USER = gql`
query MyQuery($username: String!) {
  getAccountByUsername(username: $username) {
    accountState {
      name
    }
    role {
      name
      accounts {
        id
      }
    }
    id
    email
    fullName
    phoneNumber
    username
    customer {
      account {
        email
        id
        phoneNumber
        username
        wallet {
          cash
          tokenAmount
        }
      }
      id
      dob
      fullName
      gender
      imageUrl
      status
    }
    reader {
      audioDescriptionUrl
      avatarUrl
      countryAccent
      description
      genre
      id
      introductionVideoUrl
      language
      nickname
      rating
      status
      totalOfBookings
      totalOfReviews
    }
  }
}
`;

const LOGIN_WITH_GOOGLE = gql`
	mutation MyMutation($token: String!) {
		loginWithGoogle(token: $token) {
			accessToken
			refreshToken
		}
	}
`;

export const methodLoginWithGoogle = async (token) => {
  if (!token) {
    showNotification('error', 'Token is missing');
    return;
  }

  try {
    const { data } = await client.mutate({
      mutation: LOGIN_WITH_GOOGLE,
      variables: { token },
    });

    return data.loginWithGoogle;
  } catch (error) {
    // Handle or log error appropriately
    showNotification(
      'error',
      'Something went wrong during login, please retry',
    );
    localStorage.removeItem('accessToken');
    return null;
  }
};
