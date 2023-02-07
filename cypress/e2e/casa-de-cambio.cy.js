const URL = 'http://127.0.0.1:8080';
/// <reference types="cypress" />
context('Casa de cambio', ()=>{
	describe('Verificar si los botones para cambiar de tipo de cambio a conversion funcionan', () => {
		before('Visitar la pagina', () => {
			cy.visit(URL);
		});
		it('Se asegura que los botones funcionen y muestren los paneles correctos', () => {
      cy.get('#conversion').click().then(()=>{
        cy.get('#contenedor-conversion').should('be.visible');
      })
      cy.get('#cambio').click().then(()=>{
        cy.get('#contenedor-cambio').should('be.visible');
      })
		});
	});
  describe('Verificar si la casa de cambio funciona correctamente', () =>{
    beforeEach('Visitar la pagina', () => {
      cy.visit(URL)
    })
    it('Se asegura que tipo de cambio funcione',() =>{
      cy.get('#cambio').click().then(()=>{
        cy.get('#contenedor-cambio').should('be.visible');
      })
      cy.get('#deshabilitado').should('be.disabled');
      cy.get('#moneda-eleccion').should('be.visible').then(()=>{
        cy.get('#moneda-eleccion').select('EUR').should('have.value', 'EUR')
        cy.get('#moneda-eleccion').select('CNY').should('have.value', 'CNY')
        cy.get('#moneda-eleccion').select('MXN').should('have.value', 'MXN')
      })
      cy.get('#moneda-eleccion').select('MXN').then(()=>{
        cy.get('#ingresar').click()
        cy.get('h2').contains('Ultima actualizacion');
        cy.get('li').should('have.length.greaterThan', 2)
      })
    })
    it('Se asegura que conversion funcione MXN a ARS',()=>{
      cy.get('#conversion').click().then(()=>{
        cy.get('#contenedor-conversion').should('be.visible');
      })
      cy.get('#dinero-ingresado').clear().then(()=>{
        cy.get('#dinero-ingresado').type('15000')
      })
      cy.get('#moneda-base').select('MXN')
      cy.get('#moneda-cambiar').select('ARS')
      cy.get('#convertir').click().then(()=>{
        cy.get('h2').contains('Ultima actualizacion');
        cy.get('li').should('have.length', 2)
      })
    })
    it('Se asegura que conversion funcione con ARS a USD',() =>{
      cy.get('#conversion').click().then(()=>{
        cy.get('#contenedor-conversion').should('be.visible');
      })
      cy.get('#dinero-ingresado').clear().then(()=>{
        cy.get('#dinero-ingresado').type('100000')
      })
      cy.get('#moneda-cambiar').select('USD')
      cy.get('#convertir').click().then(()=>{
        cy.get('h2').contains('Ultima actualizacion');
        cy.get('li').should('have.length', 2)
      })
    })
  })
})

