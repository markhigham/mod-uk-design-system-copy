import React, { useCallback, useState } from 'react'
import { Autocomplete, AutocompleteProps } from '../Autocomplete'
import { SelectChildrenType } from '../SelectBase'

export interface ComboboxProps  {
  onNotInList?: (text: string) => void
  value?: string | null
  initialText?: string | null
  label: string
  children: SelectChildrenType
  isDisabled?: boolean
}

export const Combobox: React.FC<ComboboxProps> = (props) => {
  const {value,initialText, isDisabled} = props
  const [inputBoxTextValue, setInputBoxTextValue] = useState(initialText)
  const [selectedValue, setSelectedValue] = useState(initialText)

  const [isNotInList, setIsNotInList] = useState(false)
  const [hideClearButton, setHideClearButton] = useState(false)

  const handleOnBlur = useCallback((event: React.FocusEvent) => {
    setInputBoxTextValue((event.target as HTMLInputElement).value)
    console.log((event.target as HTMLInputElement).value)
    console.log(inputBoxTextValue === value)
    // setIsNotInList()

  }, [inputBoxTextValue, value])

  const handleChange = (v: string| null)=> {
    console.log(v, inputBoxTextValue)
    setHideClearButton(false)
  }

  return (
    <div>
      external value:{value}<br/>
      inputBox value:{inputBoxTextValue}<br/>
      selected value:{selectedValue}<br/>
      <Autocomplete
        isDisabled={isDisabled}
        {...props}
        onBlur={handleOnBlur}
        value={value}
        onChange={handleChange}
        hideClearButton={hideClearButton}
      />
    </div>
  )
}

Combobox.displayName = 'Combobox'
