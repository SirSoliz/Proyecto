// Verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Función para verificar autenticación
function checkAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Si no hay usuario autenticado, redirigir al login
    if (!currentUser) {
        window.location.href = '/login.html';
        return;
    }

    // Mostrar el nombre del usuario
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.fullName;
    }
}

// Función para cerrar sesión (la hacemos global)
window.logout = function() {
    try {
        console.log('Cerrando sesión...'); // Para debug
        // Limpiar la sesión
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
        
        // Redirigir al login
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};
