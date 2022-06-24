export const testInputStatus = (fieldName: string, error?: string): void => {
  cy.getByTestId(`${fieldName}-wrap`).should('have.attr', 'data-status', error ? 'invalid' : 'valid')
  const attr = `${error ? '' : 'not.'}have.attr`
  cy.getByTestId(`${fieldName}`).should(attr, 'title', error)
  cy.getByTestId(`${fieldName}-label`).should(attr, 'title', error)
}

export const testMainError = (error: string): void => {
  cy.getByTestId('spinner').should('not.exist')
  cy.getByTestId('main-error').should('contain.text', error)
}

export const testHttpCallsCount = (count: number): void => {
  cy.get('@request.all').should('have.length', count)
}

export const testUrl = (path: string): void => {
  const baseUrl: string = Cypress.config().baseUrl
  cy.url().should('equal', `${baseUrl}${path}`)
}

export const testLocalStorageItem = (key: string, value: string): void => {
  cy.window().then(window => {
    assert.equal(window.localStorage.getItem(key), value)
  })
}
