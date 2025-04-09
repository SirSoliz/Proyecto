document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validación de campos
        if (!fullName || !email || !password || !confirmPassword) {
            showError('Por favor, complete todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, ingrese una dirección de correo electrónico válida');
            return;
        }

        if (password.length < 8) {
            showError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        // NOTA: En una aplicación real, esto se enviaría a un servidor backend
        // Por ahora, solo simulamos el registro para el proyecto de la U
        const newUser = {
            fullName,
            email,
            password
        };

        // Guardamos el usuario en localStorage (solo para demostración)
        // IMPORTANTE: En una app real, esto lo manejaría un servidor por seguridad
        // Obtenemos la lista de usuarios o creamos un array vacío si no existe
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Verificamos si el correo ya está registrado
        // Usamos .some() para buscar si existe algún usuario con ese email
        if (users.some(user => user.email === email)) {
            showError('El correo ya está registrado');
            return;
        }

        // Agregamos el nuevo usuario a la lista
        users.push(newUser);
        // Actualizamos el localStorage con la lista actualizada
        localStorage.setItem('users', JSON.stringify(users));

        // Mostramos mensaje de éxito y redirigimos al login
        // setTimeout nos da tiempo para que el usuario vea el mensaje
        showSuccess('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 2000); // Esperamos 2 segundos antes de redireccionar
    });
});

/**
 * Función que valida el formato de un correo electrónico
 * @param {string} email - El correo electrónico a validar
 * @returns {boolean} - true si el formato es válido, false si no
 */
function isValidEmail(email) {
    // Expresión regular para validar email
    // Verifica que tenga: texto@texto.texto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Muestra un mensaje de error en el formulario
 * @param {string} message - El mensaje de error a mostrar
 */
function showError(message) {
    // Creamos un div para el mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Eliminamos mensajes anteriores para no acumularlos
    removeMessages();
    
    // Insertamos el mensaje antes del botón del formulario
    const form = document.getElementById('registerForm');
    form.insertBefore(errorDiv, form.querySelector('button'));

    // Eliminamos el mensaje después de 3 segundos
    setTimeout(() => errorDiv.remove(), 3000);
}

/**
 * Muestra un mensaje de éxito en el formulario
 * @param {string} message - El mensaje de éxito a mostrar
 */
function showSuccess(message) {
    // Creamos un div para el mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Eliminamos mensajes anteriores para no acumularlos
    removeMessages();
    
    // Insertamos el mensaje antes del botón del formulario
    const form = document.getElementById('registerForm');
    form.insertBefore(successDiv, form.querySelector('button'));
}

/**
 * Elimina todos los mensajes de error y éxito en el formulario
 */
function removeMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}
