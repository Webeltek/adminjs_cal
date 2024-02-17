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
  import MadeWithLoveMod from './made-with-love-mod.js'
  import { useLocation } from 'react-router'
  
  const Wrapper = styled(Box)<BoxProps>`
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  `
  
  const StyledLogo = styled.img`
    max-width: 200px;
    margin: ${({ theme }) => theme.space.md} 0;
  `
  
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
  `
  
  export type RegisterProps = {
    message?: string
    action: string
    postMessage?: string
  }
  
  export const Register: React.FC = () => {
    const props = (window as any).__APP_STATE__REG as RegisterTemplateAttributes
    let { action, errorMessage: message ,postMessage} = props
    const { translateComponent, translateMessage } = useTranslation()
    const branding = useSelector((state: ReduxState) => state.branding);
    console.log('register props',action, message, postMessage);
    const location = useLocation();
    const { state } = location;
    if (state) { action = state;}
  
    return (
      <Wrapper flex variant="grey" className="login__Wrapper">
        <Box bg="white" height="440px" flex boxShadow="login" width={[1, 2 / 3, 'auto']}>
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
              {translateComponent('Register.registerMessage')}
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
          <Box
            as="form"
            action={action}
            method="POST"
            p="x3"
            flexGrow={1}
            width={['100%', '100%', '480px']}
          >
            <H5 marginBottom="xxl">
              {branding.logo ? (
                <StyledLogo src={branding.logo} alt={branding.companyName} />
              ) : (
                branding.companyName
              )}
            </H5>
            {message && (
              <MessageBox
                my="lg"
                message={message.split(' ').length > 1 ? message : translateMessage(message)}
                variant="danger"
              />
            )}
            <FormGroup>
              <Label required>{translateComponent('Login.properties.email')}</Label>
              <Input name="email" placeholder={translateComponent('Login.properties.email')} />
            </FormGroup>
            <FormGroup>
              <Label required>{translateComponent('Login.properties.password')}</Label>
              <Input
                type="password"
                name="password"
                placeholder={translateComponent('Login.properties.password')}
                autoComplete="new-password"
              />
            </FormGroup>
            <FormGroup>
              <Label >{translateComponent('Register.properties.organization')}</Label>
              <Input name="organization" placeholder={translateComponent('Register.properties.organization')} />
            </FormGroup>
            <Text mt="xl" textAlign="center">
              <Button variant="contained">{translateComponent('Register.registerButton')}</Button>
            </Text>
          </Box>
        </Box>
        {branding.withMadeWithLove ? (
          <Box mt="xxl">
            <MadeWithLoveMod />
          </Box>
        ) : null}
      </Wrapper>
    )
  }

  export default allowOverride(Register, 'Register')