// Inicialización de AOS (animaciones)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Funciones de autenticación
// Función para verificar si el usuario está logueado
function isUserLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    return !!currentUser;
}

// Función para obtener el nombre del usuario
function getUserName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    return currentUser ? currentUser.usuario : '';
}

// Función para actualizar la interfaz según el estado de sesión
function updateAuthUI() {
    const loginButton = document.getElementById('loginButton');
    const userNameSpan = document.getElementById('userName');
    const logoutButton = document.querySelector('.logout-btn');
    
    if (!loginButton || !userNameSpan || !logoutButton) {
        console.error('Elementos de autenticación no encontrados');
        return;
    }
    
    const isLoggedIn = isUserLoggedIn();
    const userName = getUserName();
    
    console.log('Estado de sesión:', { isLoggedIn, userName });
    
    if (isLoggedIn && userName) {
        // Usuario logueado: mostrar nombre y botón de logout
        loginButton.classList.add('d-none');
        userNameSpan.classList.remove('d-none');
        logoutButton.classList.remove('d-none');
        userNameSpan.textContent = userName;
    } else {
        // Usuario no logueado: mostrar botón de inicio de sesión
        loginButton.classList.remove('d-none');
        userNameSpan.classList.add('d-none');
        logoutButton.classList.add('d-none');
    }
}

// Función para cerrar sesión
function logout() {
    // Eliminar datos de sesión de localStorage y sessionStorage
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Limpiar todas las cookies
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Limpiar el resto de localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Actualizar la interfaz inmediatamente
    updateAuthUI();
    
    // Redirigir a la página principal después de un breve delay
    setTimeout(() => {
        window.location.href = '/pages/barber_boss_site.html';
    }, 500);
}

// Función para obtener una cookie específica
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

// Función para establecer una cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Funciones de manejo de cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

// Función para cerrar sesión
function logout() {
    // Eliminar datos de sesión de localStorage y sessionStorage
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Limpiar todas las cookies
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Limpiar el resto de localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Actualizar la interfaz inmediatamente
    updateAuthUI();
    
    // Redirigir a la página principal después de un breve delay
    setTimeout(() => {
        window.location.href = '/pages/barber_boss_site.html';
    }, 500);
}

