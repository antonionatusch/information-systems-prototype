document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-vacation');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const tableBody = document.querySelector('#table-requests tbody');
    const btnCreate = document.getElementById('btn-create');

    let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    let editingIndex = null; // Índice para rastrear si se está editando una fila

    // Mostrar modal al hacer clic en "Crear"
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        editingIndex = null; // Restablecer el índice de edición
    });

    // Cerrar modal al hacer clic en la "X"
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar o actualizar solicitud al enviar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Captura los valores del formulario
        const id = document.getElementById('id').value;
        const fechaInicio = document.getElementById('start-date').value;
        const fechaFin = document.getElementById('end-date').value;
        const horaInicio = document.getElementById('start-time').value;
        const horaFin = document.getElementById('end-time').value;
        const motivo = document.querySelector('select[name="reason"] option:checked').textContent;

        const nuevaSolicitud = { 
            id, 
            fechaInicio, 
            fechaFin, 
            horaInicio, 
            horaFin, 
            motivo, 
            estado: 'Pendiente' 
        };

        if (editingIndex === null) {
            // Si no se está editando, agregar una nueva solicitud
            solicitudes.push(nuevaSolicitud);
            agregarFila(nuevaSolicitud, solicitudes.length - 1);
            alert('Solicitud creada correctamente.');
        } else {
            // Si se está editando, actualizar los datos
            solicitudes[editingIndex] = nuevaSolicitud;
            actualizarFila(nuevaSolicitud, editingIndex);
            alert('Solicitud modificada correctamente.');
        }

        // Guardar en localStorage
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));

        // Limpiar formulario y cerrar modal
        form.reset();
        modal.style.display = 'none';
    });

    // Cargar filas existentes al inicio
    solicitudes.forEach((solicitud, index) => agregarFila(solicitud, index));

    // Función para agregar una fila a la tabla
    function agregarFila(solicitud, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${solicitud.id}</td>
            <td>Werner</td>
            <td>${solicitud.fechaInicio}</td>
            <td>${solicitud.fechaFin}</td>
            <td>${solicitud.horaInicio}</td>
            <td>${solicitud.horaFin}</td>
            <td>${solicitud.motivo}</td>
            <td class="estado">${solicitud.estado}</td>
            <td>
                <button class="button btn-approve">Aceptar</button>
                <button class="button btn-reject">Rechazar</button>
                <button class="button btn-modify">Modificar</button>
                <button class="button btn-delete">Eliminar</button>
            </td>
        `;

        // Funcionalidad para el botón "Aprobar"
        newRow.querySelector('.btn-approve').addEventListener('click', function () {
            solicitud.estado = 'Aprobado';
            actualizarEstado(newRow, solicitud, index);
        });

        // Funcionalidad para el botón "Rechazar"
        newRow.querySelector('.btn-reject').addEventListener('click', function () {
            solicitud.estado = 'Rechazado';
            actualizarEstado(newRow, solicitud, index);
        });

        // Botón "Modificar"
        newRow.querySelector('.btn-modify').addEventListener('click', function () {
            abrirParaEditar(solicitud, index);
        });

        // Botón "Eliminar"
        newRow.querySelector('.btn-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para abrir el modal y rellenar el formulario para edición
    function abrirParaEditar(solicitud, index) {
        modal.style.display = 'flex';
        document.getElementById('id').value = solicitud.id;
        document.getElementById('start-date').value = solicitud.fechaInicio;
        document.getElementById('end-date').value = solicitud.fechaFin;
        document.getElementById('start-time').value = solicitud.horaInicio;
        document.getElementById('end-time').value = solicitud.horaFin;
        document.querySelector('select[name="reason"]').value = solicitud.motivo;
        editingIndex = index; // Guardar el índice de la fila que se está editando
    }

    // Función para actualizar el estado en la fila y localStorage
    function actualizarEstado(fila, solicitud, index) {
        fila.querySelector('.estado').textContent = solicitud.estado; // Actualiza el estado en la tabla
        solicitudes[index] = solicitud; // Actualiza el estado en el array
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes)); // Guarda en localStorage
    }

    // Función para actualizar una fila en la tabla
    function actualizarFila(solicitud, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[0].textContent = solicitud.id;
        row.cells[2].textContent = solicitud.fechaInicio;
        row.cells[3].textContent = solicitud.fechaFin;
        row.cells[4].textContent = solicitud.horaInicio;
        row.cells[5].textContent = solicitud.horaFin;
        row.cells[6].textContent = solicitud.motivo;
        row.cells[7].textContent = solicitud.estado;
    }

    // Función para eliminar una solicitud del localStorage
    function eliminarFila(index) {
        solicitudes.splice(index, 1);
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    }
});
