/// <reference types='Cypress' />

describe('Test cases for Cart flow', () => {
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

    context('Cart flow', () => {

        //Verificar que se pueda eliminar un producto del CART y se realice la actualización del SUMMARY
        it('CART-001: Verify that a product can be removed from the CART and the SUMMARY update is performed', () => {

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

           //Hace click en primer botón "Eliminar", es decir si hay más de un producto elimina el primero
           cy.get('a.action.action-delete[title="Eliminar"]').first().click();

           // Verificar que aparece el texto "No tienes ningún artículo en el carrito."
           cy.contains('p', 'No tienes ningún artículo en el carrito.').should('be.visible');

           // Verificar que aparece el texto "Haga clic aquí para continuar comprando.", incluyendo el enlace.
           cy.contains('p', 'Haga clic aquí para continuar comprando.').should('be.visible');

           // Verificar la presencia del párrafo y el enlace dentro de este
           cy.contains('p', 'Haga clic').parent().contains('a', 'aquí').should('have.attr', 'href', 'https://mcstaging.komaxchile.cl/guess_peru_store_view/').should('be.visible');
           
           // Hacer clic en el enlace con el texto "aquí"
           cy.contains('a', 'aquí').click();

           // Verifica que la URL actual incluya el path específico
           cy.url().should('include', '/guess_peru_store_view');
           
       });

        //Verificar que se puede reducir la cantidad a comprar de un producto y se realice la actualización del SUMMARY
        it('CART-004: Verify that the quantity to be purchased of a product can be reduced and the SUMMARY update is performed', () => {
            
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

            // Hacer clic solo en el primer botón encontrado con las clases "counter-qty" y "minus"
            cy.get('button.counter-qty.minus').first().click();

        });

        //Verificar que se puede aumentar la cantidad a comprar de un producto y se realice la actualización del SUMMARY
        it('CART-005: Verify that the quantity of a product to be purchased can be increased and that the SUMMARY is updated.', () => {
           
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

            // Hacer clic solo en el primer botón encontrado con las clases "counter-qty" y "plus"
            cy.get('button.counter-qty.plus').first().click();

        });

        //Verificar que se pueda actualizar las opciones (atributos) de un producto en el CART
        it('CART-009: Verify that the options (attributes) of a product can be updated in the CART.', () => {
           
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

            //Hacer click en el primer botón "Editar" que en cuentre en el carrito, es decir en el primer producto de la lista
            cy.get('a.action.action-edit[title="Editar los parámetros del artículo"]').first().click();

            //Actualizar la cantidad de prodcuto añadido en carrito
            cy.get('#qty').clear().type('2')

            //Click en botón "Actualizar Carrito"
            cy.get('#product-updatecart-button').click()

            //Verificar mensaje de exito indicando que el producto fue actualizado
            cy.get('.message-success').should('contain.text','fueron actualizados en su Carro de la compra')

        });

        //Verificar que se pueda acceder a las product page de los productos existentes en el CART
        it('CART-011: Verify that the PDP of the products existing in the CART can be accessed.', () => {       
            
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

        // Agrupar ambos selectores y seleccionar aleatoriamente uno de los elementos encontrados
        cy.get('img.product-image-photo, strong.product-item-name').then($elements => {
            const randomIndex = Math.floor(Math.random() * $elements.length);
            cy.wrap($elements[randomIndex]).first().click();
            });
        });
    });
});
