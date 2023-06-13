import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import styled from 'styled-components'
import { useArgs } from '@storybook/addons'


import { Combobox } from '.'
import { AutocompleteOption } from '../Autocomplete'


export default {
  component: Combobox,
  title: 'Combobox',
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
  args: {
    label: 'Combobox label',
  },
} as ComponentMeta<typeof Combobox>

const StyledWrapper = styled.div<{ $isDisabled?: boolean }>`
  height: ${({ $isDisabled }) => ($isDisabled ? 'initial' : '18rem')};
  max-width: 20rem;
`

const Template: ComponentStory<typeof Combobox> = (args) => {
  const [{value}, updateArgs] = useArgs()
  return (
    <StyledWrapper $isDisabled={args.isDisabled}>
      {value}
      <Combobox {...args} value={value} onChange={(v)=> {updateArgs({value: v})}}>
        <AutocompleteOption value="one">One</AutocompleteOption>
        <AutocompleteOption value="two">Two</AutocompleteOption>
        <AutocompleteOption value="three">Three</AutocompleteOption>
      </Combobox>
    </StyledWrapper>
  )
}

export const Default = Template.bind({})
