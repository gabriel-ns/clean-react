import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Signup from './signup'
import faker from 'faker'
import { Helper, ValidationStub } from '@/presentation/test'
import { act } from 'react-dom/test-utils'
import { AddAccountSpy } from '@/presentation/test/mock-add-account'
import { EmailInUseError, InvalidCredentialsError } from '@/domain/errors'
import { SaveAccessTokenMock } from '@/presentation/test/mock-save-access-token'

type SutTypes = {
  sut: RenderResult
  history: MemoryHistory
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/signup'] })
  const addAccountSpy = new AddAccountSpy()
  const validationStub = new ValidationStub()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.validationError

  const sut = render(
    <Router navigator={ history } location={ history.location }>
      <Signup
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>)
  return {
    sut,
    history,
    addAccountSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await act(async () => {
    Helper.populateField(sut, 'name', name)
    Helper.populateField(sut, 'email', email)
    Helper.populateField(sut, 'password', password)
    Helper.populateField(sut, 'passwordConfirmation', password)
    const form = sut.getByTestId('form')
    fireEvent.submit(form)
    await waitFor(() => form)
  })
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

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExists(sut, 'spinner')
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const password = faker.internet.password()
    const email = faker.internet.email()
    const name = faker.name.findName()
    await simulateValidSubmit(sut, name, email, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call Authentication only once', async () => {
    const { sut, addAccountSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is not valid', async () => {
    const validationError = faker.random.words()
    const { sut, addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmit(sut)
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, addAccountSpy, history, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toEqual(addAccountSpy.account.accessToken)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    Helper.testElementText(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 'error-wrap', 1)
  })

  test('Should go to login page', () => {
    const { sut, history } = makeSut()
    const loginLink = sut.getByTestId('login-link')
    fireEvent.click(loginLink)
    expect(history.location.pathname).toBe('/login')
    expect(history.index).toBe(1)
  })
})
