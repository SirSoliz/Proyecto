// Inicialización de AOS (animaciones)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Función para cerrar sesión
function logout() {
    // Eliminar cookies
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // Limpiar localStorage
    localStorage.clear();
    // Redirigir a la página de inicio
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    // 1. SISTEMA DE PESTAÑAS MEJORADO
    function switchTab(tabId) {
        // Ocultar todos los contenidos de pestañas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active', 'show');
        });

        // Remover active de todos los botones
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar el contenido seleccionado
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            selectedContent.classList.add('active', 'show');
        }

        // Activar el botón correspondiente
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }

        // Actualizar animaciones AOS
        AOS.refresh();
    }

    // Agregar event listeners a los botones de navegación
    document.querySelectorAll('[data-tab]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Activar la pestaña inicial (home)
    switchTab('home');

    // 2. MANEJO DE USUARIO (COOKIES Y LOCALSTORAGE)
    // Función para establecer una cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + d.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Función para obtener una cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Asignar también el evento por JS (buena práctica)
    document.querySelector('.logout-btn')?.addEventListener('click', logout);
    // Recuperar el nombre desde las cookies
    let userName = getCookie('userName');
    if (userName) {
        alert(`Bienvenido de nuevo, ${userName}!`);
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.value = userName;
    }

    // 3. FORMULARIO DE CONTACTO
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccessMessage');
    const successSound = document.getElementById('successSound');

    if (form) {
        // Evento para calcular la edad automáticamente
        const dobInput = document.getElementById('dob');
        if (dobInput) {
            dobInput.addEventListener('change', function () {
                let dob = new Date(this.value);
                let age = new Date().getFullYear() - dob.getFullYear();
                const ageInput = document.getElementById('age');
                if (ageInput) ageInput.value = age;
            });
        }

        // Evento para guardar en Local Storage y Cookies
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            let name = document.getElementById('name')?.value;
            let email = document.getElementById('email')?.value;
            let dob = document.getElementById('dob')?.value;
            let gender = document.getElementById('gender')?.value;
            let age = document.getElementById('age')?.value;

            // Guardar en Local Storage
            if (name && email) {
                let userData = { name, email, dob, gender, age };
                localStorage.setItem('userData', JSON.stringify(userData));

                // Guardar el nombre en cookies por 7 días
                setCookie('userName', name, 7);

                // Mostrar mensaje de éxito
                if (successMessage) {
                    successMessage.style.display = 'block';
                    if (successSound) successSound.play();
                } else {
                    alert('Datos guardados correctamente.');
                }
            }
        });
    }

    // 4. CARGAR DATOS AL INICIAR
    // Recuperar datos almacenados en Local Storage al cargar la página
    let savedData = JSON.parse(localStorage.getItem('userData'));
    if (savedData) {
        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element && value) element.value = value;
        };

        setValue('name', savedData.name);
        setValue('email', savedData.email);
        setValue('dob', savedData.dob);
        setValue('gender', savedData.gender);
        setValue('age', savedData.age);
    }

    // 5. GALERÍA DINÁMICA
    const galleryContent = document.getElementById('gallery-content');
    if (galleryContent) {
        fetch('gallery.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data && data.images) {
                    data.images.forEach(image => {
                        let div = document.createElement('div');
                        div.classList.add('col-md-4');
                        div.innerHTML = `
                            <a href="${image.url}" class="d-block" data-bs-toggle="lightbox" data-bs-target="#gallery">
                                <img src="${image.url}" class="img-fluid" alt="${image.alt}">
                            </a>`;
                        galleryContent.appendChild(div);
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar la galería:', error);
            });
    }

    // 6. BOTÓN "RESERVA TU CITA"
    const goToContactBtn = document.getElementById('goToContact');
    if (goToContactBtn) {
        goToContactBtn.addEventListener('click', function () {
            switchTab('tab3');
            // Scroll suave al formulario de contacto
            const contactTab = document.getElementById('tab3');
            if (contactTab) {
                contactTab.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
});