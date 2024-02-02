import { Box, H2, Illustration, MessageBox, Text } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../hooks/index.js';
import MadeWithLoveMod from './made-with-love-mod.js';
const Wrapper = styled(Box)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;
const StyledLogo = styled.img`
  max-width: 200px;
  margin: ${({
  theme
}) => theme.space.md} 0;
`;
const IllustrationsWrapper = styled(Box)`
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
export const EmailSent = () => {
  const props = window.__APP_STATE__REG;
  const {
    action,
    postMessage: message,
    email
  } = props;
  const {
    translateComponent,
    translateMessage
  } = useTranslation();
  const branding = useSelector(state => state.branding);
  console.log("EmailSent message, email", message, email);
  return /*#__PURE__*/React.createElement(Wrapper, {
    flex: true,
    variant: "grey",
    className: "login__Wrapper"
  }, /*#__PURE__*/React.createElement(Box, {
    bg: "white",
    height: "440px",
    flex: true,
    boxShadow: "login",
    width: [1, 2 / 3, 'auto']
  }, /*#__PURE__*/React.createElement(Box, {
    bg: "primary100",
    color: "white",
    p: "x3",
    width: "380px",
    flexGrow: 0,
    display: ['none', 'none', 'block'],
    position: "relative"
  }, /*#__PURE__*/React.createElement(H2, {
    fontWeight: "lighter"
  }, translateComponent('Login.welcomeHeader')), /*#__PURE__*/React.createElement(Text, {
    fontWeight: "lighter",
    mt: "default"
  }, translateComponent('Login.welcomeMessage')), /*#__PURE__*/React.createElement(IllustrationsWrapper, {
    p: "xxl"
  }, /*#__PURE__*/React.createElement(Box, {
    display: "inline",
    mr: "default"
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "Planet",
    width: 82,
    height: 91
  })), /*#__PURE__*/React.createElement(Box, {
    display: "inline"
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "Astronaut",
    width: 82,
    height: 91
  })), /*#__PURE__*/React.createElement(Box, {
    display: "inline",
    position: "relative",
    top: "-20px"
  }, /*#__PURE__*/React.createElement(Illustration, {
    variant: "FlagInCog",
    width: 82,
    height: 91
  })))), message && /*#__PURE__*/React.createElement(MessageBox, {
    my: "lg",
    message: translateComponent(message) + email,
    variant: "info"
  })), branding.withMadeWithLove ? /*#__PURE__*/React.createElement(Box, {
    mt: "xxl"
  }, /*#__PURE__*/React.createElement(MadeWithLoveMod, null)) : null);
};
export default EmailSent;