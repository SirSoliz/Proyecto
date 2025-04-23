// --- DIAL PICKER HORIZONTAL MODERNO CON ANIMACIÓN Y VALIDACIONES ---
class DialDate {
    #year = [];
    #month = 1;
    #day = 1;
    #currentDate;
    #dateDisplay;
    #picker;
    #svg;
    #config = {
        day:   { min: 1, max: 31, r: 110, cx: 140,  cy: 110, label: 'Día' },
        month: { min: 1, max: 12, r: 75, cx: 340, cy: 110, label: 'Mes' },
        year:  { min: new Date().getFullYear(), max: new Date().getFullYear() + 4, r: 50, cx: 520, cy: 110, label: 'Año' }
    };
    constructor() {
        this.#currentDate = new Date();
        this.#dateDisplay = document.querySelector('.date-display');
        this.#picker = document.getElementById('picker');
        this.#svg = this.#picker.querySelector('svg');
        this.#initValues();
        this.#drawDials();
        this.#updateDisplay();
    }
    #initValues() {
        this.#year = [this.#currentDate.getFullYear()];
        this.#month = this.#currentDate.getMonth() + 1;
        this.#day = this.#currentDate.getDate();
    }
    #drawDials() {
        console.log('Dibujando diales...')
        this.#svg.innerHTML = '';
        // Dibuja los círculos primero
        ['day','month','year'].forEach((type) => {
            const conf = this.#config[type];
            const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
            circle.setAttribute('cx', conf.cx);
            circle.setAttribute('cy', conf.cy);
            circle.setAttribute('r', conf.r);
            circle.setAttribute('stroke', '#ffc107');
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('fill', '#232323');
            circle.setAttribute('class', 'dial-circle');
            this.#svg.appendChild(circle);
        });
        // Ahora los números y etiquetas
        ['day','month','year'].forEach((type) => {
            const conf = this.#config[type];
            const total = conf.max - conf.min + 1;
            for(let i=conf.min; i<=conf.max; i++){
                const idx = i - conf.min;
                // Distribución especial para pocos valores
                let angle;
                if (total === 2) {
                    angle = (idx === 0 ? -Math.PI/3 : Math.PI/3);
                } else if (total === 3) {
                    angle = (idx-1) * (Math.PI/3); // -60°, 0°, 60°
                } else {
                    angle = (idx / total) * 2 * Math.PI - Math.PI/2;
                }
                const x = conf.cx + Math.cos(angle) * (conf.r - 10);
                const y = conf.cy + Math.sin(angle) * (conf.r - 10) + 5;
                const text = document.createElementNS('http://www.w3.org/2000/svg','text');
                text.setAttribute('x', x);
                text.setAttribute('y', y);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('class', `dial-value dial-value-${type}` + (this.#getValue(type) === i ? ' selected animate' : ''));
                text.setAttribute('data-value', i);
                text.style.cursor = 'pointer';
                text.textContent = i;
                text.addEventListener('click', () => {
                    this.#setValue(type, i);
                    this.#drawDials();
                    this.#updateDisplay();
                });
                this.#svg.appendChild(text);
            }
            // Etiqueta
            const label = document.createElementNS('http://www.w3.org/2000/svg','text');
            label.setAttribute('x', conf.cx);
            label.setAttribute('y', conf.cy + conf.r + 18);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('class', 'label');
            label.textContent = conf.label;
            this.#svg.appendChild(label);
        });
    }
    #getValue(type) {
        if(type === 'day') return this.#day;
        if(type === 'month') return this.#month;
        if(type === 'year') return this.#year[0];
    }
    #setValue(type, value) {
        if(type === 'day') this.#day = value;
        if(type === 'month') this.#month = value;
        if(type === 'year') this.#year = [value];
    }
    #updateDisplay() {
        if(this.#dateDisplay) {
            this.#dateDisplay.textContent = `${this.#day.toString().padStart(2,'0')}/${this.#month.toString().padStart(2,'0')}/${this.#year[0]}`;
        }
    }
    getSelectedDate() {
        return new Date(this.#year[0], this.#month-1, this.#day);
    }
}

