import faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('have.attr', 'readonly')

    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')

    cy.getByTestId('email-label')
      .should('have.attr', 'title', 'Campo Obrigatório')

    cy.getByTestId('password')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('have.attr', 'readonly')

    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid')

    cy.getByTestId('password-label')
      .should('have.attr', 'title', 'Campo Obrigatório')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('email').should('have.attr', 'title', 'field is invalid')
    cy.getByTestId('email-label').should('have.attr', 'title', 'field is invalid')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid')
    cy.getByTestId('password').should('have.attr', 'title', 'field is invalid')
    cy.getByTestId('password-label').should('have.attr', 'title', 'field is invalid')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'valid')
    cy.getByTestId('email').should('not.have.attr', 'title')
    cy.getByTestId('email-label').should('not.have.attr', 'title')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'valid')
    cy.getByTestId('password').should('not.have.attr', 'title')
    cy.getByTestId('password-label').should('not.have.attr', 'title')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
  })

  it('Should present error if invalid credentials are provided', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 401,
      body: { error: faker.random.words() }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()

    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('exist')
      .getByTestId('main-error').should('not.exist')
      .getByTestId('spinner').should('not.exist')
      .getByTestId('main-error').should('contain.text', 'Credenciais inválidas')
    cy.url().should('equal', `${baseUrl}/login`)
  })

  it('Should save accessToken if valid credentials are provided', () => {
    const accessToken = faker.datatype.uuid()
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 200,
      body: { accessToken }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(6))
    cy.getByTestId('submit').click()
    cy.getByTestId('error-wrap')
      .getByTestId('main-error').should('not.exist')

    cy.url().should('equal', `${baseUrl}/`)

    cy.window().then(window => {
      assert.equal(window.localStorage.getItem('access-token'), accessToken)
    })
  })

  it('Should present UnexpectedError on 400', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 400,
      body: { error: faker.random.words() }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()

    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('not.exist')
      .getByTestId('main-error').should('contain.text', 'Algo deu errado. Tente novamente mais tarde')
    cy.url().should('equal', `${baseUrl}/login`)
  })

  it('Should present UnexpectedError if invalid data is returned', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 200,
      body: { [faker.random.word()]: faker.random.words() }
    })

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()

    cy.getByTestId('error-wrap')
      .getByTestId('spinner').should('not.exist')
      .getByTestId('main-error').should('contain.text', 'Algo deu errado. Tente novamente mais tarde')
    cy.url().should('equal', `${baseUrl}/login`)
  })

  it('Should prevent multiple submits', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 200,
      body: { [faker.random.word()]: faker.random.words() }
    }).as('request')

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('submit').click()
    cy.getByTestId('submit').click()
    cy.get('@request.all').should('have.length', 1)
  })

  it('Should submit form by pressing enter when password is in focus', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 200,
      body: { [faker.random.word()]: faker.random.words() }
    }).as('login')

    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5)).type('{enter}')
    cy.get('@login.all').should('have.length', 1)
  })

  it('Should submit form by pressing enter when password is in focus', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 200,
      body: { [faker.random.word()]: faker.random.words() }
    }).as('login')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    cy.get('@login.all').should('have.length', 1)
  })

  it('Should not call submit if form is invalid', () => {
    cy.intercept('POST', /login/, {
      delay: 100,
      statusCode: 200,
      body: { [faker.random.word()]: faker.random.words() }
    }).as('login')

    cy.getByTestId('email').focus().type(faker.internet.email()).type('{enter}')
    cy.get('@login.all').should('have.length', 0)
  })
})
