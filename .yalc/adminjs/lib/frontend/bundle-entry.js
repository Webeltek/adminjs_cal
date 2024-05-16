import { ThemeProvider } from '@adminjs/design-system/styled-components';
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import ViewHelpers from '../backend/utils/view-helpers/view-helpers.js';
import { flat } from '../utils/flat/index.js';
import * as AppComponents from './components/app/index.js';
import * as ActionComponents from './components/actions/index.js';
import App, { OriginalApp } from './components/application.js';
import { AppLoader } from './components/index.js';
//import Login from './components/login/index.js'
import Register from './components/register/index_old.js';
import BasePropertyComponent, { CleanPropertyComponent } from './components/property-type/index.js';
import withNotice from './hoc/with-notice.js';
import * as Hooks from './hooks/index.js';
import createStore from './store/store.js';
import initTranslations from './utils/adminjs.i18n.js';
import ApiClient from './utils/api-client.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development'
};
const store = createStore(window.REDUX_STATE);
const theme = window.THEME;
const {
  locale
} = store.getState();
const {
  i18n
} = initTranslations(locale);
const Application = /*#__PURE__*/React.createElement(Provider, {
  store: store
}, /*#__PURE__*/React.createElement(ThemeProvider, {
  theme: theme
}, /*#__PURE__*/React.createElement(I18nextProvider, {
  i18n: i18n
}, /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(Suspense, {
  fallback: /*#__PURE__*/React.createElement(AppLoader, null)
}, /*#__PURE__*/React.createElement(App, null))))));
const loginAppProps = window.__APP_STATE__ ?? {};
const registerAppProps = window.__APP_STATE__REG ?? {};
/* const LoginApplication = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Suspense fallback={<AppLoader />}>
            <Login {...loginAppProps} />
          </Suspense>
        </BrowserRouter>
      </I18nextProvider>
    </ThemeProvider>
  </Provider>
) */

const RegisterApplication = /*#__PURE__*/React.createElement(GoogleOAuthProvider, {
  clientId: "79524392295-cksiecamepjhv0jdqcpfiqlmd46vogmh.apps.googleusercontent.com"
}, /*#__PURE__*/React.createElement(Provider, {
  store: store
}, /*#__PURE__*/React.createElement(ThemeProvider, {
  theme: theme
}, /*#__PURE__*/React.createElement(I18nextProvider, {
  i18n: i18n
}, /*#__PURE__*/React.createElement(BrowserRouter, null, /*#__PURE__*/React.createElement(Suspense, {
  fallback: /*#__PURE__*/React.createElement(AppLoader, null)
}, /*#__PURE__*/React.createElement(Register, registerAppProps)))))));

// eslint-disable-next-line no-undef
window.regeneratorRuntime = regeneratorRuntime;
export default {
  withNotice,
  Application,
  OriginalApplication: OriginalApp,
  //LoginApplication,
  RegisterApplication,
  ViewHelpers,
  UserComponents: {},
  ApiClient,
  BasePropertyComponent,
  CleanPropertyComponent,
  env,
  ...AppComponents,
  ...ActionComponents,
  ...Hooks,
  flat
};