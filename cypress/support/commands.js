// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- Custom Command to Get Initial Cart Count --
//Este comando obtiene el valor inicial del contador del carrito de compras. Verifica si el contador está presente en la página y devuelve su valor numérico. Si el contador no está presente o está vacío, devuelve 0.
Cypress.Commands.add('getInitialCartCount', () => {
  return cy.get('.counter.qty').then(($counter) => {
    if (!$counter.hasClass('empty')) {
      return cy.get('.counter-number').invoke('text').then((text) => {
        const cleanedText = text.trim(); // Eliminar espacios en blanco
        cy.log('Texto obtenido del contador: ' + cleanedText);
        const count = parseFloat(cleanedText);
        cy.log('Valor inicial del contador del carrito: ' + count);
        return !isNaN(count) ? count : 0; // Devuelve el número o 0 si no es un número
      });
    }
    cy.log('Contador del carrito vacío, devolviendo 0');
    return 0; // Devuelve 0 si el contador está vacío
  });
});

// -- Custom Command to Check Cart Counter --
//Este comando verifica que el contador del carrito de compras se haya actualizado al valor esperado después de realizar una acción, como añadir un producto al carrito.
Cypress.Commands.add('checkCartCounter', (expectedCount) => {
  cy.get('.counter-number').invoke('text').then((text) => {
    const cleanedText = text.trim(); // Eliminar espacios en blanco
    cy.log('Texto obtenido del contador para verificación: ' + cleanedText);
    const count = parseFloat(cleanedText);
    if (!isNaN(count)) {
      cy.log('Valor actual del contador del carrito: ' + count);
      expect(count).to.equal(expectedCount);
    } else {
      throw new Error("Contador del carrito no es un número válido. Valor obtenido: " + cleanedText);
    }
  });
});
