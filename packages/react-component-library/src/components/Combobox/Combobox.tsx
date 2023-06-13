import { isNil } from 'lodash'
import React, { useCallback } from 'react'
import { useCombobox } from 'downshift'

import {
  getSelectedItem,
  itemToString,
  SelectBaseProps,
  SelectLayout,
} from '../SelectBase'
import { NoResults } from '../Autocomplete/NoResults'
import { useAutocomplete } from '../Autocomplete/hooks/useAutocomplete'
import { useToggleButton } from '../Autocomplete/hooks/useToggleButton'
import { useExternalId } from '../../hooks/useExternalId'
import { useHighlightedIndex } from '../Autocomplete/hooks/useHighlightedIndex'
import { useMenuVisibility } from '../SelectBase/hooks/useMenuVisibility'
import { AutocompleteProps } from '../Autocomplete'

export interface ComboboxProps extends AutocompleteProps {
  text?: string
  onNotInList?: (newValue: string) => void
}

export const Combobox: React.FC<ComboboxProps> = ({
  children,
  id: externalId,
  initialIsOpen,
  initialValue,
  isInvalid = false,
  onBlur,
  onNotInList,
  onChange,
  value,
  ...rest
}) => {
  const {
    filteredItems,
    hasError: hasNoMatchingItems,
    hasFilter,
    inputRef,
    itemsMap,
    onInputValueChange,
    onIsOpenChange,
    onSelectedItemChange,
  } = useAutocomplete(React.Children.toArray(children))

  const {
    buttonRef,
    focusToggleButton,
    onInputEscapeKeyHandler,
    onToggleButtonKeyDownHandler,
  } = useToggleButton(inputRef)
  const id = useExternalId('autocomplete', externalId)

  const isControlled = value !== undefined

  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen = false,
    openMenu,
    reset,
    selectedItem,
    setHighlightedIndex,
    setInputValue,
  } = useCombobox<string>({
    initialIsOpen,
    items: filteredItems.map((item) => item.props.value),
    itemToString: (item) => itemToString(item, itemsMap),
    onInputValueChange,
    onIsOpenChange,
    onSelectedItemChange: (changes) => {
      onSelectedItemChange(changes)

      const { selectedItem: newValue } = changes

      if (onChange) {
        onChange(newValue ?? null)
      }

      focusToggleButton()
    },
    ...{
      [isControlled ? 'selectedItem' : 'initialSelectedItem']: getSelectedItem(
        isControlled ? value : initialValue,
        itemsMap
      ),
    },
  })

  const { onInputBlurHandler, onInputTabKeyHandler } = useHighlightedIndex(
    highlightedIndex,
    inputValue,
    isOpen,
    filteredItems,
    setHighlightedIndex,
    setInputValue
  )

  const { onInputFocusHandler } = useMenuVisibility(isOpen, openMenu)

  const handleInputBlur: React.FocusEventHandler<HTMLInputElement> =
    useCallback(
      (...args) => {
        onInputBlurHandler()
        onBlur?.(...args)
      },
      [onBlur, onInputBlurHandler]
    )

  const handleInputScroll: React.UIEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const input = event.currentTarget

      if (document.activeElement !== input && !hasFilter) {
        // Scroll to the beginning of the input in Firefox
        input.scrollLeft = 0
      }
    },
    [hasFilter]
  )

  const selectedItemText =
    isNil(selectedItem) || hasFilter
      ? ''
      : itemsMap[selectedItem].props.children

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isNewValue) {
      if (onNotInList) {
        onNotInList(inputValue)
      }

      // @ts-ignore - prevents the inputText being reset
      e.nativeEvent.preventDownshiftDefault = true
    }

    if (e.key === 'Tab' && isNewValue) {
      if (onNotInList) {
        onNotInList(inputValue)
      }
    }

    onInputTabKeyHandler(e)
    onInputEscapeKeyHandler(e)
  }

  const isNewValue = !!(inputValue && !filteredItems.length)
  const hasMatches = !isNewValue

  return (
    <SelectLayout
      hasLabelFocus={isOpen}
      hasSelectedItem={!!inputValue}
      hideArrowButton={isNewValue}
      id={id}
      inputProps={getInputProps({
        onBlur: handleInputBlur,
        onFocus: onInputFocusHandler,
        onKeyDown: handleKeyDown,
        onScroll: handleInputScroll,
        ref: inputRef,
      })}
      inputWrapperProps={getComboboxProps({
        'aria-expanded': isOpen,
      })}
      isInvalid={isInvalid}
      isOpen={isOpen}
      menuProps={getMenuProps()}
      onClearButtonClick={() => {
        reset()
      }}
      toggleButtonProps={getToggleButtonProps({
        onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
          onToggleButtonKeyDownHandler(e)
        },
        ref: buttonRef,
      })}
      tooltipText={selectedItemText}
      {...rest}
    >
      {isOpen &&
        filteredItems.map((child, index) => {
          return React.cloneElement(child, {
            ...child.props,
            ...getItemProps({
              index,
              item: child.props.value,
              key: `autocomplete-option-${child.props.value}`,
            }),
            inputValue,
            isHighlighted: highlightedIndex === index,
            title: child.props.children,
          })
        })}
      {inputValue && !filteredItems.length && (
        <NoResults>{inputValue}</NoResults>
      )}
    </SelectLayout>
  )
}

Combobox.displayName = 'Combobox'
