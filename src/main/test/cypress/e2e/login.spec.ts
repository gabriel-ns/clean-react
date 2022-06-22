import faker from 'faker'

const baseUrl: string = Cypress.config().baseUrl

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Should load with correct initial state', () => {
    cy.getByTestId('email')
      .should('have.attr', 'readonly')

    cy.getByTestId('password')
      .should('have.attr', 'readonly')

    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴')

    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'field is invalid')
      .should('contain.text', '🔴')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3))
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'field is invalid')
      .should('contain.text', '🔴')

    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email())
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢')

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5))
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢')

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
})
