    /// <reference types='Cypress' />

    describe('Test cases for Create Account flow', () => {
        const password1 = 'Pruebas123*'
        const password2 = 'Pruebas123$'

        
        beforeEach(() => {
            cy.visit('https://mcstaging.converse.cl/new_balance_peru_store_view/')
        });

        context('Create Account flow', () => {
            // Test case #1: Verificar que un usuario no registrado pueda crear una cuenta
            it('CRE-001: Verify that an unregistered user can create an account', () => {
                // Hacer clic en el botón "Únete"
                cy.get('a.link-action__create').contains('Únete').click({ force: true });       
                // Utilizar el comando personalizado para rellenar el formulario de registro
                cy.fillRegisterFormWithRandomData()
                // Contraseña
                cy.get('#password').type(password1)
                cy.get('#password-confirmation').type(password1)

                cy.get('#tcagreecreateaccount').check()

                // Enviar el formulario
                cy.get('#send2').click()
                //Verificar mensaje de registro exitoso
                cy.get('.message-success').should('exist')
            });
            // Test case #2: Verificar que un usuario registrado no pueda crear una cuenta
            it('CRE-002: Verify that a registered user cannot create an account', () => {
            cy.fixture('usuariosRegistrados').then(usuario => {
                // Hacer clic en el botón "Únete"
                cy.get('a.link-action__create').contains('Únete').click({ force: true });
        
                // Rellenar el formulario de registro con los datos del usuario registrado
                cy.get('#firstname').type('Juan')
                cy.get('#lastname').type('Perez')
                cy.get('#email_address').type(usuario.email)
                cy.get('#password').type(password1)
                cy.get('#password-confirmation').type(password1)
                // Asegúrate de ajustar los selectores según tu formulario

        // Marcar el checkbox de términos y condiciones si es necesario
        cy.get('#tcagreecreateaccount').check();

        // Enviar el formulario
        cy.get('#send2').click();

        // Verificar que se muestra un mensaje de error indicando que el correo electrónico ya está registrado
        cy.get('.message-error').should('exist')
    });
});
    // Test case #4: Verificar que no se pueda crear cuenta cuando haya un campo obligatorio sin diligenciar
    it('CRE-004: Verify that an account cannot be created when a mandatory field is not filled in', () => {
    // Hacer clic en el botón "Únete"
    cy.get('a.link-action__create').contains('Únete').click({ force: true });       
    // Utilizar el comando personalizado para rellenar el formulario de registro
    cy.fillRegisterFormWithRandomData()
    // Contraseña
    cy.get('#password').type(password1)
    //cy.get('#password-confirmation').type(password1)//NO DILIGENCIA

    cy.get('#tcagreecreateaccount').check()

    // Enviar el formulario
    cy.get('#send2').click()
        //Verificar mensaje de error
    cy.get('#password-confirmation-error').should('exist').should('have.text', 'Este es un campo obligatorio.')
});
    // Test case #6: Verificar que la contraseña este oculta por defecto
    it('CRE-006: Verify that the password is hidden by default', () => {
            // Hacer clic en el botón "Únete"
            cy.get('a.link-action__create').contains('Únete').click({ force: true });       
            // Utilizar el comando personalizado para rellenar el formulario de registro
            cy.fillRegisterFormWithRandomData()
            // Contraseña
            cy.get('#password').type(password1).should('have.attr', 'type', 'password') 
            cy.get('#password-confirmation').type(password1).should('have.attr', 'type', 'password') 
});
    // Test case #7: Verificar que la contraseña sea visible cuando el usuario lo solicite
    it('CRE-007: Verify that the password is visible at the user´s request', () => {
        // Hacer clic en el botón "Únete"
        cy.get('a.link-action__create').contains('Únete').click({ force: true });       
        // Utilizar el comando personalizado para rellenar el formulario de registro
        cy.fillRegisterFormWithRandomData()
        // Contraseña
        cy.get('#password').type(password1)
        cy.get('#password-confirmation').type(password1)
        // Hacer clic en el checkbox de "Monstrar contraseña"
        cy.get('label[for="show-password"]').click();
        // Verificar que la contraseña se está mostrando
        cy.get('#password').should('have.attr', 'type', 'text')                 
        cy.get('#password-confirmation').should('have.attr', 'type', 'text')
    })
        // Test case #8: Verificar mensaje de error cuando la contraseña no coincide
        it('CRE-008: Verify error message when the password does not match', () => {
                // Hacer clic en el botón "Únete"
                cy.get('a.link-action__create').contains('Únete').click({ force: true });       
                // Utilizar el comando personalizado para rellenar el formulario de registro
                cy.fillRegisterFormWithRandomData()
                // Contraseña
                cy.get('#password').type(password1)
                cy.get('#password-confirmation').type(password2)

                cy.get('#tcagreecreateaccount').check()

                // Enviar el formulario
                cy.get('#send2').click()
            //Verificar que aparezca mensaje de error
            cy.get('#password-confirmation-error').should('exist').should('have.text','Introduce el mismo valor otra vez.')
        })
// Test case #10: Verificar que se presente mensaje de error cuando la contraseña no cumpla con el mínimo de longitud
it('CRE-010: Verify that an error message is displayed when the password does not meet the minimum length', () => {
                // Hacer clic en el botón "Únete"
                cy.get('a.link-action__create').contains('Únete').click({ force: true });       
                // Utilizar el comando personalizado para rellenar el formulario de registro
                cy.fillRegisterFormWithRandomData()
                // Contraseña
                cy.get('#password').type('Pruebas')
                cy.get('#password-confirmation').type('Pruebas')
    cy.get('#password-error').should('exist').and('contain','8')
})
        // Test case #11: Verificar que se presente mensaje de error cuando la contraseña no cumpla con las diferentes clases de caracteres
        it('CRE-011: Verify that an error message is displayed when the password does not comply with the different character classes', () => {
                 // Hacer clic en el botón "Únete"
                 cy.get('a.link-action__create').contains('Únete').click({ force: true });       
                 // Utilizar el comando personalizado para rellenar el formulario de registro
                 cy.fillRegisterFormWithRandomData()
                 // Contraseña
                 cy.get('#password').type('Pruebas1')
                 cy.get('#password-confirmation').type('Pruebas1')
                         // Marcar el checkbox de términos y condiciones si es necesario
        cy.get('#tcagreecreateaccount').check();

        // Enviar el formulario
        cy.get('#send2').click();
            cy.get('#password-error').should('exist').and('contain','3')
        })
        // Test case #14: Verificar que aceptar la política de privacidad de datos sea obligatorio
        it('CRE-014: Verify that an unregistered user can create an account', () => {
                // Hacer clic en el botón "Únete"
                cy.get('a.link-action__create').contains('Únete').click({ force: true });       
                // Utilizar el comando personalizado para rellenar el formulario de registro
                cy.fillRegisterFormWithRandomData()
                // Contraseña
                cy.get('#password').type(password1)
                cy.get('#password-confirmation').type(password1)
                // Enviar el formulario
                cy.get('#send2').click()
            //Verificar mensaje de error que indica que el campo es obligatorio
            cy.get('#tcagreecreateaccount-error').should('be.visible');
        })  
    });
})
