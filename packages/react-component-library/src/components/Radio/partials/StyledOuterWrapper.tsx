import styled, { css } from 'styled-components'

interface StyledOuterWrapperProps {
  $hasContainer?: boolean
}

export const StyledOuterWrapper = styled.div<StyledOuterWrapperProps>`
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  border-radius: 15px;

  &:active {
    pointer-events: none;
  }

  ${({ $hasContainer }) =>
    $hasContainer &&
    css`
      min-height: 44px;
    `}
`
