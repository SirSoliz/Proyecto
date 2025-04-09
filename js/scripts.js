document.addEventListener('DOMContentLoaded', function () {
    // Recuperar el nombre desde las cookies
    let userName = getCookie('userName');
    if (userName) {
        alert(`Bienvenido de nuevo, ${userName}!`);
        document.getElementById('name').value = userName;
    }

    // Evento para calcular la edad automáticamente
    document.getElementById('dob').addEventListener('change', function () {
        let dob = new Date(this.value);
        let age = new Date().getFullYear() - dob.getFullYear();
        document.getElementById('age').value = age;
    });

    // Evento para guardar en Local Storage y Cookies
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar que la página se recargue

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let dob = document.getElementById('dob').value;
        let gender = document.getElementById('gender').value;
        let age = document.getElementById('age').value;

        // Guardar en Local Storage
        let userData = { name, email, dob, gender, age };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Guardar el nombre en cookies por 7 días
        setCookie('userName', name, 7);

        alert('Datos guardados correctamente.');
    });

    // Recuperar datos almacenados en Local Storage al cargar la página
    let savedData = JSON.parse(localStorage.getItem('userData'));
    if (savedData) {
        document.getElementById('name').value = savedData.name;
        document.getElementById('email').value = savedData.email;
        document.getElementById('dob').value = savedData.dob;
        document.getElementById('gender').value = savedData.gender;
        document.getElementById('age').value = savedData.age;
    }

    // Cargar imágenes dinámicamente en la galería
    fetch('gallery.json')
        .then(response => response.json())
        .then(data => {
            let galleryContent = document.getElementById('gallery-content');
            data.images.forEach(image => {
                let div = document.createElement('div');
                div.classList.add('col-md-4');
                div.innerHTML = `<a href="${image.url}" class="d-block" data-bs-toggle="lightbox" data-bs-target="#gallery">
                                    <img src="${image.url}" class="img-fluid" alt="${image.alt}">
                                 </a>`;
                galleryContent.appendChild(div);
            });
        });
});

// Función para establecer una cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Función para obtener una cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}
