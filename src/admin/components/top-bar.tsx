import { Box, Button, Icon, Text, DropDown,
  DropDownItem,
  DropDownMenu,
  DropDownTrigger } from '@adminjs/design-system';
import { ReduxState , initializeTheme , useTranslation, getTheme } from 'adminjs';
import React, { FC } from 'react';
import { useSelector , useDispatch} from 'react-redux';
import { dark, light, noSidebar } from '@adminjs/themes';
import { useNavigate } from 'react-router'

const TopBar : FC = () => {
  const versions = useSelector((state: ReduxState) => state.versions);
  const currAdmin = useSelector((state: ReduxState) => state.session);
  const theme = useSelector((state: ReduxState) => state.theme);
  const dispatch = useDispatch();
  const GITHUB_URL = (window as any).AdminJS.env.GITHUB_URL;
  const SLACK_URL = (window as any).AdminJS.env.SLACK_URL;
  const DOCUMENTATION_URL = (window as any).AdminJS.env.DOCUMENTATION_URL;
  const { translateLabel } = useTranslation();
  const navigate = useNavigate();
  const themeConfigArr = [ dark, light, noSidebar];

  function changeTheme(themeConf){
    const THEME_INITIALIZE = 'THEME_INITIALIZE'
    const initThemeResponseAction = {
      type: 'THEME_INITIALIZE',
      data: themeConf
    };
    console.log("top-bar initThemeAction",initThemeResponseAction);
    dispatch(initThemeResponseAction);
    currAdmin.theme = themeConf;
    dispatch({ 
      type: 'SESSION_INITIALIZE',
      data: currAdmin
  })
    console.log("top-bar currAdmin",currAdmin);
    navigate('/admin')
  }

  return (
    <Box flex flexGrow={1} justifyContent="end" alignItems="center">
      <Text ml="xl" mr="auto">
        {versions.admin}
      </Text>
      <Button color="text" as="a" href={SLACK_URL} target="_blank">
        <Icon icon="Slack" />
        Slack
      </Button>
      <Button color="text" as="a" href={GITHUB_URL} target="_blank">
        <Icon icon="GitHub" />
        GitHub
      </Button>
      <Button color="text" as="a" href={DOCUMENTATION_URL} target="_blank">
        <Icon icon="BookOpen" />
        Documentation
      </Button>
      <Box flex alignItems="center">
        <DropDown>
          <DropDownTrigger>
            <Button color="text">
              <Icon icon="Moon" />
              {translateLabel(`choose_theme`)}
            </Button>
          </DropDownTrigger>
          <DropDownMenu>
            {themeConfigArr.map((themeConfig) => (
              <DropDownItem
                key={themeConfig.id}
                onClick={() => {
                  changeTheme(themeConfig)
                }}
              >
                {themeConfig.name}
              </DropDownItem>
            ))}
          </DropDownMenu>
        </DropDown>
      </Box>
    </Box>
  );
};

export { TopBar };
export default TopBar;
