Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Camilla')
    cy.get('#lastName').type('Damiani')
    cy.get('#email').type('camilla.damianii@gmail.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})