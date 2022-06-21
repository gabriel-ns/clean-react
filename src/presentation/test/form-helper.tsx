import { fireEvent, RenderResult } from '@testing-library/react'
import faker from 'faker'

export const testChildCount = (sut: RenderResult, fieldTestId: string, count: number): void => {
  const el = sut.getByTestId(fieldTestId)
  expect(el.childElementCount).toBe(count)
}

export const testButtonDisabled = (sut: RenderResult, fieldTestId: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldTestId) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

export const populateField = (sut: RenderResult, fieldTestId: string, value = faker.random.word()): void => {
  const input = sut.getByTestId(fieldTestId)
  fireEvent.input(input, { target: { value } })
}

export const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}
