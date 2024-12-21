document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-type-permit-report');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const btnCreate = document.getElementById('btn-create');
    const permitTypeSelect = document.getElementById('type-permit');
    const reportTableBody = document.querySelector('#table-requests tbody');

    const permisos = JSON.parse(localStorage.getItem('permisos')) || [];
    const tiposPermisos = JSON.parse(localStorage.getItem('tiposPermiso')) || [];

    // Mostrar modal al hacer clic en "Generar Reporte"
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        cargarTiposPermisos(); // Cargar opciones en el selector
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

    // Cargar tipos de permisos en el selector
    const cargarTiposPermisos = () => {
        permitTypeSelect.innerHTML = '<option value="" disabled selected>Seleccione un tipo</option>';
        tiposPermisos.forEach((tipo) => {
            const option = document.createElement('option');
            option.value = tipo.nombre; // Puedes usar `tipo.id` si prefieres
            option.textContent = tipo.nombre;
            permitTypeSelect.appendChild(option);
        });
    };

    // Manejar la generación del reporte
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtener el tipo seleccionado
        const selectedType = permitTypeSelect.value;

        // Filtrar permisos por el tipo seleccionado
        const filteredPermisos = permisos.filter(permiso => permiso.motivo === selectedType);

        // Renderizar los resultados en la tabla
        renderReport(filteredPermisos);
    });

    // Renderizar el reporte en la tabla
    const renderReport = (filteredPermisos) => {
        reportTableBody.innerHTML = ''; // Limpiar la tabla
        if (filteredPermisos.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="5">No hay datos para el tipo seleccionado.</td>`;
            reportTableBody.appendChild(noDataRow);
            return;
        }

        filteredPermisos.forEach((permiso) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${permiso.nombre}</td>
                <td>${permiso.horaInicio}</td>
                <td>${permiso.horaFin}</td>
                <td>${permiso.observaciones}</td>
            `;
            reportTableBody.appendChild(row);
        });
    };
});
