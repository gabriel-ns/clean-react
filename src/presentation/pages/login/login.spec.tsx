import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import faker from 'faker'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test/'
import { InvalidCredentialsError } from '@/domain/errors'
import { act } from 'react-dom/test-utils'
import { SaveAccessTokenMock } from '@/presentation/test/mock-save-access-token'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  history: MemoryHistory
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/login'] })
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router navigator={ history } location={ history.location }>
      <Login
        validation={ validationStub }
        authentication={ authenticationSpy }
        saveAccessToken={ saveAccessTokenMock }
        />
    </Router>)
  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock,
    history
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await act(async () => {
    populateEmailField(sut, email)
    populatePasswordField(sut, password)
    const form = sut.getByTestId('form')
    fireEvent.submit(form)
    await waitFor(() => form)
  })
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

const testButtonDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should not render spinner and error on start', () => {
    const { sut } = makeSut()
    testErrorWrapChildCount(sut, 0)
  })

  test('Should disable submit button on start', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testButtonDisabled(sut, 'submit', true)
  })

  test('Should set error state on start', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testStatusForField(sut, 'email-status', validationError)
    testStatusForField(sut, 'password-status', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateEmailField(sut)
    testStatusForField(sut, 'email-status', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    testStatusForField(sut, 'password-status', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    testStatusForField(sut, 'email-status')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    testStatusForField(sut, 'password-status')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    populateEmailField(sut)
    testButtonDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const password = faker.internet.password()
    const email = faker.internet.email()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is not valid', async () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, history, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toEqual(authenticationSpy.account.accessToken)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })

  test('Should go to signup page', () => {
    const { sut, history } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.location.pathname).toBe('/signup')
    expect(history.index).toBe(1)
  })

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)
  })
})
