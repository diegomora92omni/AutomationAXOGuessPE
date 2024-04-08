// ***********************************************
// Este archivo commands.js te muestra cómo crear
// comandos personalizados y sobrescribir
// comandos existentes.
//
// Para ejemplos más completos de comandos
// personalizados, por favor lee más aquí:
// https://on.cypress.io/custom-commands
// ***********************************************

const faker = require('faker');
import { generateRUT, generateRandomPhoneNumber } from './utils';

// Variables para almacenar el estado inicial del carrito
// y el número inicial de productos en el carrito
let initialCartState;
let initialItemCount;

// -- Comando Personalizado para Llenar el Formulario de Registro con Datos Aleatorios --
Cypress.Commands.add('fillRegisterFormWithRandomData', () => {
  const nombreAleatorio = faker.name.firstName();
  const apellidoAleatorio = faker.name.lastName();
  const emailAleatorio = faker.internet.email(null, null, "yopmail.com");

  cy.get('#firstname').type(nombreAleatorio);
  cy.get('#lastname').type(apellidoAleatorio);
  cy.get('#is_subscribed').check();

  cy.get('#email_address').type(emailAleatorio);
  
  // Llenar el campo RUT automáticamente
  cy.fillRUT();

  // Llenar automáticamente el campo de fecha de nacimiento
  cy.fillDOBField();

  // Seleccionar el género de manera aleatoria
  const generos = ["1", "2", "3"];
  const generoAleatorio = generos[Math.floor(Math.random() * generos.length)];
  cy.get('#gender').select(generoAleatorio);

  // Generar y llenar el campo de teléfono con un número aleatorio de 8 a 10 dígitos
  const telefonoAleatorio = generateRandomPhoneNumber();
  cy.get('#telefono').type(telefonoAleatorio);
});

// -- Comando Personalizado para Generar y Llenar el Campo RUT en creación de cuenta--
Cypress.Commands.add('fillRUT', () => {
  const rut = generateRUT();
  cy.get('input#identification_number').type(rut);
});

// -- Comando Personalizado para Llenar el Campo de Fecha de Nacimiento con una Fecha Válida --
Cypress.Commands.add('fillDOBField', () => {
  const currentYear = new Date().getFullYear();
  const year = currentYear - 18 - Math.floor(Math.random() * 20); // Entre 18 y 37 años atrás.
  const month = Math.floor(Math.random() * 12) + 1; // 1-12
  const day = Math.floor(Math.random() * 28) + 1; // 1-28 para simplificar
  const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  
  cy.get('input#dob').type(formattedDate, { force: true });
});

// -- Comandos Personalizados para Selecciones Aleatorias en el Flujo de Agregar al Carrito --

// Seleccionar una categoría aleatoria
Cypress.Commands.add('selectRandomCategory', () => {
  cy.get('ul#ui-id-1 > li > a').then($links => {
    const randomIndex = Math.floor(Math.random() * $links.length);
    cy.wrap($links).eq(randomIndex).click({force: true});
  });
});

// Seleccionar un producto aleatorio
Cypress.Commands.add('selectRandomProduct', () => {
  cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then($products => {
    const randomIndex = Math.floor(Math.random() * $products.length);
    cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
  });
});

// Seleccionar un color aleatorio
Cypress.Commands.add('selectRandomColor', () => {
  cy.get('.swatch-attribute.color').should('be.visible').then($colorContainer => {
    cy.get('.swatch-attribute.color .swatch-option.color').should('be.visible').then($colors => {
      if ($colors.length > 0) {
        const randomIndex = Math.floor(Math.random() * $colors.length);
        cy.wrap($colors).eq(randomIndex).click();
      }
    });
  });
});

// Seleccionar un tamaño aleatorio
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
    expect($newCartState.text().trim()).not.to.equal(initialCartState);
  });
});

// Verificar el aumento de la cantidad de artículos en el carrito
Cypress.Commands.add('verifyItemCountIncrease', () => {
  cy.get('.counter.qty .counter-number').then(($counter) => {
    const counterText = $counter.text().trim();
    const newItemCount = isNaN(counterText) ? 0 : parseInt(counterText);
    expect(newItemCount).to.equal(initialItemCount + 1);
  });
});

// Verificar si se muestra el mensaje de éxito
Cypress.Commands.add('verifySuccessMessageDisplayed', () => {
  cy.get('.message-success').should('be.visible');
});

// Inicio de sesión previo a flujo de compra

Cypress.Commands.add('login', (email, password) => {
  cy.contains('a', 'Entrar').click({force: true});
  cy.get('#email').type(email);
  cy.get('#pass').type(password);
  cy.get('#send2').click();
});

// -- Comando Personalizado para Generar y Llenar el Campo RUT en checkout--
Cypress.Commands.add('fillRUTco', () => {
  const rut = generateRUT();
  cy.get('input[name="custom_attributes[identification_number]"]').type(rut)
});

// Define el comando personalizado para generar y utilizar un número de teléfono aleatorio
Cypress.Commands.add('generateRandomPhoneNumber', () => {
  const phoneNumber = generateRandomPhoneNumber(); // Utiliza la función importada
  return phoneNumber; // Devuelve el número generado
});

Cypress.Commands.add('createAccount', (password) => {
  // Hacer clic en el botón "Crear una cuenta"
  cy.contains('a', 'Crear').click({force: true})

  // Utilizar el comando personalizado para rellenar el formulario de registro
  cy.fillRegisterFormWithRandomData()

  // Contraseña
  cy.get('#password').type('Pruebas123*')
  cy.get('#password-confirmation').type('Pruebas123*')

  //Aceptar las políticas de privacidad de datos
  cy.get('#data_privacy_policies_allowed').check();

  // Enviar el formulario
  cy.get('#send2').click()


  //Verificar mensaje de registro exitoso
  cy.get('.message-success').should('exist')
});