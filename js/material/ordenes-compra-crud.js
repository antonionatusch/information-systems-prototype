document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orden-form');
    const modal = document.getElementById('form-modal');
    const closeModal = document.querySelector('.close');
    const btnCreate = document.getElementById('create-new');
    const tableBody = document.getElementById('ordenes-table');
    const codigoSolicitudSelect = document.getElementById('codigo-solicitud');
    const empleadoSolicitanteInput = document.getElementById('empleado-solicitante');

    // Obtener datos del Local Storage
    let ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
    let solicitudes = JSON.parse(localStorage.getItem('requests')) || [];
    let editingIndex = null;

    // Cargar solicitudes autorizadas en el selector
    solicitudes
        .filter(solicitud => solicitud.requestCode && solicitud.status === "Autorizado") // Filtra solicitudes autorizadas
        .forEach(solicitud => {
            const option = document.createElement('option');
            option.value = solicitud.requestCode; // Usa el código de la solicitud
            option.textContent = `${solicitud.requestCode} - ${solicitud.materialName}`; // Muestra el código y nombre del material
            codigoSolicitudSelect.appendChild(option);
        });

    // Mostrar modal para crear una nueva orden
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        empleadoSolicitanteInput.value = ''; // Limpia el campo empleado
        editingIndex = null;
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

    // Actualizar empleado solicitante al seleccionar una solicitud
    codigoSolicitudSelect.addEventListener('change', function () {
        const selectedSolicitud = solicitudes.find(solicitud => solicitud.requestCode === this.value);
        if (selectedSolicitud) {
            empleadoSolicitanteInput.value = selectedSolicitud.requester || 'Desconocido'; // Usa el requester del objeto solicitud
        } else {
            empleadoSolicitanteInput.value = ''; // Limpia el campo si no hay coincidencias
        }
    });

    // Guardar o editar una orden
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const codigoSolicitud = codigoSolicitudSelect.value;
        const codigoOrden = document.getElementById('codigo-orden').value;
        const fechaGeneracion = document.getElementById('fecha-generacion').value;
        const empleadoSolicitante = empleadoSolicitanteInput.value;

        if (!codigoSolicitud) {
            alert('Seleccione una solicitud válida.');
            return;
        }

        const nuevaOrden = { codigoSolicitud, codigoOrden, fechaGeneracion, empleadoSolicitante };

        if (editingIndex === null) {
            // Agregar nueva orden
            ordenes.push(nuevaOrden);
            agregarFila(nuevaOrden, ordenes.length - 1);
            alert('Orden de compra creada correctamente.');
        } else {
            // Editar orden existente
            ordenes[editingIndex] = nuevaOrden;
            actualizarFila(nuevaOrden, editingIndex);
            alert('Orden de compra actualizada correctamente.');
        }

        // Guardar en Local Storage
        localStorage.setItem('ordenes', JSON.stringify(ordenes));

        // Limpiar y cerrar el formulario
        form.reset();
        modal.style.display = 'none';
    });

    // Agregar fila a la tabla
    function agregarFila(orden, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${orden.codigoSolicitud}</td>
            <td>${orden.codigoOrden}</td>
            <td>${orden.fechaGeneracion}</td>
            <td>${orden.empleadoSolicitante}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

        newRow.querySelector('.btn-modify').addEventListener('click', () => {
            abrirParaEditar(orden, index);
        });

        newRow.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('¿Estás seguro de eliminar esta orden?')) {
                ordenes.splice(index, 1);
                localStorage.setItem('ordenes', JSON.stringify(ordenes));
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Abrir modal para editar una orden
    function abrirParaEditar(orden, index) {
        modal.style.display = 'flex';
        codigoSolicitudSelect.value = orden.codigoSolicitud;
        document.getElementById('codigo-orden').value = orden.codigoOrden;
        document.getElementById('fecha-generacion').value = orden.fechaGeneracion;
        empleadoSolicitanteInput.value = orden.empleadoSolicitante;
        editingIndex = index;
    }

    // Actualizar fila en la tabla
    function actualizarFila(orden, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[0].textContent = orden.codigoSolicitud;
        row.cells[1].textContent = orden.codigoOrden;
        row.cells[2].textContent = orden.fechaGeneracion;
        row.cells[3].textContent = orden.empleadoSolicitante;
    }

    // Inicializar tabla con órdenes existentes
    ordenes.forEach((orden, index) => agregarFila(orden, index));
});
