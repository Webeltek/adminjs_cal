import {
  Box,
  BoxProps,
  Button,
  FormGroup,
  H2,
  H5,
  Illustration,
  Input,
  Label,
  MadeWithLove,
  MessageBox,
  Text,
} from '@adminjs/design-system'
import { styled } from '@adminjs/design-system/styled-components'

import React from 'react'
import { useSelector } from 'react-redux'
import { allowOverride } from '../../hoc/allow-override.js'
import { useTranslation } from '../../hooks/index.js'
import { ReduxState } from '../../store/store.js'
import { RegisterTemplateAttributes } from '../../register-template.js'
import { Routes, Route } from 'react-router-dom'
import { Register } from './register.js'
import { EmailSent } from './email_sent.js'
import { Login } from '../login/index.js'


const RegisterApp: React.FC = () => {
  //console.log("inside RegisterApp")
  return (
    <Box height="100%" flex data-css="app">
      <Routes>
        <Route path="/admin/login" element={<Login/>} />
        <Route path="/admin/register" element={<Register/>} />
        <Route path="/admin/register/email_sent" element={<EmailSent/>} />
      </Routes>
    </Box>

  )
}

/* const OverridableRegisterApp = allowOverride(RegisterApp, 'Register')
export {
  OverridableRegisterApp as default,
  OverridableRegisterApp as RegisterApp,
  RegisterApp as OriginalRegisterApp,
} */
export default RegisterApp;
