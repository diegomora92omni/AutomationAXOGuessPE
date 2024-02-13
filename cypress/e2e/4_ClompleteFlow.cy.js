/// <reference types='Cypress' />

describe('Test cases for Add To Cart flow', () => {
    let dataUser; // Variable para almacenar los datos cargados desde el JSON

    before(() => {
        // Cargar los datos desde el archivo JSON
        cy.fixture('DataKomax.json').then((data) => {
            dataUser = data;
        });
    });

    beforeEach(() => {
        cy.visit('https://mcstaging2.kliper.cl/kliper_store_view/');
    });

    context('Add to cart flow', () => {
        // Test case #1: Verificar que un usuario registrado pueda iniciar sesión
        it('LOG-001: Verify Add to cart flow Guest User', () => {
            //Click en categoría ubicada dentro del body del Home
            cy.get('img.pagebuilder-mobile-hidden[alt="Chaquetas de marcas Outdoor"]').click({ force: true })
            //Búsqueda de un producto en la cuadrícula de productos (PLP)
            cy.get('#amasty-shopby-product-list > div.products.wrapper.grid.products-grid')
            .find('.item.product.product-item')
            //Click en producto que se quiere seleccionar
            .eq(0).click()
            //Búsqueda de una talla  en el detalle del producto (PDP)
            cy.get('.swatch-opt > .swatch-attribute > .swatch-attribute-options')
            .find('.swatch-option')
            //Click en talla que se quiere seleccionar
            .eq(0).click()
            //Click en botón "Agregar al carrito" 
            cy.get('#product-addtocart-button').click()
            //Click en botón "Pagar" ubicado en modal AñADISTE A TU CARRITO DE COMPRAS
            cy.get('.buttons > .primary').click()
            //Ingresar correo electrónico
            cy.get('#customer-email').type('pruebacompra1@yopmail.com')
            //Selección de método de envío
            cy.get('#storepickup').click()
            //Selección de región
            cy.get('#branchoffice_region_id').contains('Maule').invoke('text').then((text) => {
                cy.get('#branchoffice_region_id').select(text);
              })     
            //Selección de Comuna         
            cy.get('#branchoffice_comuna_id').contains('Talca').invoke('text').then((text) => {
                cy.get('#branchoffice_comuna_id').select(text);
              })       
            //Selección de Sucursal
            cy.get('#branchoffice').contains('Talca').invoke('text').then((text) => {
                cy.get('#branchoffice').select(text);
              })           
            //Diligenciar datos de envío
            cy.get('input.input-text[type="text"][name="firstname"]').type(dataUser.nombre[0])
            cy.get('input.input-text[type="text"][name="lastname"]').type(dataUser.apellido[0])
            cy.get('input.input-text[type="text"][name="custom_attributes[rut]"]').type(dataUser.identification_number[3])
            cy.get('input.linets-custom-phone.admin__control-text[type="text"][name="telephone"]').type(dataUser.telefono)
            //Click en botón "Siguiente"
            cy.get('.button').click()
            //Aceptar términos y condiciones de "Transbank Webpay"
            cy.get('#agreement_transbank_webpay_8').check()
            //Click en botón "Realizar pedido"
            cy.get(':nth-child(4) > div.primary > .action').click()
        })
        })
    })
