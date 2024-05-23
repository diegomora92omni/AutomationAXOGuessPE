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
import { generateRandomPhoneNumber } from './utils';

// Variables para almacenar el estado inicial del carrito
// y el número inicial de productos en el carrito
let initialCartState;
let initialItemCount;

// cypress/support/commands.js

// Comando para seleccionar un tipo de documento de forma aleatoria
Cypress.Commands.add('selectDocumentType', () => {
  cy.get('#type_identification').then(select => {
    const options = select.find('option');
    const randomIndex = Math.floor(Math.random() * options.length);
    const randomValue = options.eq(randomIndex).val();
    cy.get('#type_identification').select(randomValue);
    return cy.wrap(randomValue); // Retorna el valor para su uso posterior
  });
});

// Comando para generar un número de identificación basado en el tipo seleccionado
Cypress.Commands.add('generateIdentification', (type) => {
  let length;
  if (type === '4') { // DNI
    length = 8;
  } else if (type === '7') { // Cédula de extranjería
    length = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
  } else if (type === '10') { // Pasaporte
    length = Math.floor(Math.random() * (12 - 9 + 1)) + 9;
  }

  let identification = '';
  for (let i = 0; i < length; i++) {
    identification += Math.floor(Math.random() * 10);
  }
  return cy.wrap(identification); // Retorna el número generado
});

// Comando Personalizado para Llenar el Campo de Fecha de Nacimiento con una Fecha Válida
Cypress.Commands.add('fillDOBField', () => {
  const currentYear = new Date().getFullYear();
  const year = currentYear - 18 - Math.floor(Math.random() * 20); // Entre 18 y 37 años atrás.
  const month = Math.floor(Math.random() * 12) + 1; // 1-12
  const day = Math.floor(Math.random() * 28) + 1; // 1-28 para simplificar
  const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  
  cy.get('input#dob').type(formattedDate, { force: true });
});

// Comando Personalizado para Llenar el Formulario de Registro con Datos Aleatorios
Cypress.Commands.add('fillRegisterFormWithRandomData', () => {
  const nombreAleatorio = faker.name.firstName();
  const apellidoAleatorio = faker.name.lastName();
  const emailAleatorio = faker.internet.email(null, null, "yopmail.com");

  cy.get('#firstname').type(nombreAleatorio);
  cy.get('#lastname').type(apellidoAleatorio);
  cy.get('#is_subscribed').check();

  // Llenar automáticamente el campo de fecha de nacimiento
  cy.fillDOBField();

  // Seleccionar el género de manera aleatoria
  const generos = ["1", "2", "3"];
  const generoAleatorio = generos[Math.floor(Math.random() * generos.length)];
  cy.get('#gender').select(generoAleatorio);

  // Generar y llenar el campo de teléfono con un número aleatorio que empiece por 9 y contenga 9 dígitos
  const telefonoAleatorio = generateRandomPhoneNumber();
  cy.get('#telefono').type(telefonoAleatorio);

  // Asegura que el valor seleccionado del desplegable no sea vacío
  cy.get('#parent_type_identification').should($select => {
    const value = $select.val();
    expect(value).to.not.be.empty;
  });

  // Nuevo: Seleccionar tipo de documento y llenar el número de identificación
  cy.selectDocumentType().then(typeValue => {
    cy.generateIdentification(typeValue).then(identificationNumber => {
      cy.get('#identification_number').type(identificationNumber);
    });
  });

  cy.get('#email_address').type(emailAleatorio);

});

// -- Comandos Personalizados para Selecciones Aleatorias en el Flujo de Agregar al Carrito --

// Seleccionar una categoría aleatoria de "Mujer" o "Hombre"
Cypress.Commands.add('selectRandomCategory', () => {
  cy.get('ul#ui-id-1 > li > a').then($links => {
    // Filtrar solo los enlaces que contienen el texto "Mujer" o "Hombre"
    const filteredLinks = $links.filter((index, link) => {
      return link.textContent.includes('Mujer') || link.textContent.includes('Hombre');
    });

    // Asegurarse de que hay enlaces para elegir
    if (filteredLinks.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredLinks.length);
      cy.wrap(filteredLinks).eq(randomIndex).click({force: true});
    } else {
      throw new Error('No se encontraron categorías de "Mujer" o "Hombre"');
    }
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

// Comando Personalizado para seleccionar tipo de documento en checkout
Cypress.Commands.add('selectDocumentTypeCO', () => {
  // Usa un selector que dependa del atributo `name` para seleccionar el elemento `<select>`
  cy.get('select[name="custom_attributes[type_identification]"]').then(select => {
    const options = select.find('option');
    const randomIndex = Math.floor(Math.random() * options.length);
    const randomValue = options.eq(randomIndex).val();
    // Utiliza el selector con el atributo `name` para seleccionar el valor aleatorio
    cy.get('select[name="custom_attributes[type_identification]"]').select(randomValue);
    return cy.wrap(randomValue); // Retorna el valor para su uso posterior
  });
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

// Define el comando personalizado para seleccionar un método de envío aleatorio
Cypress.Commands.add('selectRandomShippingMethod', () => {
  cy.get('#checkout-shipping-method-load .table-checkout-shipping-method tbody tr.row').then($rows => {
    // Asegurarse de que haya métodos de envío disponibles
    const shippingMethods = $rows.find('input[type="radio"]:enabled');
    const count = shippingMethods.length;

    // Verificar que hay opciones disponibles
    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      const randomShippingMethod = shippingMethods.eq(randomIndex);

      // Hacer clic en el método seleccionado aleatoriamente
      randomShippingMethod.click();
    } else {
      throw new Error('No se encontraron métodos de envío habilitados.');
    }
  });
});

Cypress.Commands.add('selectRandomValidOption', { prevSubject: 'element' }, ($select) => {
  // Asumiendo que el placeholder tiene valor "0" y que las opciones no seleccionables están deshabilitadas
  const $options = $select.find('option:not(:disabled)').not('[value="0"]');
  if ($options.length > 0) {
      const randomOptionIndex = Math.floor(Math.random() * $options.length);
      const randomValue = $options.eq(randomOptionIndex).val();
      cy.wrap($select).select(randomValue);
  } else {
      cy.log('No hay opciones válidas disponibles para seleccionar.');
  }
});
