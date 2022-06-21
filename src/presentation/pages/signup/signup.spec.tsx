import { cleanup, render, RenderResult } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Signup from './signup'
import faker from 'faker'
import { Helper, ValidationStub } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  history: MemoryHistory
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/signup'] })
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError

  const sut = render(
    <Router navigator={ history } location={ history.location }>
      <Signup validation={validationStub} />
    </Router>)
  return {
    sut,
    history
  }
}

describe('Signup Component', () => {
  afterEach(cleanup)

  test('Should not render spinner and error on start', () => {
    const { sut } = makeSut()
    Helper.testChildCount(sut, 'error-wrap', 0)
  })

  test('Should disable submit button on start', () => {
    const { sut } = makeSut()
    Helper.testButtonDisabled(sut, 'submit', true)
  })

  test('Should set error state on start', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testStatusForField(sut, 'email-status', validationError)
    Helper.testStatusForField(sut, 'name-status', validationError)
    Helper.testStatusForField(sut, 'password-status', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation-status', 'Campo Obrigatório')
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name-status', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email-status', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password-status', validationError)
  })
})
