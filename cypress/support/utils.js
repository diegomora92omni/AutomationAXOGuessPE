// cypress/support/utils.js

// Función para generar RUT Chileno aleatorio
export function generateRUT() {
    let num = Math.floor(Math.random() * (25000000 - 1000000) + 1000000);
    let remainder = num;
    let factor = 2;
    let sum = 0;

    while (remainder > 0) {
        const digit = remainder % 10;
        remainder = Math.floor(remainder / 10);
        sum += digit * factor;
        factor = (factor === 7) ? 2 : factor + 1;
    }

    const dv = 11 - (sum % 11);
    let dvChar = `${dv}`;

    if (dv === 11) {
        dvChar = '0';
    } else if (dv === 10) {
        dvChar = 'K';
    } else {
        dvChar = dv.toString();
    }

    return `${num}-${dvChar}`;
}

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
