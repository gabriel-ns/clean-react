import faker from 'faker'
import * as FormHelper from '../support/form-helper'
import * as Http from '../support/login-mocks'

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email())
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readonly')
    FormHelper.testInputStatus('email', 'Campo Obrigatório')

    cy.getByTestId('password').should('have.attr', 'readonly')
    FormHelper.testInputStatus('password', 'Campo Obrigatório')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    FormHelper.testInputStatus('email', 'field is invalid')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'field is invalid')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    FormHelper.testInputStatus('email')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('email')

    cy.getByTestId('submit').should('not.have.attr', 'disabled')
  })

  it('Should present error if invalid credentials are provided', () => {
    Http.mockInvalidCredentialsError()

    simulateValidSubmit()

    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
    FormHelper.testMainError('Credenciais inválidas')
    FormHelper.testUrl('/login')
  })

  it('Should save accessToken if valid credentials are provided', () => {
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

    FormHelper.testUrl('/login')
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    Http.mockOk({ [faker.random.word()]: faker.random.words() })

    simulateValidSubmit()

    FormHelper.testMainError('Algo deu errado. Tente novamente mais tarde')

    FormHelper.testUrl('/login')
  })

  it('Should prevent multiple submits', () => {
    Http.mockOk()

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click().click()
    FormHelper.testHttpCallsCount(1)
  })

  it('Should submit form by pressing enter when password is in focus', () => {
    Http.mockOk()

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5)).type('{enter}')
    FormHelper.testHttpCallsCount(1)
  })

  it('Should submit form by pressing enter when email is in focus', () => {
    Http.mockOk()

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}').wait('@request')
    FormHelper.testUrl('/')
    FormHelper.testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    Http.mockOk()

    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    FormHelper.testHttpCallsCount(0)
  })
})
