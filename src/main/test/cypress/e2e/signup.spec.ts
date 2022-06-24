import * as FormHelper from '../support/form-helper'

describe('Login', () => {
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
})
