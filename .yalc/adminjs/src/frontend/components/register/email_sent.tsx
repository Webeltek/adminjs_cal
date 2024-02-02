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
  MessageBox,
  Text,
} from '@adminjs/design-system'
import { styled } from '@adminjs/design-system/styled-components'

import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation} from '../../hooks/index.js'
import { ReduxState } from '../../store/store.js'
import MadeWithLoveMod from './made-with-love-mod.js'

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

export type EmailSentProps = {
  message?: string
  action: string
  postMessage?: string,
  email?: string
}

export const EmailSent: React.FC = () => {
  const props = (window as any).__APP_STATE__REG as EmailSentProps
  const { action, postMessage: message, email } = props
  const { translateComponent, translateMessage } = useTranslation()
  const branding = useSelector((state: ReduxState) => state.branding)
  console.log("EmailSent message, email",message, email);

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
          <H2 fontWeight="lighter">{translateComponent('Login.welcomeHeader')}</H2>
          <Text fontWeight="lighter" mt="default">
            {translateComponent('Login.welcomeMessage')}
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
        { message && (
              <MessageBox
                my="lg"
                message={translateComponent(message)+email}
                variant="info"
              />
            )}
      </Box>
      {branding.withMadeWithLove ? (
        <Box mt="xxl">
          <MadeWithLoveMod />
        </Box>
      ) : null}
    </Wrapper>
  )
}

export default EmailSent
