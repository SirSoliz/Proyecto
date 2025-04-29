/**
 * Obtiene los usuarios registrados desde localStorage
 * @returns {Array} Array de usuarios
 */
const getUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form');
    const emailInput = loginForm.querySelector('input[type="text"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación de campos
        if (!email || !password) {
            showError('Por favor, complete todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, ingrese una dirección de correo electrónico válida');
            return;
        }

        // Check credentials against registered users
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            try {
                // Mostrar mensaje de éxito
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.textContent = '¡Inicio de sesión exitosa!';
                
                // Insertar el mensaje de éxito
                loginForm.insertBefore(successDiv, loginForm.querySelector('button'));
                
                // Limpiar el mensaje después de 3 segundos
                setTimeout(() => successDiv.remove(), 3000);
                // Success - Store user info in sessionStorage
                // Guardamos el nombre bajo la clave 'usuario' para compatibilidad con wishlist y correos
                const userData = {
                    usuario: user.usuario,
                    email: user.email
                };
                sessionStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                showSuccess('¡Inicio de sesión exitoso!');
                setTimeout(() => {
                    window.location.href = '/pages/barber_boss_site.html';
                }, 1500);
            } catch (error) {
                console.error('Error al guardar la sesión:', error);
                showError('Error al iniciar sesión');
            }
        } else {
            // Mostrar mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Correo o contraseña incorrectos';
            
            // Insertar el mensaje de error
            loginForm.insertBefore(errorDiv, loginForm.querySelector('button'));
            
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => errorDiv.remove(), 3000);
        }
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error messages
    removeMessages();
    
    const form = document.querySelector('.form');
    form.insertBefore(errorDiv, form.querySelector('button'));

    // Remove the message after 3 seconds
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Remove any existing messages
    removeMessages();
    
    const form = document.querySelector('.form');
    form.insertBefore(successDiv, form.querySelector('button'));
}

function removeMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}
