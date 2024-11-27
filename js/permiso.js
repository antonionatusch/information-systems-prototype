document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-permit');

    // Evento para capturar y guardar solicitudes en localStorage
    form?.addEventListener('submit', function (event) {
        event.preventDefault();

        // Captura los valores del formulario
        const nombre = document.getElementById('name').value;
        const jefe = document.getElementById('boss').value;
        const unidad = document.querySelector('select[name="unit"] option:checked').textContent;
        const horaInicio = document.getElementById('start-time').value;
        const horaFin = document.getElementById('end-time').value;
        const motivo = document.querySelector('select[name="reason"] option:checked').textContent;
        const observaciones = document.getElementById('description').value;

        // Crea un objeto con los datos del permiso
        const permiso = {
            nombre,
            jefe,
            unidad,
            horaInicio,
            horaFin,
            motivo,
            observaciones,
        };

        // Obtiene los permisos existentes en localStorage
        const permisos = JSON.parse(localStorage.getItem('permisos')) || [];

        // Agrega el nuevo permiso
        permisos.push(permiso);

        // Guarda los permisos actualizados en localStorage
        localStorage.setItem('permisos', JSON.stringify(permisos));

        // Resetea el formulario
        form.reset();

        alert('Permiso guardado correctamente.');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#table-requests tbody');

    // Obtiene los permisos desde localStorage
    const permisos = JSON.parse(localStorage.getItem('permisos')) || [];

    // Itera sobre los permisos y los agrega a la tabla
    permisos.forEach((permiso, index) => agregarFila(permiso, index));

    // Función para agregar una fila a la tabla
    function agregarFila(permiso, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${permiso.nombre}</td>
            <td>${permiso.jefe}</td>
            <td>${permiso.unidad}</td>
            <td>${permiso.horaInicio}</td>
            <td>${permiso.horaFin}</td>
            <td>${permiso.motivo}</td>
            <td>${permiso.observaciones}</td>
            <td>
                <button class="button button-delete">&times;</button>
            </td>
        `;

        // Funcionalidad para el botón "Eliminar"
        newRow.querySelector('.button-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar este permiso?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para eliminar un permiso del localStorage
    function eliminarFila(index) {
        permisos.splice(index, 1); // Elimina el permiso del array
        localStorage.setItem('permisos', JSON.stringify(permisos)); // Guarda los cambios
    }
});
