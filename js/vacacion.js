document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-vacation');

    // Evento para capturar y guardar solicitudes en localStorage
    form?.addEventListener('submit', function (event) {
        event.preventDefault();

        // Captura los valores del formulario
        const nombre = document.getElementById('name').value;
        const fechaInicio = document.getElementById('start-date').value;
        const horaInicio = document.getElementById('start-time').value;
        const fechaFin = document.getElementById('end-date').value;
        const motivo = document.querySelector('select[name="reason"] option:checked').textContent;

        // Crea un objeto con los datos de la solicitud
        const solicitud = {
            nombre,
            fechaInicio,
            horaInicio,
            fechaFin,
            motivo,
            estado: 'Pendiente',
        };

        // Obtiene las solicitudes existentes en localStorage
        const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];

        // Agrega la nueva solicitud
        solicitudes.push(solicitud);

        // Guarda las solicitudes actualizadas en localStorage
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));

        // Resetea el formulario
        form.reset();

        alert('Solicitud guardada correctamente.');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#table-requests tbody');

    // Obtiene las solicitudes desde localStorage
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];

    // Itera sobre las solicitudes y las agrega a la tabla
    solicitudes.forEach((solicitud, index) => agregarFila(solicitud, index));

    // Función para agregar una fila a la tabla
    function agregarFila(solicitud, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${solicitud.nombre}</td>
            <td>${solicitud.fechaInicio}</td>
            <td>${solicitud.horaInicio}</td>
            <td>${solicitud.fechaFin}</td>
            <td>${solicitud.motivo}</td>
            <td class="estado">${solicitud.estado}</td>
            <td>
                <button class="button button-approve">Aprobar</button>
                <button class="button button-reject">Rechazar</button>
                <button class="button button-delete">&times;</button>
            </td>
        `;

        // Funcionalidad para el botón "Aprobar"
        newRow.querySelector('.button-approve').addEventListener('click', function () {
            solicitud.estado = 'Aprobado';
            actualizarEstado(newRow, solicitud, index);
        });

        // Funcionalidad para el botón "Rechazar"
        newRow.querySelector('.button-reject').addEventListener('click', function () {
            solicitud.estado = 'Rechazado';
            actualizarEstado(newRow, solicitud, index);
        });

        // Funcionalidad para el botón "Eliminar"
        newRow.querySelector('.button-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para actualizar el estado en la fila y localStorage
    function actualizarEstado(fila, solicitud, index) {
        fila.querySelector('.estado').textContent = solicitud.estado; // Actualiza el estado en la tabla
        solicitudes[index] = solicitud; // Actualiza el estado en el array
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes)); // Guarda en localStorage
    }

    // Función para eliminar una solicitud del localStorage
    function eliminarFila(index) {
        solicitudes.splice(index, 1); // Elimina la solicitud del array
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes)); // Guarda los cambios
    }
});
