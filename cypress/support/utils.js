// cypress/support/utils.js

// Función para generar un número de teléfono aleatorio
export function generateRandomPhoneNumber() {
    // El primer dígito será siempre 9.
    let phoneNumber = '9';
    // Genera los 8 dígitos restantes de forma aleatoria.
    for (let i = 0; i < 8; i++) {
        phoneNumber += Math.floor(Math.random() * 10);
    }
    return phoneNumber;
}
