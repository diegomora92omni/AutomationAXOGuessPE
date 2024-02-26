// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const faker = require('faker');

// Variables para almacenar el estado inicial del carrito y el número inicial de productos en el carrito
let initialCartState;
let initialItemCount;

// -- Custom Command to Fill Registration Form with Random Data --
Cypress.Commands.add('fillRegisterFormWithRandomData', () => {
  const nombreAleatorio = faker.name.firstName();
  const apellidoAleatorio = faker.name.lastName();
  const emailAleatorio = faker.internet.email();

  cy.get('#firstname').type(nombreAleatorio);
  cy.get('#lastname').type(apellidoAleatorio);
  cy.get('#email_address').type(emailAleatorio);
  // Add more fields here if necessary
});

// -- Custom Commands for Random Selections in Add to Cart Flow --

// Select a random category
Cypress.Commands.add('selectRandomCategory', () => {
  cy.get('.level-top.mega').then($categories => {
    const randomIndex = Math.floor(Math.random() * $categories.length);
    cy.wrap($categories).eq(randomIndex).click();
  });
});

// Select a random product
Cypress.Commands.add('selectRandomProduct', () => {
  cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then($products => {
    const randomIndex = Math.floor(Math.random() * $products.length);
    cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
  });
});

// Select a random color
Cypress.Commands.add('selectRandomColor', () => {
  // Espera hasta que el contenedor de colores esté visible
  cy.get('.swatch-attribute.color').should('be.visible').then($colorContainer => {
    // Espera hasta que haya opciones de colores disponibles
    cy.get('.swatch-attribute.color .swatch-option.color').should('be.visible').then($colors => {
      if ($colors.length > 0) {
        // Seleccione un color aleatorio
        const randomIndex = Math.floor(Math.random() * $colors.length);
        cy.wrap($colors).eq(randomIndex).click();
      } else {
        // Si no se encuentran opciones de colores, se puede manejar la situación aquí
        // Por ejemplo, seleccionando un producto que tenga colores disponibles
        // cy.log('No se encontraron opciones de colores disponibles.');
      }
    });
  });
});

// Select a random size
Cypress.Commands.add('selectRandomSize', () => {
  cy.get('.swatch-attribute.size .swatch-option.text').then($sizes => {
    if ($sizes.length > 0) {
      const randomIndex = Math.floor(Math.random() * $sizes.length);
      cy.wrap($sizes).eq(randomIndex).click();
    }
  });
});

// Agregar un artículo al carrito
Cypress.Commands.add('addItemToCart', () => {
  cy.get('#product-addtocart-button').click();
});

// Verificar el cambio de estado del carrito
Cypress.Commands.add('verifyCartStateChange', () => {
  cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
    // Verificar si el estado del carrito cambió correctamente
    expect($newCartState.text().trim()).not.to.equal(initialCartState);
  });
});

// Verificar el aumento de la cantidad de artículos
Cypress.Commands.add('verifyItemCountIncrease', () => {
  cy.get('.counter.qty .counter-number').then(($counter) => {
    const counterText = $counter.text().trim();
    // Verifica si counterText es un número válido
    const newItemCount = isNaN(counterText) ? 0 : parseInt(counterText);
    expect(newItemCount).to.equal(initialItemCount + 1);
});

});

// Verificar si se muestra el mensaje de éxito
Cypress.Commands.add('verifySuccessMessageDisplayed', () => {
  cy.get('.message-success').should('be.visible');
});
