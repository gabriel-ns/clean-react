import faker from 'faker'
import * as FormHelper from '../support/form-helper'
import * as Http from '../support/signup-mocks'

const fillForm = (): void => {
  cy.getByTestId('name').focus().type(faker.name.findName())
  cy.getByTestId('email').focus().type(faker.internet.email())
  const password = faker.random.alphaNumeric(5)
  cy.getByTestId('password').focus().type(password)
  cy.getByTestId('passwordConfirmation').focus().type(password)
}

const simulateValidSubmit = (): void => {
  fillForm()
  cy.getByTestId('submit').click()
}

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readonly')
    FormHelper.testInputStatus('name', 'Campo Obrigatório')

    cy.getByTestId('email').should('have.attr', 'readonly')
    FormHelper.testInputStatus('email', 'Campo Obrigatório')

    cy.getByTestId('password').should('have.attr', 'readonly')
    FormHelper.testInputStatus('password', 'Campo Obrigatório')

    cy.getByTestId('passwordConfirmation').should('have.attr', 'readonly')
    FormHelper.testInputStatus('passwordConfirmation', 'Campo Obrigatório')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').focus().type(faker.random.alphaNumeric(1))
    FormHelper.testInputStatus('name', 'field is invalid')

    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'field is invalid')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'field is invalid')

    cy.getByTestId('passwordConfirmation').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('passwordConfirmation', 'field is invalid')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('name').focus().type(faker.name.firstName())
    FormHelper.testInputStatus('name')

    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')

    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('password').focus().type(password)
    FormHelper.testInputStatus('password')

    cy.getByTestId('passwordConfirmation').focus().type(password)
    FormHelper.testInputStatus('passwordConfirmation')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
  })

  it('Should present EmailInUse error on 403', () => {
    Http.mockEmailInUseError()

    simulateValidSubmit()

    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    FormHelper.testMainError('Esse email já está em uso')
    FormHelper.testUrl('/signup')
  })

  it('Should save accessToken if valid form is provided', () => {
    const accessToken = faker.datatype.uuid()
    Http.mockOk({ accessToken })

    simulateValidSubmit()
    cy.getByTestId('error-wrap')
      .getByTestId('main-error').should('not.exist')

    FormHelper.testUrl('/')
    FormHelper.testLocalStorageItem('access-token', accessToken)
  })

  it('Should present UnexpectedError on any error code', () => {
    Http.mockUnexpectedError()

    simulateValidSubmit()

    FormHelper.testMainError('Algo deu errado. Tente novamente mais tarde')

    FormHelper.testUrl('/signup')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    Http.mockOk({ [faker.random.word()]: faker.random.words() })

    simulateValidSubmit()

    FormHelper.testMainError('Algo deu errado. Tente novamente mais tarde')

    FormHelper.testUrl('/signup')
  })

  it('Should prevent multiple submits', () => {
    Http.mockOk()

    cy.getByTestId('name').focus().type(faker.name.findName())
    cy.getByTestId('email').focus().type(faker.internet.email())
    const password = faker.random.alphaNumeric(5)
    cy.getByTestId('password').focus().type(password)
    cy.getByTestId('passwordConfirmation').focus().type(password)
    cy.getByTestId('submit').click().click()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should submit form by pressing enter when password confirmation is in focus', () => {
    Http.mockOk()

    fillForm()
    cy.getByTestId('passwordConfirmation').type('{enter}')
    FormHelper.testHttpCallsCount(1)
  })
})