// --- Date Picker tipo rueda personalizado ---
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de rangos
    const minYear = new Date().getFullYear();
    const maxYear = minYear + 4;
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Elementos
    const wheelDay = document.getElementById('wheel-day');
    const wheelMonth = document.getElementById('wheel-month');
    const wheelYear = document.getElementById('wheel-year');
    const dateDisplay = document.querySelector('.date-display');
    const fechaInput = document.getElementById('fechaSeleccionada');
    const pickerSelectedLabel = document.getElementById('picker-selected-label');

    // Estado actual
    let selectedDay = 1;
    let selectedMonth = 1;
    let selectedYear = minYear;

    // Helpers para días válidos
    function getMaxDay(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // Renderiza las ruedas
    function renderWheel(el, values, selected, type) {
        let html = '<ul class="wheel-list">';
        values.forEach(val => {
            html += `<li class="wheel-item${val===selected ? ' selected' : ''}" data-value="${val}">${type==='month' ? monthNames[val-1] : val}</li>`;
        });
        html += '</ul>';
        el.innerHTML = html;
    }

    // Actualiza todas las ruedas y el display
    function updateAll(animateType) {
        // Días depende de mes/año
        const maxDay = getMaxDay(selectedMonth, selectedYear);
        if (selectedDay > maxDay) selectedDay = maxDay;
        renderWheel(wheelDay, Array.from({length:maxDay},(_,i)=>i+1), selectedDay, 'day');
        renderWheel(wheelMonth, Array.from({length:12},(_,i)=>i+1), selectedMonth, 'month');
        renderWheel(wheelYear, Array.from({length:maxYear-minYear+1},(_,i)=>minYear+i), selectedYear, 'year');
        // Actualiza display
        const fechaStr = `${selectedDay.toString().padStart(2,'0')}/${selectedMonth.toString().padStart(2,'0')}/${selectedYear}`;
        if(dateDisplay) dateDisplay.textContent = fechaStr;
        if(fechaInput) fechaInput.value = fechaStr;
        if(pickerSelectedLabel) pickerSelectedLabel.textContent = 'Fecha seleccionada: ' + fechaStr;
        // Animación
        if (animateType) {
            let wheel;
            if (animateType==='day') wheel = wheelDay;
            if (animateType==='month') wheel = wheelMonth;
            if (animateType==='year') wheel = wheelYear;
            if (wheel) {
                const selected = wheel.querySelector('.selected');
                if(selected) {
                    selected.classList.add('animate');
                    setTimeout(()=>selected.classList.remove('animate'), 400);
                }
            }
        }
    }

    // Evento de click en ruedas
    function handleWheelClick(e, type) {
        if(e.target.classList.contains('wheel-item')) {
            const val = Number(e.target.getAttribute('data-value'));
            if(type==='day') selectedDay = val;
            if(type==='month') selectedMonth = val;
            if(type==='year') selectedYear = val;
            updateAll(type);
        }
    }

    // Scroll automático para centrar el seleccionado
    function scrollToSelected(wheel) {
        const selected = wheel.querySelector('.selected');
        if(selected) {
            wheel.scrollTop = selected.offsetTop - wheel.clientHeight/2 + selected.clientHeight/2;
        }
    }

    // Inicialización
    updateAll();
    scrollToSelected(wheelDay);
    scrollToSelected(wheelMonth);
    scrollToSelected(wheelYear);

    // Delegación de eventos
    wheelDay.addEventListener('click', e => { handleWheelClick(e, 'day'); scrollToSelected(wheelDay); });
    wheelMonth.addEventListener('click', e => { handleWheelClick(e, 'month'); scrollToSelected(wheelMonth); });
    wheelYear.addEventListener('click', e => { handleWheelClick(e, 'year'); scrollToSelected(wheelYear); });

    // Permite scroll con mouse/wheel
    [wheelDay, wheelMonth, wheelYear].forEach(wheel => {
        wheel.addEventListener('wheel', () => {
            setTimeout(() => scrollToSelected(wheel), 100);
        });
    });

    // (Opcional) Si quieres que al abrir el picker siempre centre el seleccionado:
    setTimeout(() => {
        scrollToSelected(wheelDay);
        scrollToSelected(wheelMonth);
        scrollToSelected(wheelYear);
    }, 200);
});

// --- VALIDACIONES Y ENVÍO ---
document.addEventListener('DOMContentLoaded',()=>{
    const dialDate = new DialDate();
    // Manejar el envío del formulario
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    if(!contactForm) return;
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedDate = dialDate.getSelectedDate();
        const hora = contactForm.hora.value;
        const nombre = contactForm.nombre.value.trim();
        const email = contactForm.email.value.trim();
        const servicio = contactForm.servicio.value;
        const mensaje = contactForm.mensaje.value.trim();

        // Validaciones
        if(!nombre || !email || !servicio || !hora){
            formMessage.textContent = 'Por favor completa todos los campos obligatorios.';
            formMessage.style.color = '#dc3545';
            return;
        }
        // Validar formato de email
        if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)){
            formMessage.textContent = 'Correo electrónico no válido.';
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
        // Validar que la fecha no sea anterior a hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            formMessage.textContent = 'Por favor selecciona una fecha futura';
            formMessage.style.color = '#dc3545';
            return;
        }
        // Validar días válidos del mes
        const maxDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth()+1, 0).getDate();
        if(selectedDate.getDate() > maxDay){
            formMessage.textContent = 'El día seleccionado no es válido para el mes/año elegido.';
            formMessage.style.color = '#dc3545';
            return;
        }

        // Aquí puedes agregar la lógica para enviar el correo con EmailJS
        try {
            const templateParams = {
                fecha: selectedDate.toLocaleDateString('es-CR'),
                hora: hora,
                nombre: nombre,
                email: email,
                servicio: servicio,
                mensaje: mensaje
            };
            // Enviar correo usando EmailJS (asumiendo que ya está configurado)
            await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
            formMessage.textContent = '¡Cita reservada con éxito! Te enviaremos un correo de confirmación.';
            formMessage.style.color = '#28a745';
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Hubo un error al reservar la cita. Por favor intenta de nuevo.';
            formMessage.style.color = '#dc3545';
        }
    });
});