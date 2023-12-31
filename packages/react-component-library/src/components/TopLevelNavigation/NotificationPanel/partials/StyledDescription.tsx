import styled from 'styled-components'
import { selectors } from '@defencedigital/design-tokens'

const { color, spacing } = selectors

export const StyledDescription = styled.p`
  color: ${color('neutral', '300')};
  margin-top: ${spacing('2')};
`
