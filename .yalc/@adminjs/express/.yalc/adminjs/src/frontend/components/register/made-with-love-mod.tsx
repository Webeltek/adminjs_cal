import React, { FC } from 'react'
import { styled } from '@adminjs/design-system/styled-components'

import { Box, BoxProps } from '@adminjs/design-system'
import { Icon } from '@adminjs/design-system'
import { Link, LinkProps } from '@adminjs/design-system'
import { Text } from '@adminjs/design-system'
import { themeGet } from '@adminjs/design-system'

const StyledWrapper = styled(Box)<BoxProps>`
  user-select: none;
  & > * {
    padding: 0 ${themeGet('space', 'xs')};
  }
`

StyledWrapper.defaultProps = {
  color: 'grey60',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const StyledLink: any = styled(Link)<LinkProps>`
  font-size: ${themeGet('fontSizes', 'sm')};
  font-weight: 300;
  &:hover {
    color: ${themeGet('colors', 'love')};
    text-decoration: none;
  }
`

export const MadeWithLoveMod: FC = () => (
  <StyledWrapper>
    <Text as="span" variant="sm">
      Made with
    </Text>
    <Icon icon="Heart" color="love" />
    <Text as="span" variant="sm">
      by
    </Text>
    <StyledLink href="https://adminjs.co/" target="_blank" rel="noopener noreferrer">
      Webeltek
    </StyledLink>
  </StyledWrapper>
)

export default MadeWithLoveMod
