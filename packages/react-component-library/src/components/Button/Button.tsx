import { IconLoader } from '@defencedigital/icon-library'
import React, { FormEvent } from 'react'

import { BUTTON_ICON_POSITION, BUTTON_VARIANT } from './constants'
import { ComponentWithClass } from '../../common/ComponentWithClass'
import { StyledButton } from './partials/StyledButton'
import { StyledIconWrapper } from './partials/StyledIconWrapper'
import { StyledText } from './partials/StyledText'
import { StyledIconLoaderWrapper } from './partials/StyledIconLoader'
import { ComponentSizeType, COMPONENT_SIZE } from '../Forms'

export type ButtonVariantType =
  | typeof BUTTON_VARIANT.PRIMARY
  | typeof BUTTON_VARIANT.SECONDARY
  | typeof BUTTON_VARIANT.TERTIARY
  | typeof BUTTON_VARIANT.DANGER

export type ButtonIconPositionType =
  | typeof BUTTON_ICON_POSITION.LEFT
  | typeof BUTTON_ICON_POSITION.RIGHT

interface ButtonBaseProps extends Omit<ComponentWithClass, 'children'> {
  /**
   * Position of the optional icon.
   */
  iconPosition?: ButtonIconPositionType
  /**
   * Toggles whether the component is disabled or not (preventing user
   * interaction).
   */
  isDisabled?: boolean
  /**
   * Whether an operation is in progress and the button temporarily can't be
   * used. If set, the button will be disabled and a loading icon displayed in
   * place of the button text.
   */
  isLoading?: boolean
  /**
   * Optional handler called when the component is clicked.
   */
  onClick?: (event: FormEvent<HTMLButtonElement>) => void
  /**
   * Size of the component.
   */
  size?: ComponentSizeType
  /**
   * HTML type of the component (forms should use the `submit` type).
   */
  type?: 'button' | 'submit'
  /**
   * Type of component to display (style varies accordingly).
   */
  variant?: ButtonVariantType
}

export interface ButtonWithTextProps extends ButtonBaseProps {
  /**
   * Text to display within the component.
   */
  children: string
  /**
   * Optional icon to display beside the component text.
   */
  icon?: React.ReactNode
  /**
   * Value for the HTML title attribute. Should be set for
   * icon-only buttons to make them accessible.
   */
  title?: string
}

export interface ButtonWithIconOnlyProps extends ButtonBaseProps {
  children?: never
  icon: React.ReactNode
  title: string
}

export type ButtonProps = ButtonWithTextProps | ButtonWithIconOnlyProps

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  isDisabled,
  isLoading = false,
  icon,
  iconPosition = BUTTON_ICON_POSITION.RIGHT,
  onClick,
  size = COMPONENT_SIZE.FORMS,
  title,
  type = 'button',
  variant = BUTTON_VARIANT.PRIMARY,
  ...rest
}) => {
  return (
    <StyledButton
      className={className}
      $variant={variant}
      $size={size}
      $iconPosition={iconPosition}
      data-testid="button"
      disabled={isDisabled || isLoading}
      type={type}
      aria-label={children}
      title={title}
      onClick={onClick}
      {...rest}
    >
      {isLoading && (
        <StyledIconLoaderWrapper data-testid="loading-icon" aria-hidden>
          <IconLoader size={size === COMPONENT_SIZE.FORMS ? 26 : 21} />
        </StyledIconLoaderWrapper>
      )}
      <StyledText $isLoading={isLoading}>{children}</StyledText>
      {icon && (
        <StyledIconWrapper
          $buttonHasText={Boolean(children)}
          $buttonSize={size}
          $iconPosition={iconPosition}
          $isLoading={isLoading}
          aria-hidden
          data-testid="button-icon"
        >
          {icon}
        </StyledIconWrapper>
      )}
    </StyledButton>
  )
}

Button.displayName = 'Button'
