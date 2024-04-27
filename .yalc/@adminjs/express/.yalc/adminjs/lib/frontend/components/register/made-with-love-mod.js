import React from 'react';
import { styled } from '@adminjs/design-system/styled-components';
import { Box } from '@adminjs/design-system';
import { Icon } from '@adminjs/design-system';
import { Link } from '@adminjs/design-system';
import { Text } from '@adminjs/design-system';
import { themeGet } from '@adminjs/design-system';
const StyledWrapper = styled(Box)`
  user-select: none;
  & > * {
    padding: 0 ${themeGet('space', 'xs')};
  }
`;
StyledWrapper.defaultProps = {
  color: 'grey60',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
const StyledLink = styled(Link)`
  font-size: ${themeGet('fontSizes', 'sm')};
  font-weight: 300;
  &:hover {
    color: ${themeGet('colors', 'love')};
    text-decoration: none;
  }
`;
export const MadeWithLoveMod = () => /*#__PURE__*/React.createElement(StyledWrapper, null, /*#__PURE__*/React.createElement(Text, {
  as: "span",
  variant: "sm"
}, "Made with"), /*#__PURE__*/React.createElement(Icon, {
  icon: "Heart",
  color: "love"
}), /*#__PURE__*/React.createElement(Text, {
  as: "span",
  variant: "sm"
}, "by"), /*#__PURE__*/React.createElement(StyledLink, {
  href: "https://adminjs.co/",
  target: "_blank",
  rel: "noopener noreferrer"
}, "Webeltek"));
export default MadeWithLoveMod;