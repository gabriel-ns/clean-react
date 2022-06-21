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
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testButtonDisabled(sut, 'submit', true)
  })

  test('Should set error state on start', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testStatusForField(sut, 'email-status', validationError)
    Helper.testStatusForField(sut, 'name-status', validationError)
    Helper.testStatusForField(sut, 'password-status', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation-status', validationError)
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

  test('Should show password confirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation-status', validationError)
  })

  test('Should show valid name state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name-status')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email-status')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password-status')
  })

  test('Should show valid passwordConfirmation state if Validation succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation-status')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testButtonDisabled(sut, 'submit', false)
  })
})
