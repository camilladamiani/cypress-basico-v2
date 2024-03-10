/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000
    this.beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    //valida os campos e dá sucesso
    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso Teste de texto extenso.'

        cy.clock()
        
        cy.get('#firstName').type('Camilla')
        cy.get('#lastName').type('Damiani')
        cy.get('#email').type('camilla.damianii@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')

    })

    //valida os campos e se tiver erro não dá sucesso - mensagem de erro
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {

        cy.clock()

        cy.get('#firstName').type('Camilla')
        cy.get('#lastName').type('Damiani')
        cy.get('#email').type('camilla.damianii@gmail,com') //email com erro
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    //se digitar valor não numérico o campo continua vazio
    Cypress._.times(3, function() {   
    it.only('campo telefone continua vazio quando preenchido com valo     r não numérico', function() {
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')  
    })
})

    //checkbox do telefone marcado e sem número do telefone preenchido
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {

        cy.clock()
        
        cy.get('#firstName').type('Camilla')
        cy.get('#lastName').type('Damiani')
        cy.get('#email').type('camilla.damianii@gmail.com') 
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible') 

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible') 
    })

    it('preenche e confirma os dados e depois limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
        .type('Camilla')
        .should('have.value', 'Camilla')
        .clear()
        .should('have.value', '')
        cy.get('#lastName')
        .type('Damiani')
        .should('have.value', 'Damiani')
        .clear()
        .should('have.value', '')
        cy.get('#email')
        .type('camilla.damianii@gmail.com')
        .should('have.value', 'camilla.damianii@gmail.com')
        .clear()
        .should('have.value', '')
        cy.get('#phone')
        .type('48999319198')
        .should('have.value', '48999319198')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {

        cy.clock()

        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible') 

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible') 

    })

    it('envia o formuário com sucesso usando um comando customizado', function() {

        cy.clock()
        
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
        .should('have.length', 3) //contando quantos tem
        .each(function($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' }) //arrasta o arquivo para dentro do campo
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
    })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    })



  })
  