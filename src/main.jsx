import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import { HelmetProvider } from 'react-helmet-async';
import { register } from '../serviceWorker.js';

import _ from 'lodash';
window._ = _;

register();

const httpLink = new HttpLink({
  uri: 'https://pagepals.azurewebsites.net/graphql',
  //  uri: 'http://localhost/graphql',

});

const authLink = setContext((_, { headers }) => {
  // Get the token from local storage
  const token = localStorage.getItem('accessToken');

  // Return the headers to the context, including the authorization header
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = authLink.concat(httpLink);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: 'network-only',
    },
  },
});

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Suspense>
			<HelmetProvider>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<ApolloProvider client={client}>
							<BrowserRouter>
								<App />
							</BrowserRouter>
						</ApolloProvider>
					</PersistGate>
				</Provider>
			</HelmetProvider>
		</Suspense>
	</React.StrictMode>,
);
