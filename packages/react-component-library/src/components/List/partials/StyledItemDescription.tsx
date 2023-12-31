import { selectors } from '@defencedigital/design-tokens'
import styled from 'styled-components'

const { color, fontSize } = selectors

export const StyledItemDescription = styled.p`
  color: ${color('neutral', '400')};
  font-size: ${fontSize('base')};
  font-weight: 400;
`
