import { render, RenderResult } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Signup from './signup'

type SutTypes = {
  sut: RenderResult
  history: MemoryHistory
}

const makeSut = (): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/signup'] })
  const sut = render(
    <Router navigator={ history } location={ history.location }>
      <Signup />
    </Router>)
  return {
    sut,
    history
  }
}

const testChildCount = (sut: RenderResult, fieldTestId: string, count: number): void => {
  const el = sut.getByTestId(fieldTestId)
  expect(el.childElementCount).toBe(count)
}

const testButtonDisabled = (sut: RenderResult, fieldTestId: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldTestId) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Signup Component', () => {
  test('Should not render spinner and error on start', () => {
    const { sut } = makeSut()
    testChildCount(sut, 'error-wrap', 0)
  })

  test('Should disable submit button on start', () => {
    const { sut } = makeSut()
    testButtonDisabled(sut, 'submit', true)
  })
})
