/// <reference types='Cypress' />

describe('Test cases for Create Account flow', () => {
    let dataUser; // Variable para almacenar los datos cargados desde el JSON

    before(() => {
        // Cargar los datos desde el archivo JSON
        cy.fixture('DataKomax.json').then((data) => {
            dataUser = data;
        });
    });

    beforeEach(() => {
    cy.visit('https://mcstaging2.kliper.cl/kliper_store_view/')
    })
    
    context('Create Account flow', () => {
    // Test case #1: Verificar que un usuario no registrado pueda crear una cuenta
    it('CRE-001: Verify that an unregistered user can create an account', () => {
        // Hacer clic en el botón "Iniciar sesión"
        cy.get('.panel > .header > .link > a').click({ force: true })
        // Hacer clic en el botón de "Crear una cuenta"
        cy.get('.login-container .block-new-customer .action.primary').click()
        // Rellenar el formulario de registro con datos de prueba
        cy.get('#firstname').type(dataUser.nombre[0])
        cy.get('#lastname').type(dataUser.apellido[0])
        cy.get('button.ui-datepicker-trigger.v-middle').click()
        cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
        cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
        cy.get('.ui-state-default:eq(1)').click()
        cy.get('#gender').select(dataUser.genero[0])
        cy.get('#telefono').type(dataUser.telefono)
        cy.get('#identification_number').type(dataUser.identification_number[0])
        cy.get('#email_address').type(dataUser.email[0])
        cy.get('#password').type(dataUser.password[0])
        cy.get('#password-confirmation').type(dataUser.password[0])
        //Hacer click en checkbox para aceptar política de privacidad de datos
        cy.get('#data_privacy_policies_allowed').click()
        //Hacer clic en botón "crear una cuenta" para confirmar el registro
        cy.get('#send2').click()
        //Verificar mensaje de registro exitoso
        cy.get('.message-success').should('exist')
    })
    // Test case #2: Verificar que un usuario registrado no pueda crear una cuenta
    it('CRE-002: Verify that a registered user cannot create an account', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[0])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[0])
            cy.get('#email_address').type(dataUser.email[0])
            cy.get('#password').type(dataUser.password[0])
            cy.get('#password-confirmation').type(dataUser.password[0])
        //Hacer click en checkbox para aceptar política de privacidad de datos
        cy.get('#data_privacy_policies_allowed').click()
            //Hacer clic en botón "crear una cuenta" para confirmar el registro
            cy.get('#send2').click()
            //Verificar que aparezca mensaje de error
            cy.get('.message-error').should('exist')
    })
    // Test case #3: Verificar creación de cuenta sin suscribirse al boletín
    it('CRE-003: Verify account creation without subscribing to the newsletter', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            ///Hacer clic en checkbox "Suscribirse a boletín"
            cy.get('#is_subscribed').click()
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[2])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[1])
            cy.get('#email_address').type(dataUser.email[1])
            cy.get('#password').type(dataUser.password[0])
            cy.get('#password-confirmation').type(dataUser.password[0])
            //Hacer click en checkbox para aceptar política de privacidad de datos
            cy.get('#data_privacy_policies_allowed').click()
            //Hacer clic en botón "crear una cuenta" para confirmar el registro
            cy.get('#send2').click()
            //Verificar mensaje de registro exitoso
            cy.get('.message-success').should('exist')
    })
    // Test case #4: Verificar que no se pueda crear cuenta cuando haya un campo obligatorio sin diligenciar
    it('CRE-004: Verify that an account cannot be created when a mandatory field is not filled in', () => {
        // Hacer clic en el botón "Iniciar sesión"
        cy.get('.panel > .header > .link > a').click({ force: true })
        // Hacer clic en el botón de "Crear una cuenta"
        cy.get('.login-container .block-new-customer .action.primary').click()
        // Rellenar el formulario de registro con datos de prueba
        cy.get('#firstname').type(dataUser.nombre[0])
        cy.get('#lastname').type(dataUser.apellido[0])
        cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
        cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
        cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
        cy.get('.ui-state-default:eq(1)').click()
        cy.get('#gender').select(dataUser.genero[0])
        cy.get('#telefono').type(dataUser.telefono)
        cy.get('#identification_number').type(dataUser.identification_number[2])
        //cy.get('#email_address').type(dataUser.email[0]) NO DILIGENCIAR CAMPO
        cy.get('#password').type(dataUser.password[0])
        cy.get('#password-confirmation').type(dataUser.password[0])
        //Hacer click en checkbox para aceptar política de privacidad de datos
        cy.get('#data_privacy_policies_allowed').click()
        //Hacer clic en botón "crear una cuenta" para confirmar el registro
        cy.get('#send2').click()
        //Verificar mensaje de error
        cy.get('#email_address-error').should('exist').should('have.text', 'Este es un campo obligatorio.')
})
    // Test case #5: Verificar que no se pueda crear cuenta cuando el identification_number no sea valido
    it('CRE-005: Verify that it is not possible to create an account when the identification_number is not valid', () => {
        // Hacer clic en el botón "Iniciar sesión"
        cy.get('.panel > .header > .link > a').click({ force: true })
        // Hacer clic en el botón de "Crear una cuenta"
        cy.get('.login-container .block-new-customer .action.primary').click()
        // Rellenar el formulario de registro con datos de prueba
        cy.get('#firstname').type(dataUser.nombre[0])
        cy.get('#lastname').type(dataUser.apellido[0])
        cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
        cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
        cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
        cy.get('.ui-state-default:eq(1)').click()
        cy.get('#gender').select(dataUser.genero[0])
        cy.get('#telefono').type(dataUser.telefono)
        cy.get('#identification_number').type('123') ///identification_number Inválido
        cy.get('#email_address').type(dataUser.email[2])
        cy.get('#password').type(dataUser.password[0])
        cy.get('#password-confirmation').type(dataUser.password[0])
        //Hacer click en checkbox para aceptar política de privacidad de datos
        cy.get('#data_privacy_policies_allowed').check()
        //Hacer clic en botón "crear una cuenta" para confirmar el registro
        cy.get('#send2').click()
        //Verificar que aparezca mensaje de error
        cy.get('#identification_number-error').should('exist')        
})
    // Test case #6: Verificar que la contraseña este oculta por defecto
