/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useQuery } from '@apollo/client';
import 'animate.css';
import { m } from 'framer-motion';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './App.css';
import DialogProvider from './components/animate/dialog/DialogProvider';
import MotionContainer from './components/animate/motion-container';
import { MotionLazy } from './components/animate/motion-lazy';
import { varFade } from './components/animate/variants';
import StyledProgressBar from './components/progress-bar/styles';
import { Router } from './components/router/Router';
import ThemeProvider from './components/theme';
import BackdropLoading from './pages/backdrop_loading/BackdropLoading';
import { isActive } from './redux/slices/loadingSlice';
import { setDollarExchangeRate, setRevenueShare, setTokenPrice } from './redux/slices/settingsSlice';
import { getAllSettings } from './services/apolo/queries';

function App () {
  const loading = useSelector(isActive);

  const dispatch = useDispatch();

  const { data } = useQuery(getAllSettings, {
    onError: (e) => {
    },
    onCompleted: (data) => {
      const revenueShare = _.get(data, 'getAllSettings').find((setting) => setting.key === 'REVENUE_SHARE');
      dispatch(setRevenueShare(_.get(revenueShare, 'value', 0)));

      const tokenPrice = _.get(data, 'getAllSettings').find((setting) => setting.key === 'TOKEN_PRICE');
      dispatch(setTokenPrice(_.get(tokenPrice, 'value', 0)));

      const dollarExchangeRate = _.get(data, 'getAllSettings').find((setting) => setting.key === 'DOLLAR_EXCHANGE_RATE');
      dispatch(setDollarExchangeRate(_.get(dollarExchangeRate, 'value', 0)));
    },
    fetchPolicy: 'no-cache',
  });

  return (
		<ThemeProvider>
			<DialogProvider>
				<MotionLazy>
					{loading && <BackdropLoading />}
					<ToastContainer />
					<StyledProgressBar />
					<MotionContainer>
						<m.div variants={varFade().in}>
							<Router />
						</m.div>
					</MotionContainer>
				</MotionLazy>
			</DialogProvider>
		</ThemeProvider>
  );
}

export default App;
