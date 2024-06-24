/* eslint-disable no-undef */
describe('Test login error', () => {
  it('visit login page', () => {
    cy.visit('/')
  })
  it('required username', () => {
    cy.get('[data-cy=submit]').click()
    cy.get('.ant-form-item-explain-error').should('contain', 'Please input your username!')
    cy.get('.ant-form-item-explain-error').should('contain', 'Please input your password!')
  })
})
describe('Test login success', () => {
  it('visit login page', () => {
    cy.wait(1000)
    cy.visit('/login')
  })
  it('login success', () => {
    // input username and password
    cy.get('[data-cy=username]').type('admin')

    // {enter} causes the form to submit
    cy.get('[data-cy=password]').type('111111{enter}')
    cy.url().should('contain', '/list')
  })
})
