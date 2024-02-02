import { Box } from '@adminjs/design-system';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Register } from './register.js';
import { EmailSent } from './email_sent.js';
const RegisterApp = () => {
  console.log("inside RegisterApp");
  return /*#__PURE__*/React.createElement(Box, {
    height: "100%",
    flex: true,
    "data-css": "app"
  }, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/admin/register",
    element: /*#__PURE__*/React.createElement(Register, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/admin/register/email_sent",
    element: /*#__PURE__*/React.createElement(EmailSent, null)
  })));
};

/* const OverridableRegisterApp = allowOverride(RegisterApp, 'Register')
export {
  OverridableRegisterApp as default,
  OverridableRegisterApp as RegisterApp,
  RegisterApp as OriginalRegisterApp,
} */
export default RegisterApp;