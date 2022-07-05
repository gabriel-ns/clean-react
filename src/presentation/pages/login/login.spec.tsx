import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Login } from '@/presentation/pages'
import faker from 'faker'
import { ApiContext } from '@/presentation/contexts'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { ValidationStub, AuthenticationSpy, Helper } from '@/presentation/test/'
import { InvalidCredentialsError } from '@/domain/errors'
import { act } from 'react-dom/test-utils'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  history: MemoryHistory
  setCurrentAccountMock: jest.Mock<(account: AccountModel) => void>
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/login'] })
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = params?.validationError
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router navigator={ history } location={ history.location }>
        <Login
          validation={ validationStub }
          authentication={ authenticationSpy }
          />
      </Router>
    </ApiContext.Provider>
  )

  return {
    authenticationSpy,
    setCurrentAccountMock,
    history
  }
}

const simulateValidSubmit = async (email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await act(async () => {
    Helper.populateField('email', email)
    Helper.populateField('password', password)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    await waitFor(() => form)
  })
}

describe('Login Component', () => {
  test('Should not render spinner and error on start', () => {
    makeSut()
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
  })

  test('Should disable submit button on start', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    expect(screen.getByTestId('submit')).toBeDisabled()
  })

  test('Should set error state on start', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()
    Helper.populateField('password')
    Helper.populateField('email')
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmit()
    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  test('Should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut()
    const password = faker.internet.password()
    const email = faker.internet.email()
    await simulateValidSubmit(email, password)
    expect(authenticationSpy.params).toEqual({ email, password })
  })

  test('Should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut()
    await simulateValidSubmit()
    await simulateValidSubmit()
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is not valid', async () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({ validationError })
    await simulateValidSubmit()
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    await simulateValidSubmit()
    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { authenticationSpy, history, setCurrentAccountMock } = makeSut()
    await simulateValidSubmit()
    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })

  test('Should go to signup page', () => {
    const { history } = makeSut()
    const register = screen.getByTestId('signup-link')
    fireEvent.click(register)
    expect(history.location.pathname).toBe('/signup')
    expect(history.index).toBe(1)
  })
})
