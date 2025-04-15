document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-unit-permit-report');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const btnCreate = document.getElementById('btn-create');
    const unitSelect = document.getElementById('unit');
    const reportTableBody = document.querySelector('#table-requests tbody');

    const permisos = JSON.parse(localStorage.getItem('permisos')) || [];
    const departamentos = JSON.parse(localStorage.getItem('departamentos')) || [];

    // Mostrar modal al hacer clic en "Generar Reporte"
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        cargarDepartamentos(); // Cargar opciones en el selector
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

    // Cargar departamentos en el selector
    const cargarDepartamentos = () => {
        unitSelect.innerHTML = '<option value="" disabled selected>Seleccione un departamento</option>';
        departamentos.forEach((departamento) => {
            const option = document.createElement('option');
            option.value = departamento.nombre; // Asumiendo que "nombre" es la clave del departamento
            option.textContent = departamento.nombre;
            unitSelect.appendChild(option);
        });
    };

    // Manejar la generación del reporte
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtener el departamento seleccionado
        const selectedUnit = unitSelect.value;

        // Filtrar permisos por el departamento seleccionado
        const filteredPermisos = permisos.filter(permiso => permiso.unidad === selectedUnit);

        // Renderizar los resultados en la tabla
        renderReport(filteredPermisos);

        modal.style.display = 'none';
    });

    // Renderizar el reporte en la tabla
    const renderReport = (filteredPermisos) => {
        reportTableBody.innerHTML = ''; // Limpiar la tabla
        if (filteredPermisos.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="4">No hay permisos para el departamento seleccionado.</td>`;
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
