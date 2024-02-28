import React from 'react'
import { cssClass, Text, Box , DropDown, Button,
  DropDownItem,
  DropDownMenu,
  DropDownTrigger, Icon } from '@adminjs/design-system'
import { styled } from '@adminjs/design-system/styled-components'

import { VersionProps } from '../../../adminjs-options.interface.js'
import { useTranslation } from '../../hooks/index.js'
import allowOverride from '../../hoc/allow-override.js'

import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../store/store.js'
import { dark, light, noSidebar } from '@adminjs/themes';
import axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'

export type Props = {
  versions: VersionProps;
}

const VersionItem = styled(Text)`
  padding: 12px 24px 12px 0;
`

VersionItem.defaultProps = {
  display: ['none', 'block'],
  color: 'grey100',
}

const Version: React.FC<Props> = (props) => {
  const { versions } = props
  const { admin, app } = versions

  const { translateLabel } = useTranslation()
  const dispatch = useDispatch();
  const session = useSelector((state: ReduxState) => state.session);
  const themeConfigArr = [ dark, light, noSidebar];
  const navigate = useNavigate();

  async function changeTheme(themeConf){
    const THEME_INITIALIZE = 'THEME_INITIALIZE'
    const initThemeResponseAction = {
      type: 'THEME_INITIALIZE',
      data: themeConf
    };
    console.log("top-bar initThemeAction",initThemeResponseAction);
    dispatch(initThemeResponseAction);
    if (session) session.theme = themeConf;
    dispatch({ 
      type: 'SESSION_INITIALIZE',
      data: session
  })
    console.log("top-bar currAdmin",session);
    const resp = await axios.post('/admin/login',{ email: 'vel.velikov@1337.no', password: 'password'});
    if(resp){
      console.log(resp);
      
    }
  }

  return (
    <Box flex flexGrow={1} py="default" px="xxl" className={cssClass('Version')} data-css="version">
      {admin && (
        <VersionItem>
          {translateLabel('adminVersion', { version: admin })}
        </VersionItem>
      )}
      {app && (
        <VersionItem>
          {translateLabel('appVersion', { version: app })}
        </VersionItem>
      )}

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
    
  )
}

const OverridableVersion = allowOverride(Version, 'Version')

export {
  OverridableVersion as default,
  OverridableVersion as Version,
  Version as OriginalVersion,
}
