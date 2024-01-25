import React from 'react';

import { useSelector } from 'react-redux';
import {
  Box,
  BoxProps,
  H5,
  H2,
  Label,
  Illustration,
  Input,
  FormGroup,
  Button,
  Text,
  MessageBox,
  MadeWithLove,
  themeGet,
} from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { ReduxState, useTranslation } from 'adminjs';
import { AuthUser, AuthUsers } from '../constants/authUsers.js';
import { RegisterTemplateAttributes } from 'node_modules/adminjs/types/src/frontend/register-template.js';
import { Routes, Route } from 'react-router-dom'
import EmailSent from './email_sent.js';

const Wrapper = styled(Box)<BoxProps>`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const StyledLogo = styled.img`
  max-width: 200px;
  margin: ${themeGet('space', 'md')} 0;
`;

const IllustrationsWrapper = styled(Box)<BoxProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  & svg [stroke='#3B3552'] {
    stroke: rgba(255, 255, 255, 0.5);
  }
  & svg [fill='#3040D6'] {
    fill: rgba(255, 255, 255, 1);
  }
`;

const RegisterApp: React.FC = () => {
  return (
    <Box height="100%" flex data-css="app">
      <Routes>
        <Route path="/admin/register" element={<Register/>} />
        <Route path="/admin/register/email_sent" element={<EmailSent/>} />
      </Routes>
    </Box>

  )
}

export type RegisterProps = {
  credentials: Pick<AuthUser, 'email' | 'password'>;
  action: string;
  errorMessage?: string;
  postMessage? : string;
  children?: any;
};

export const Register: React.FC = (props) => {
  const props2 = (window as any).__APP_STATE__REG as RegisterTemplateAttributes
  const { action, errorMessage  ,postMessage} = props2
  console.log("Overridable register action, postmessage",action ,postMessage);
  
  const { translateComponent, translateMessage } = useTranslation();
  const [defaultUser] = AuthUsers;
  const branding = useSelector((state: ReduxState) => state.branding);
  const message = `Email: ${defaultUser.email}\nPassword: ${defaultUser.password}`;
  
  return (
    <React.Fragment>
      <Wrapper flex variant="grey">
        <Box bg="white" height="480px" flex boxShadow="login" width={[1, 2 / 3, 'auto']}>
          <Box
            bg="primary100"
            color="white"
            p="x3"
            width="380px"
            flexGrow={0}
            display={['none', 'none', 'block']}
            position="relative"
          >
            <H2 fontWeight="lighter">{translateComponent('Register.welcomeHeader')}</H2>
            <Text fontWeight="lighter" mt="default">
              {translateComponent('Register.welcomeMessage')}
            </Text>
            <IllustrationsWrapper p="xxl">
              <Box display="inline" mr="default">
                <Illustration variant="Planet" width={82} height={91} />
              </Box>
              <Box display="inline">
                <Illustration variant="Astronaut" width={82} height={91} />
              </Box>
              <Box display="inline" position="relative" top="-20px">
                <Illustration variant="FlagInCog" width={82} height={91} />
              </Box>
            </IllustrationsWrapper>
          </Box>
          { postMessage && (
              <MessageBox
                my="lg"
                message={translateMessage(postMessage)}
                variant="danger"
              />
            )}
          { !postMessage && (
            <Box as="form" action={action} method="POST" p="x3" flexGrow={1} width={['100%', '100%', '480px']}>
            <H5 marginBottom="xxl">
              {branding.logo ? <StyledLogo src={branding.logo} alt={branding.companyName} /> : branding.companyName}
            </H5>
            <MessageBox my="lg" message={message} variant="info" style={{ whiteSpace: 'pre-wrap' }} />
            {errorMessage && (
              <MessageBox
                my="lg"
                message={errorMessage.split(' ').length > 1 ? errorMessage : translateMessage(errorMessage)}
                variant="danger"
              />
            )}
            <FormGroup>
              <Label required>{translateComponent('Register.properties.email')}</Label>
              <Input
                name="email"
                placeholder={translateComponent('Register.properties.email')}
                defaultValue={defaultUser.email}
              />
            </FormGroup>
            <FormGroup>
              <Label required>{translateComponent('Register.properties.password')}</Label>
              <Input
                type="password"
                name="password"
                placeholder={translateComponent('Register.properties.password')}
                autoComplete="new-password"
                defaultValue={defaultUser.password}
              />
            </FormGroup>
            <Text mt="xl" textAlign="center">
              <Button variant="contained">{translateComponent('Register.loginButton')}</Button>
            </Text>
          </Box>
          )}
          
        </Box>
        {branding.withMadeWithLove ? (
          <Box mt="xxl">
            <MadeWithLove />
          </Box>
        ) : null}
      </Wrapper>
    </React.Fragment>
  );
};

export default Register;