document.addEventListener('DOMContentLoaded', function () {
    // Actualizar la interfaz al cargar la página
    updateAuthUI();
    
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

    // 2. VALIDACIÓN DE FECHA PARA RESERVAS
    function validarFecha() {
        const fechaSeleccionada = document.getElementById('fechaSeleccionada').value;
        if (!fechaSeleccionada) return false;

        // Obtener fecha actual y sumarle 12 horas
        const fechaMinima = new Date();
        fechaMinima.setHours(fechaMinima.getHours() + 12);
        
        // Convertir la fecha seleccionada a objeto Date
        const fechaSeleccionadaObj = new Date(fechaSeleccionada);
        
        // Validar que la fecha seleccionada sea al menos 12 horas después
        if (fechaSeleccionadaObj < fechaMinima) {
            formMessage.textContent = 'Error: La fecha debe ser al menos 12 horas después de la hora actual.';
            return false;
        }
        
        return true;
    }

    // 3. ENVÍO DE FORMULARIO DE RESERVA
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar fecha
            const fechaSeleccionada = document.getElementById('fechaSeleccionada').value;
            if (!fechaSeleccionada) {
                formMessage.textContent = 'Por favor selecciona una fecha.';
                formMessage.style.color = '#dc3545';
                return;
            }

            // Obtener fecha actual y sumarle 12 horas
            const fechaMinima = new Date();
            fechaMinima.setHours(fechaMinima.getHours() + 12);
            
            // Convertir la fecha seleccionada a objeto Date
            const fechaSeleccionadaObj = new Date(fechaSeleccionada);
            
            // Validar que la fecha seleccionada sea al menos 12 horas después
            if (fechaSeleccionadaObj < fechaMinima) {
                formMessage.textContent = 'Error: La fecha debe ser al menos 12 horas después de la hora actual.';
                formMessage.style.color = '#dc3545';
                return;
            }

            // Inicializar EmailJS
            emailjs.init("YOUR_PUBLIC_KEY");

            // Enviar correo
            emailjs.send(
                "YOUR_SERVICE_ID",
                "YOUR_TEMPLATE_ID",
                {
                    to_email: data.email,
                    from_name: "Barber Boss",
                    message: `Hola ${data.nombre},\n\nGracias por tu reserva en Barber Boss.\n\nDetalles de tu cita:\nFecha: ${data.fecha}\nHora: ${data.hora}\nServicio: ${data.servicio}\n\n${data.mensaje ? 'Mensaje adicional:\n' + data.mensaje : ''}\n\nPor favor, llega 15 minutos antes de tu cita.\n\nAtentamente,\nBarber Boss`,
                }
            ).then(
                function(response) {
                    formMessage.textContent = '¡Reserva exitosa! Te hemos enviado los detalles a tu correo.';
                    contactForm.reset();
                },
                function(error) {
                    formMessage.textContent = 'Error al enviar la reserva. Por favor, intenta nuevamente.';
                }
            );
        });
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

    // Manejar el botón de inicio de sesión y el nombre del usuario
    const loginButton = document.getElementById('loginButton');
    const userNameSpan = document.getElementById('userName');
    const logoutButton = document.querySelector('.logout-btn');
    
    // Evento para el botón de inicio de sesión
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = '/login.html';
        });
    }
    
    // Evento para el botón de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Eliminar tanto cookie como localStorage
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            localStorage.clear();
            
            logout();
            updateAuthUI(); // Actualizar la interfaz después del logout
        });
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

    // 3. ENVÍO DE FORMULARIO DE RESERVA Y EMAIL
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            // Obtener datos del formulario
            const fecha = document.getElementById('fechaSeleccionada').value;
            const hora = contactForm.elements['hora'].value;
            const nombre = contactForm.elements['nombre'].value;
            const email = contactForm.elements['email'].value;
            const servicio = contactForm.elements['servicio'].value;
            const mensaje = contactForm.elements['mensaje'].value;

            // Validaciones básicas
            if (!fecha || !hora || !nombre || !email || !servicio) {
                formMessage.textContent = 'Por favor completa todos los campos obligatorios.';
                formMessage.style.color = '#dc3545';
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Por favor ingresa un correo electrónico válido.';
                formMessage.style.color = '#dc3545';
                return;
            }

            // Validar horario de atención (9 AM a 7 PM)
            const [hours, minutes] = hora.split(':').map(Number);
            if (hours < 9 || hours >= 19) {
                formMessage.textContent = 'Por favor selecciona un horario entre 9:00 AM y 7:00 PM';
                formMessage.style.color = '#dc3545';
                return;
            }

            // Validar minutos: solo 00 o 30 permitidos
            if (!(minutes === 0 || minutes === 30)) {
                formMessage.textContent = 'Solo puedes seleccionar horas en punto o medias horas (ej: 09:00, 09:30, 10:00, 10:30, etc).';
                formMessage.style.color = '#dc3545';
                return;
            }

            // Validar fecha futura
            const [year, month, day] = fecha.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                formMessage.textContent = 'Por favor selecciona una fecha futura.';
                formMessage.style.color = '#dc3545';
                return;
            }

            try {
                // Prepara los parámetros para EmailJS
                const templateParams = {
                    fecha: fecha,
                    hora: hora,
                    nombre: nombre,
                    email: email,
                    servicio: servicio,
                    mensaje: mensaje
                   
                };
                emailjs.init('2p9vFbazapEtsaXQ_');
                // Envía el correo usando EmailJS
                await emailjs.send('service_5f5w65s', 'template_ge0max5', templateParams);
                formMessage.textContent = '¡Cita reservada con éxito! Te enviaremos un correo de confirmación.';
                formMessage.style.color = '#28a745';
                contactForm.reset();
            } catch (error) {
                console.error('EmailJS error:', error);
                formMessage.textContent = 'Hubo un error al reservar la cita. Por favor intenta de nuevo.';
                formMessage.style.color = '#dc3545';
            }
        });
    }
});