/// <reference types='Cypress' />

describe('Test cases for Add To Cart flow', () => {
    let usuarios;
    let initialCartState;
    let initialItemCount;

    before(() => {
        cy.fixture('usuariosRegistrados').then((data) => {
            usuarios = data;
        });
    });

    beforeEach(() => {
        cy.visit('https://mcstaging.komaxchile.cl/guess_peru_store_view/');

        // Captura el estado inicial del carrito
        cy.get('.counter.qty.empty, .counter.qty').invoke('text').then((text) => {
            initialCartState = text.trim();
        });

        // Captura el número inicial de productos en el carrito
        cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
            initialItemCount = parseInt(text.trim()) || 0;
        });
    });

    context('Add to cart flow', () => {

        //Verificar que permita añadir un Producto al Carrito desde la Página de categorias (PLP) - Guest
        it('ADDP-001: Verify that you can add a Product to the Cart from the Category Page (PLP) - Guest', () => {
            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            cy.get('.products.list.items.product-items').should('be.visible');

            // Espera a que el primer elemento con la clase .toggle-product-inner sea visible y luego haz clic en él
            cy.get('.toggle-product-inner').first().click({ force: true });

            // Esperar a que el formulario dentro del pop-up sea visible
            cy.get('form[data-role="tocart-form"]').should('be.visible');

            cy.wait(5000)

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.wait(5000)

            cy.get('.swatch-select.size_tops').then($selects => {
                if ($selects.length > 0) {
                    const randomSelectIndex = Math.floor(Math.random() * $selects.length);
                    const $randomSelect = $selects.eq(randomSelectIndex);
    
                    // Paso 2: Usa el comando personalizado para seleccionar una opción válida dentro del <select> elegido
                    cy.wrap($randomSelect).selectRandomValidOption();
                } else {
                    cy.log('No se encontraron elementos <select> para seleccionar.');
                }
            });

            cy.wait(5000)

            // Agrega el producto al carrito
            cy.get('button[title="Agregar al Carrito"]').filter(':visible').first().click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            cy.get('.message-success').should('exist')

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

        });

        //Verificar que permita añadir un Producto al Carrito desde la Página de Detalle de Producto (PDP) - Guest
        it('ADDP-002: Verify that you can add a Product to the Cart from the Product Detail Page (PDP) - Guest', () => {
            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.get('.size_tops .swatch-option.text').then($options => {
            // Filtrar solo las opciones que están habilitadas
            const availableOptions = $options.filter((index, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableOptions.length > 0) {
            // Elige un índice aleatorio entre las opciones disponibles y habilitadas
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            // Realiza clic en la opción en el índice aleatorio
            cy.wrap(availableOptions).eq(randomIndex).click({force: true});
            } else {
            // Manejar el caso en que no hay tallas disponibles
            cy.log('No hay tallas disponibles para el color seleccionado.');
            }
            });  
            
            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');
        });

        //Verificar que permita añadir Múltiples Unidades de un Producto al Carrito - Guest
        it('ADDP-004: Verify that multiple units of a product can be added to the cart - Guest', () => {
            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.get('.size_tops .swatch-option.text').then($options => {
            // Filtrar solo las opciones que están habilitadas
            const availableOptions = $options.filter((index, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableOptions.length > 0) {
            // Elige un índice aleatorio entre las opciones disponibles y habilitadas
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            // Realiza clic en la opción en el índice aleatorio
            cy.wrap(availableOptions).eq(randomIndex).click({force: true});
            } else {
            // Manejar el caso en que no hay tallas disponibles
            cy.log('No hay tallas disponibles para el color seleccionado.');
            }
            });  
            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');
            
            //Hacer click en botón "Ver Carrito" de modal AÑADISTE A TU CARRO DE COMPRAS
            cy.get('button.action.secondary.viewcart').click();
        });

        //Verificar que permita añadir un Producto al Carrito y Continuar Comprando - Guest
        it('ADDP-005: Verify that you can add a Product to Cart and Continue Shopping - Guest', () => {
            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.get('.size_tops .swatch-option.text').then($options => {
            // Filtrar solo las opciones que están habilitadas
            const availableOptions = $options.filter((index, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableOptions.length > 0) {
            // Elige un índice aleatorio entre las opciones disponibles y habilitadas
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            // Realiza clic en la opción en el índice aleatorio
            cy.wrap(availableOptions).eq(randomIndex).click({force: true});
            } else {
            // Manejar el caso en que no hay tallas disponibles
            cy.log('No hay tallas disponibles para el color seleccionado.');
            }
            });  
            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');

             //Hacer click en botón para cerrar modal AÑADISTE A TU CARRO DE COMPRAS           
            cy.get('button.action-close').last().click();
            
            //Abrir pop up carrito
            cy.get('button.opencart').click();

            //Click en botón "Ver Carrito" de pop up carrito
            cy.get('button#top-cart-btn-shoppingCart').click();

            // Verifica que la URL actual incluya el path específico
            cy.url().should('include', '/checkout/cart/');

            //Click en el botón "Continuar Comprando"
            cy.get('a.action.continue[title="Continuar Comprando"]').first().click();

            // Verifica que la URL actual incluya el path específico
            cy.url().should('include', '/guess_peru_store_view');

            //REALIZAR FLUJO DE COMPRA NUEVAMENTE

        });

        //Verificar que desde la PDP NO permita añadir productos a la lista de favoritos - Guest
        it('ADDP-006: Verify that the PDP does NOT allow to add products to the list of favorites - Guest', () => {
            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Hacer clic en el enlace "Agregar a Favoritos" usando la clase y el atributo data-action
            cy.get('a.action.towishlist[data-action="add-to-wishlist"]').click();
  
            cy.wait(5000)

            // Verifica que la URL actual incluya el path específico
            cy.url().should('include', '/guess_peru_store_view/customer/account/login/');    

            // Verificar que el mensaje de error contiene el texto esperado
            cy.get('.message-error').should('contain', 'Debe iniciar sesión o registrarse para añadir artículos a sus favoritos.');
        });        

        //Verificar que permita añadir un Producto al Carrito desde la Página de categorias (PLP) - Login
        it('ADDP-007: Verify that you can add a Product to the Cart from the Category Page (PLP) - Login', () => {

            // Iniciar sesión utilizando el comando personalizado 'login'
            cy.login(usuarios[0].email, usuarios[0].password);

            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            cy.get('.products.list.items.product-items').should('be.visible');

            // Espera a que el primer elemento con la clase .toggle-product-inner sea visible y luego haz clic en él
            cy.get('.toggle-product-inner').first().click({ force: true });

            // Esperar a que el formulario dentro del pop-up sea visible
            cy.get('form[data-role="tocart-form"]').should('be.visible');

            cy.wait(5000)

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.wait(5000)

            cy.get('.swatch-select.size_tops').then($selects => {
                if ($selects.length > 0) {
                    const randomSelectIndex = Math.floor(Math.random() * $selects.length);
                    const $randomSelect = $selects.eq(randomSelectIndex);
    
                    // Paso 2: Usa el comando personalizado para seleccionar una opción válida dentro del <select> elegido
                    cy.wrap($randomSelect).selectRandomValidOption();
                } else {
                    cy.log('No se encontraron elementos <select> para seleccionar.');
                }
            }); 

            // Agrega el producto al carrito
            cy.get('button[title="Agregar al Carrito"]').filter(':visible').first().click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            cy.get('.message-success').should('exist')


            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

        });

        //Verificar que permita añadir un Producto al Carrito desde la Página de Detalle de Producto (PDP) - Login
        it('ADDP-008: Verify that you can add a Product to the Cart from the Product Detail Page (PDP) - Login', () => {

            // Iniciar sesión utilizando el comando personalizado 'login'
            cy.login(usuarios[0].email, usuarios[0].password);

            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.get('.size_tops .swatch-option.text').then($options => {
            // Filtrar solo las opciones que están habilitadas
            const availableOptions = $options.filter((index, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableOptions.length > 0) {
            // Elige un índice aleatorio entre las opciones disponibles y habilitadas
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            // Realiza clic en la opción en el índice aleatorio
            cy.wrap(availableOptions).eq(randomIndex).click({force: true});
            } else {
            // Manejar el caso en que no hay tallas disponibles
            cy.log('No hay tallas disponibles para el color seleccionado.');
            }
            });  
            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');
        });
        //Verificar que permita añadir Múltiples Unidades de un Producto al Carrito - Login
        it('ADDP-010: Verify that multiple units of a product can be added to the cart - Login', () => {

            // Iniciar sesión utilizando el comando personalizado 'login'
            cy.login(usuarios[0].email, usuarios[0].password);

            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.get('.size_tops .swatch-option.text').then($options => {
            // Filtrar solo las opciones que están habilitadas
            const availableOptions = $options.filter((index, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableOptions.length > 0) {
            // Elige un índice aleatorio entre las opciones disponibles y habilitadas
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            // Realiza clic en la opción en el índice aleatorio
            cy.wrap(availableOptions).eq(randomIndex).click({force: true});
            } else {
            // Manejar el caso en que no hay tallas disponibles
            cy.log('No hay tallas disponibles para el color seleccionado.');
            }
            });  
            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');
            
            //Hacer click en botón "Ver Carrito" de modal AÑADISTE A TU CARRO DE COMPRAS
            cy.get('button.action.secondary.viewcart').click();
        });
        //Verificar que permita añadir un Producto al Carrito y Continuar Comprando - Login
        it('ADDP-011: Verify that you can add a Product to Cart and Continue Shopping - Login', () => {

            // Iniciar sesión utilizando el comando personalizado 'login'
            cy.login(usuarios[0].email, usuarios[0].password);

            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Selecciona el contenedor de opciones de color específico
            cy.get('.swatch-attribute[data-attribute-code="color_padre"][data-attribute-id="272"]')
            .find('.swatch-option.color').then($colors => {
            // Asegura que las opciones son visibles y selecciona una aleatoriamente
            const availableColors = $colors.filter((i, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableColors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            cy.wrap(availableColors).eq(randomIndex).click();
            } else {
            cy.log('No hay colores disponibles o visibles para seleccionar.');
            }
            });

            cy.get('.size_tops .swatch-option.text').then($options => {
            // Filtrar solo las opciones que están habilitadas
            const availableOptions = $options.filter((index, el) => Cypress.$(el).is(':visible') && !Cypress.$(el).hasClass('disabled'));
            if (availableOptions.length > 0) {
            // Elige un índice aleatorio entre las opciones disponibles y habilitadas
            const randomIndex = Math.floor(Math.random() * availableOptions.length);
            // Realiza clic en la opción en el índice aleatorio
            cy.wrap(availableOptions).eq(randomIndex).click({force: true});
            } else {
            // Manejar el caso en que no hay tallas disponibles
            cy.log('No hay tallas disponibles para el color seleccionado.');
            }
            });  
            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            cy.wait(5000)

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const finalItemCount = parseInt(text.trim()) || 0;
                // Si el carrito estaba inicialmente vacío, asegúrate de que ahora tiene al menos un producto
                // Si el carrito ya tenía productos, verifica que la cantidad haya aumentado
                if (initialItemCount === 0) {
                expect(finalItemCount).to.be.at.least(1);
                } else {
                expect(finalItemCount).to.be.greaterThan(initialItemCount);
                }
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');

             //Hacer click en botón para cerrar modal AÑADISTE A TU CARRO DE COMPRAS           
            cy.get('button.action-close').last().click();
            
            //Abrir pop up carrito
            cy.get('button.opencart').click();

            //Click en botón "Ver Carrito" de pop up carrito
            cy.get('button#top-cart-btn-shoppingCart').click();

            // Verifica que la URL actual incluya el path específico
            cy.url().should('include', '/checkout/cart/');

            //Click en el botón "Continuar Comprando"
            cy.get('a.action.continue[title="Continuar Comprando"]').first().click();

            // Verifica que la URL actual incluya el path específico
            cy.url().should('include', '/guess_peru_store_view');

            //REALIZAR FLUJO DE COMPRA NUEVAMENTE

        });

        //Verificar que desde la PDP permita añadir productos a la lista de favoritos - Login
        it('ADDP-012: Verify that the PDP does allow to add products to the list of favorites - Login', () => {

            // Iniciar sesión utilizando el comando personalizado 'login'
            cy.login(usuarios[0].email, usuarios[0].password);

            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Obtener y guardar el nombre del producto basándose en el atributo itemprop="name"
            let productName;
            cy.get('h1.page-title [itemprop="name"]').then(($name) => {
            productName = $name.text().trim();

            // Hacer clic en el enlace "Agregar a Favoritos" usando la clase y el atributo data-action
            cy.get('a.action.towishlist[data-action="add-to-wishlist"]').click();
  
            // Verifica que la URL actual incluya el path específico
            cy.url().should('include', '/wishlist/');

            //Verificar que el nombre del producto aparece en el mensaje de exito        
            cy.get('.message-success').should('contain', productName);

            //Verificar que el nombre del producto está en la lista de favoritos
            cy.get('.product-items').should('contain', productName);

            }); 
        });    
    });
});
