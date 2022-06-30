import React from 'react'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import Input from './input'
import Context from '@/presentation/contexts/form-context'
import faker from 'faker'

const makeSut = (fieldName = faker.database.column()): RenderResult => {
  return render(
    <Context.Provider value= {{ state: {} }}>
      <Input name={ fieldName } />
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const fieldName = faker.database.column()
    const { getByTestId } = makeSut(fieldName)
    const input = getByTestId(fieldName) as HTMLInputElement
    expect(input.readOnly).toBeTruthy()
  })

  test('Should remove readOnly on focus', () => {
    const fieldName = faker.database.column()
    const { getByTestId } = makeSut(fieldName)
    const input = getByTestId(fieldName) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.readOnly).toBeFalsy()
  })

  test('Should focus input on label click', () => {
    const fieldName = faker.database.column()
    const { getByTestId } = makeSut(fieldName)
    const input = getByTestId(fieldName)
    const label = getByTestId(`${fieldName}-label`)
    fireEvent.click(label)
    expect(document.activeElement).toBe(input)
  })
})
