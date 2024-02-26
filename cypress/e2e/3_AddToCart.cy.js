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
        cy.visit('https://mcstaging.converse.cl/new_balance_peru_store_view/');

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
        it('ADDP-002: Verify that you can add a Product to the Cart from the Product List Page (PLP) - Guest', () => {
            // Selecciona una categoría de manera aleatoria
            cy.selectRandomCategory();

            // Espera a que los productos se carguen y selecciona uno aleatorio
            cy.get('#amasty-shopby-product-list .item.product.product-item', { timeout: 10000 }).should('be.visible').then(($products) => {
                const randomIndex = Math.floor(Math.random() * $products.length);
                cy.wrap($products).eq(randomIndex).find('.product-item-link').invoke('removeAttr', 'target').click();
            });

            // Espera a que se carguen los colores y selecciona uno aleatorio
            cy.get('.swatch-attribute.color .swatch-option.color').should('be.visible').then(($colors) => {
                const randomIndex = Math.floor(Math.random() * $colors.length);
                cy.wrap($colors).eq(randomIndex).click();
            });

            // Espera a que se carguen las tallas y selecciona una aleatoria
            cy.get('.swatch-attribute.size .swatch-option.text').should('be.visible').then(($sizes) => {
                const randomIndex = Math.floor(Math.random() * $sizes.length);
                cy.wrap($sizes).eq(randomIndex).click();
            });

            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const newItemCount = parseInt(text.trim()) || 0;
                expect(newItemCount).to.equal(initialItemCount + 1);
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

            // Espera a que se carguen los colores y selecciona uno aleatorio
            cy.get('.swatch-attribute.color .swatch-option.color').then(($colors) => {
                const randomIndex = Math.floor(Math.random() * $colors.length);
                cy.wrap($colors).eq(randomIndex).click();
            });

            // Espera a que se carguen las tallas y selecciona una aleatoria
            cy.get('.swatch-attribute.size .swatch-option.text').then(($sizes) => {
                const randomIndex = Math.floor(Math.random() * $sizes.length);
                cy.wrap($sizes).eq(randomIndex).click();
            });

            // Agrega el producto al carrito
            cy.get('#product-addtocart-button').click();

            // Espera a que el estado del carrito cambie correctamente
            cy.get('.counter.qty.empty, .counter.qty').should(($newCartState) => {
                // Verifica si el estado del carrito cambió correctamente
                expect($newCartState.text().trim()).not.to.equal(initialCartState);
            });

            // Verifica si el número de productos en el carrito aumentó
            cy.get('.counter.qty .counter-number').invoke('text').then((text) => {
                const newItemCount = parseInt(text.trim()) || 0;
                expect(newItemCount).to.equal(initialItemCount + 1);
            });

            // Verifica si se muestra el mensaje de éxito
            cy.get('.message-success').should('be.visible');

            // Abre el carrito haciendo clic en el elemento
            cy.get('.action.showcart').click();

// Genera un valor aleatorio entre 1 y 5
const incremento = Math.floor(Math.random() * 5) + 1;

// Aumenta la cantidad del producto en el carrito por el valor aleatorio
for (let i = 0; i < incremento; i++) {
    cy.get('input.item-qty').type('{uparrow}');
}

        });
    });
});
