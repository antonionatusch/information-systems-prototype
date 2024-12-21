document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-type-vacation-report');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const btnCreate = document.getElementById('btn-create');
    const vacationTypeSelect = document.getElementById('type-vacation');
    const reportTableBody = document.querySelector('#table-requests tbody');

    const vacations = JSON.parse(localStorage.getItem('solicitudes')) || [];
    const vacationTypes = JSON.parse(localStorage.getItem('tiposVacacion')) || [];

    // Mostrar modal al hacer clic en "Generar Reporte"
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        cargarTiposVacaciones(); // Cargar opciones en el selector
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

    // Cargar tipos de vacaciones en el selector
    const cargarTiposVacaciones = () => {
        vacationTypeSelect.innerHTML = '<option value="" disabled selected>Seleccione un tipo</option>';
        vacationTypes.forEach((type) => {
            const option = document.createElement('option');
            option.value = type.nombre; // Puedes usar `type.id` si prefieres
            option.textContent = type.nombre;
            vacationTypeSelect.appendChild(option);
        });
    };

    // Manejar la generación del reporte
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtener el tipo seleccionado
        const selectedType = vacationTypeSelect.value;

        // Filtrar vacaciones por el tipo seleccionado
        const filteredVacations = vacations.filter(vacation => vacation.motivo === selectedType);

        // Renderizar los resultados en la tabla
        renderReport(filteredVacations);

        modal.style.display = 'none';
    });

    // Renderizar el reporte en la tabla
    const renderReport = (filteredVacations) => {
        reportTableBody.innerHTML = ''; // Limpiar la tabla
        if (filteredVacations.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="4">No hay datos para el tipo seleccionado.</td>`;
            reportTableBody.appendChild(noDataRow);
            return;
        }

        filteredVacations.forEach((vacation) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vacation.nombre}</td>
                <td>${vacation.fechaInicio}</td>
                <td>${vacation.fechaFin}</td>
                <td>${vacation.horaInicio}</td>
                <td>${vacation.horaFin}</td>
                <td>${vacation.estado}</td>
            `;
            reportTableBody.appendChild(row);
        });
    };
});
