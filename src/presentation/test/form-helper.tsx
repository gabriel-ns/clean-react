import { RenderResult } from '@testing-library/react'

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
