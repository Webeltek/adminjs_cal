import React from 'react'
import { cssClass, Text, Box , DropDown, Button,
  DropDownItem,
  DropDownMenu,
  DropDownTrigger, Icon } from '@adminjs/design-system'
import { styled } from '@adminjs/design-system/styled-components'

import { VersionProps } from 'adminjs'
import { useTranslation } from 'adminjs'

import { useNavigate , useLocation} from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from 'adminjs'
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
  const themeConfigArr = [ dark, light, noSidebar];
  const location = useLocation();

  async function changeTheme(themeConf){
    
    axios.post('/admin/login',
      { 
        theme : themeConf.id
      })
      .then((resp) => {
        if (resp.data){
          //console.log("version resp.data",resp.data);
          if (resp.data.themeSavedInSession === 'req.session.adminUser.theme'){
            window.location.href = location.pathname;
          }
        }
      }, (error) => {
        console.log(error);
      });
    
    
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

export { Version };
export default Version;
