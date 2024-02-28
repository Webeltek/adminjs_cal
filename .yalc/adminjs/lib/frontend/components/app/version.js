import React from 'react';
import { cssClass, Text, Box, DropDown, Button, DropDownItem, DropDownMenu, DropDownTrigger, Icon } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { useTranslation } from '../../hooks/index.js';
import allowOverride from '../../hoc/allow-override.js';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { dark, light, noSidebar } from '@adminjs/themes';
import axios from 'axios';
const VersionItem = styled(Text)`
  padding: 12px 24px 12px 0;
`;
VersionItem.defaultProps = {
  display: ['none', 'block'],
  color: 'grey100'
};
const Version = props => {
  const {
    versions
  } = props;
  const {
    admin,
    app
  } = versions;
  const {
    translateLabel
  } = useTranslation();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const themeConfigArr = [dark, light, noSidebar];
  const navigate = useNavigate();
  async function changeTheme(themeConf) {
    const THEME_INITIALIZE = 'THEME_INITIALIZE';
    const initThemeResponseAction = {
      type: 'THEME_INITIALIZE',
      data: themeConf
    };
    console.log("top-bar initThemeAction", initThemeResponseAction);
    dispatch(initThemeResponseAction);
    if (session) session.theme = themeConf;
    dispatch({
      type: 'SESSION_INITIALIZE',
      data: session
    });
    console.log("top-bar currAdmin", session);
    const resp = await axios.post('/admin/login', {
      email: 'vel.velikov@1337.no',
      password: 'password'
    });
    if (resp) {
      console.log(resp);
    }
  }
  return /*#__PURE__*/React.createElement(Box, {
    flex: true,
    flexGrow: 1,
    py: "default",
    px: "xxl",
    className: cssClass('Version'),
    "data-css": "version"
  }, admin && /*#__PURE__*/React.createElement(VersionItem, null, translateLabel('adminVersion', {
    version: admin
  })), app && /*#__PURE__*/React.createElement(VersionItem, null, translateLabel('appVersion', {
    version: app
  })), /*#__PURE__*/React.createElement(DropDown, null, /*#__PURE__*/React.createElement(DropDownTrigger, null, /*#__PURE__*/React.createElement(Button, {
    color: "text"
  }, /*#__PURE__*/React.createElement(Icon, {
    icon: "Moon"
  }), translateLabel(`choose_theme`))), /*#__PURE__*/React.createElement(DropDownMenu, null, themeConfigArr.map(themeConfig => /*#__PURE__*/React.createElement(DropDownItem, {
    key: themeConfig.id,
    onClick: () => {
      changeTheme(themeConfig);
    }
  }, themeConfig.name)))));
};
const OverridableVersion = allowOverride(Version, 'Version');
export { OverridableVersion as default, OverridableVersion as Version, Version as OriginalVersion };