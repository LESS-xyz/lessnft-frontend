import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ToastContainer } from 'react-toastify';
import { Header } from 'components';
import { Modals, Routes, ScrollToTop } from 'containers';
import { useFetchTags, useFetchNetworks } from 'hooks';

import Connector from './services/walletConnect';
import { Provider, rootStore } from './store';

import 'react-toastify/dist/ReactToastify.css';
import './styles/app.scss';

const App = () => {
  useFetchTags();
  useFetchNetworks();

  return (
    <>
      <ToastContainer limit={3} pauseOnFocusLoss={false} />
      <GoogleReCaptchaProvider
        reCaptchaKey="6LdzuZIdAAAAAP5iCwbXEmve62Q5OPvPUmK1dWnh"
        language="en"
      >
        <Provider value={rootStore}>
          <Connector>
            <Header />
            <ScrollToTop>
              <Routes />
              <Modals />
            </ScrollToTop>
          </Connector>
        </Provider>
      </GoogleReCaptchaProvider>
    </>
  );
};

export default App;
