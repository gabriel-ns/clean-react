import { render, RenderResult } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Signup from './signup'
import { Helper } from '@/presentation/test'

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

describe('Signup Component', () => {
  test('Should not render spinner and error on start', () => {
    const { sut } = makeSut()
    Helper.testChildCount(sut, 'error-wrap', 0)
  })

  test('Should disable submit button on start', () => {
    const { sut } = makeSut()
    Helper.testButtonDisabled(sut, 'submit', true)
  })

  test('Should set error state on start', () => {
    const validationError = 'Campo Obrigatório'
    const { sut } = makeSut()
    Helper.testStatusForField(sut, 'email-status', validationError)
    Helper.testStatusForField(sut, 'name-status', validationError)
    Helper.testStatusForField(sut, 'password-status', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation-status', validationError)
  })
})