it('CRE-006: Verify that the password is hidden by default', () => {
    // Hacer clic en el botón "Iniciar sesión"
    cy.get('.panel > .header > .link > a').click({ force: true })
    // Hacer clic en el botón de "Crear una cuenta"
    cy.get('.login-container .block-new-customer .action.primary').click()
    // Rellenar el formulario de registro con datos de prueba
    cy.get('#firstname').type(dataUser.nombre[1])
    cy.get('#lastname').type(dataUser.apellido[1])
    cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
    cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
    cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
    cy.get('.ui-state-default:eq(1)').click()
    cy.get('#gender').select(dataUser.genero[1])
    cy.get('#telefono').type(dataUser.telefono)
    cy.get('#identification_number').type(dataUser.identification_number[2])
    cy.get('#email_address').type(dataUser.email[2])
    cy.get('#password').type(dataUser.password[0]).should('have.attr', 'type', 'password')  
    cy.get('#password-confirmation').type(dataUser.password[0]).should('have.attr', 'type', 'password')  
})
    // Test case #7: Verificar que la contraseña sea visible cuando el usuario lo solicite
    it('CRE-007: Verify that the password is visible at the user´s request', () => {
        // Hacer clic en el botón "Iniciar sesión"
        cy.get('.panel > .header > .link > a').click({ force: true })
        // Hacer clic en el botón de "Crear una cuenta"
        cy.get('.login-container .block-new-customer .action.primary').click()
        // Rellenar el formulario de registro con datos de prueba
        cy.get('#firstname').type(dataUser.nombre[1])
        cy.get('#lastname').type(dataUser.apellido[1])
        cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
        cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
        cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
        cy.get('.ui-state-default:eq(1)').click()
        cy.get('#gender').select(dataUser.genero[1])
        cy.get('#telefono').type(dataUser.telefono)
        cy.get('#identification_number').type(dataUser.identification_number[2])
        cy.get('#email_address').type(dataUser.email[2])
        cy.get('#password').type(dataUser.password[0])
        cy.get('#password-confirmation').type(dataUser.password[0])
        // Hacer clic en el checkbox de "Monstrar contraseña"
        cy.get('#show-password').click()
        // Verificar que la contraseña se está mostrando
        cy.get('#password').should('have.attr', 'type', 'text')                 
        cy.get('#password-confirmation').should('have.attr', 'type', 'text')
    })
        // Test case #8: Verificar mensaje de error cuando la contraseña no coincide
        it('CRE-008: Verify error message when the password does not match', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[0])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[2])
            cy.get('#email_address').type(dataUser.email[2])
            cy.get('#password').type(dataUser.password[0])
            cy.get('#password-confirmation').type(dataUser.password[1])
            //Hacer click en checkbox para aceptar política de privacidad de datos
            cy.get('#data_privacy_policies_allowed').click()
            //Hacer clic en botón "crear una cuenta" para confirmar el registro
            cy.get('#send2').click()
            //Verificar que aparezca mensaje de error
            cy.get('#password-confirmation-error').should('exist').should('have.text','Introduce el mismo valor otra vez.')
        })
        // Test case #9: Verificar que no se pueda crear cuenta con un email registrado
        it('CRE-009: Verify that it is not possible to create an account with a registered email address', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[0])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[2])
            cy.get('#email_address').type(dataUser.email[2])
            cy.get('#password').type(dataUser.password[0])
            cy.get('#password-confirmation').type(dataUser.password[0])
            //Hacer click en checkbox para aceptar política de privacidad de datos
            cy.get('#data_privacy_policies_allowed').click()
            //Hacer clic en botón "crear una cuenta" para confirmar el registro
            cy.get('#send2').click()
            //Verificar que aparezca mensaje de error
            cy.get('.message-error').should('exist')   
        })
        // Test case #10: Verificar que se presente mensaje de error cuando la contraseña no cumpla con el mínimo de longitud
        it('CRE-010: Verify that an error message is displayed when the password does not meet the minimum length', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[0])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[2])
            cy.get('#email_address').type(dataUser.email[2])
            cy.get('#password').type(dataUser.password[2])
            cy.get('#password-error').should('exist').and('contain','8')
        })
        // Test case #11: Verificar que se presente mensaje de error cuando la contraseña no cumpla con las diferentes clases de caracteres
        it('CRE-011: Verify that an error message is displayed when the password does not comply with the different character classes', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[0])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[2])
            cy.get('#email_address').type(dataUser.email[2])
            cy.get('#password').type(dataUser.password[3])
            cy.get('#password-error').should('exist').and('contain','3')
        })
        // Test case #12: Verificar creación de cuenta sin seleccionar Recordarme ¿Qué es esto?
        it('CRE-012: Verify account creation without selecting: Remember ¿Me What is this?', () => {
            // Hacer clic en el botón "Iniciar sesión"
            cy.get('.panel > .header > .link > a').click({ force: true })
            // Hacer clic en el botón de "Crear una cuenta"
            cy.get('.login-container .block-new-customer .action.primary').click()
            // Rellenar el formulario de registro con datos de prueba
            cy.get('#firstname').type(dataUser.nombre[0])
            cy.get('#lastname').type(dataUser.apellido[0])
            cy.get('button.ui-datepicker-trigger.v-middle').click().should('be.visible')
            cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
            cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
            cy.get('.ui-state-default:eq(1)').click()
            cy.get('#gender').select(dataUser.genero[0])
            cy.get('#telefono').type(dataUser.telefono)
            cy.get('#identification_number').type(dataUser.identification_number[3])
            cy.get('#email_address').type(dataUser.email[3])
            cy.get('#password').type(dataUser.password[0])
            cy.get('#password-confirmation').type(dataUser.password[0])
            //Hacer clic en chwckbox de "Recordarme ¿Qué es esto?"
            cy.get('[id^="remember_"]').click()
            //Hacer click en checkbox para aceptar política de privacidad de datos
            cy.get('#data_privacy_policies_allowed').click()
            //Hacer clic en botón "crear una cuenta" para confirmar el registro
            cy.get('#send2').click()
            //Verificar mensaje de registro exitoso
            cy.get('.message-success').should('exist')
        })      
        // Test case #14: Verificar que aceptar la política de privacidad de datos sea obligatorio
         it('CRE-014: Verify that an unregistered user can create an account', () => {
        // Hacer clic en el botón "Iniciar sesión"
        cy.get('.panel > .header > .link > a').click({ force: true })
        // Hacer clic en el botón de "Crear una cuenta"
        cy.get('.login-container .block-new-customer .action.primary').click()
        // Rellenar el formulario de registro con datos de prueba
        cy.get('#firstname').type(dataUser.nombre[0])
        cy.get('#lastname').type(dataUser.apellido[0])
        cy.get('button.ui-datepicker-trigger.v-middle').click()
        cy.get('.ui-datepicker-month').should('be.visible').select(dataUser.fechaNacimiento[0])
        cy.get('.ui-datepicker-year').should('be.visible').select(dataUser.fechaNacimiento[1])
        cy.get('.ui-state-default:eq(1)').click()
        cy.get('#gender').select(dataUser.genero[0])
        cy.get('#telefono').type(dataUser.telefono)
        cy.get('#identification_number').type(dataUser.identification_number[0])
        cy.get('#email_address').type(dataUser.email[0])
        cy.get('#password').type(dataUser.password[0])
        cy.get('#password-confirmation').type(dataUser.password[0])
        //Hacer clic en botón "crear una cuenta" para confirmar el registro
        cy.get('#send2').click()
        //Verificar mensaje de error que indica que el campo es obligatorio
        cy.get('#data_privacy_policies_allowed-error').should('be.visible');
    })  
})
})
