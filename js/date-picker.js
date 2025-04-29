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