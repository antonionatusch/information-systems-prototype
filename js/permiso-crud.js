document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-permit');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const tableBody = document.querySelector('#table-requests tbody');
    const btnCreate = document.getElementById('btn-create');

    // Obtiene los permisos existentes en localStorage
    const permisos = JSON.parse(localStorage.getItem('permisos')) || [];
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

    // Evento para capturar y guardar solicitudes en localStorage
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Captura los valores del formulario
        const nombre = document.getElementById('name').value;
        const unidad = document.querySelector('select[name="unit"] option:checked').textContent;
        const horaInicio = document.getElementById('start-time').value;
        const horaFin = document.getElementById('end-time').value;
        const motivo = document.querySelector('select[name="reason"] option:checked').textContent;
        const observaciones = document.getElementById('description').value;

        // Crea un objeto con los datos del permiso
        const permiso = {
            id: 1,
            nombre,
            unidad,
            horaInicio,
            horaFin,
            motivo,
            observaciones,
        };

        if (editingIndex === null) {
            // Si no se está editando, agregar un nuevo permiso
            permisos.push(permiso);
            agregarFila(permiso, permisos.length - 1);
            alert('Solicitud creada correctamente.');
        } else {
            // Si se está editando, actualizar los datos
            permisos[editingIndex] = permiso;
            actualizarFila(permiso, editingIndex);
            alert('Solicitud modificada correctamente.');
        }

        // Guardar en localStorage
        localStorage.setItem('permisos', JSON.stringify(permisos));

        // Limpiar formulario y cerrar modal
        form.reset();
        modal.style.display = 'none';
    });

    // Itera sobre los permisos y los agrega a la tabla
    permisos.forEach((permiso, index) => agregarFila(permiso, index));

    // Función para agregar una fila a la tabla
    function agregarFila(permiso, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${permiso.id + index}</td>
            <td>${permiso.nombre}</td>
            <td>${permiso.unidad}</td>
            <td>${permiso.horaInicio}</td>
            <td>${permiso.horaFin}</td>
            <td>${permiso.motivo}</td>
            <td>${permiso.observaciones}</td>
            <td>
                <button class="button btn-modify">Modificar</button>
                <button class="button btn-delete">Eliminar</button>
            </td>
        `;

        // Botón "Modificar"
        newRow.querySelector('.btn-modify').addEventListener('click', function () {
            abrirParaEditar(permiso, index);
        });

        // Botón "Eliminar"
        newRow.querySelector('.btn-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar este permiso?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para abrir el modal y rellenar el formulario para edición
    function abrirParaEditar(permiso, index) {
        modal.style.display = 'flex';
        document.getElementById('name').value = permiso.nombre;
        document.getElementById('boss').value = permiso.jefe;
        document.querySelector('select[name="unit"]').value = permiso.unidad;
        document.getElementById('start-time').value = permiso.horaInicio;
        document.getElementById('end-time').value = permiso.horaFin;
        document.querySelector('select[name="reason"]').value = permiso.motivo;
        document.getElementById('description').value = permiso.observaciones;
        editingIndex = index; // Guardar el índice de la fila que se está editando
    }

    // Función para actualizar una fila en la tabla
    function actualizarFila(permiso, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[1].textContent = permiso.nombre;
        row.cells[2].textContent = permiso.jefe;
        row.cells[3].textContent = permiso.unidad;
        row.cells[4].textContent = permiso.horaInicio;
        row.cells[5].textContent = permiso.horaFin;
        row.cells[6].textContent = permiso.motivo;
        row.cells[7].textContent = permiso.observaciones;
    }

    // Función para eliminar una fila de localStorage
    function eliminarFila(index) {
        permisos.splice(index, 1); // Eliminar del array
        localStorage.setItem('permisos', JSON.stringify(permisos)); // Guardar cambios
    }
});
