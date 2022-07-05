
import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Signup from './signup'
import faker from 'faker'
import { Helper, ValidationStub } from '@/presentation/test'
import { act } from 'react-dom/test-utils'
import { AddAccountSpy } from '@/presentation/test/mock-add-account'
import { EmailInUseError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { ApiContext } from '@/presentation/contexts'

type SutTypes = {
  history: MemoryHistory
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: jest.Mock<(account: AccountModel) => void>
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/signup'] })
  const addAccountSpy = new AddAccountSpy()
  const validationStub = new ValidationStub()
  const setCurrentAccountMock = jest.fn()
  validationStub.errorMessage = params?.validationError

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router navigator={ history } location={ history.location }>
        <Signup
          validation={validationStub}
          addAccount={addAccountSpy}
        />
      </Router>
    </ApiContext.Provider>
  )
  return {
    history,
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  await act(async () => {
    Helper.populateField('name', name)
    Helper.populateField('email', email)
    Helper.populateField('password', password)
    Helper.populateField('passwordConfirmation', password)
    const form = screen.getByTestId('form')
    fireEvent.submit(form)
    await waitFor(() => form)
  })
}

describe('Signup Component', () => {
  test('Should not render spinner and error on start', () => {
    makeSut()
    Helper.testChildCount('error-wrap', 0)
  })

  test('Should disable submit button on start', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.testButtonDisabled('submit', true)
  })

  test('Should set error state on start', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('name', validationError)
    Helper.testStatusForField('password', validationError)
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('name')
    Helper.testStatusForField('name', validationError)
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

  test('Should show password confirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation', validationError)
  })

  test('Should show valid name state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('name')
    Helper.testStatusForField('name')
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

  test('Should show valid passwordConfirmation state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('passwordConfirmation')
    Helper.testStatusForField('passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()
    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')
    Helper.testButtonDisabled('submit', false)
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmit()
    Helper.testElementExists('spinner')
  })

  test('Should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const password = faker.internet.password()
    const email = faker.internet.email()
    const name = faker.name.findName()
    await simulateValidSubmit(name, email, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call Authentication only once', async () => {
    const { addAccountSpy } = makeSut()
    await simulateValidSubmit()
    await simulateValidSubmit()
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is not valid', async () => {
    const validationError = faker.random.words()
    const { addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmit()
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit()
    Helper.testElementText('main-error', error.message)
    Helper.testChildCount('error-wrap', 1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { addAccountSpy, history, setCurrentAccountMock } = makeSut()
    await simulateValidSubmit()
    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })

  test('Should go to login page', () => {
    const { history } = makeSut()
    const loginLink = screen.getByTestId('login-link')
    fireEvent.click(loginLink)
    expect(history.location.pathname).toBe('/login')
    expect(history.index).toBe(1)
  })
})
