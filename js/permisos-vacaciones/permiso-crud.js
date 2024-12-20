document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-permit');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const tableBody = document.querySelector('#table-requests tbody');
    const btnCreate = document.getElementById('btn-create');
    const reasonSelect = document.querySelector('select[name="reason"]');
    const unitSelect = document.querySelector('select[name="unit"]');

    let permisos = JSON.parse(localStorage.getItem('permisos')) || [];
    let editingIndex = null;

    // Obtener los tipos de permisos y departamentos desde localStorage
    const tiposPermisos = JSON.parse(localStorage.getItem('tiposPermiso')) || [];
    const departamentos = JSON.parse(localStorage.getItem('departamentos')) || [];

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
        const nombre = document.getElementById('name').value;
        const jefe = document.getElementById('boss').value;
        const unidad = unitSelect.options[unitSelect.selectedIndex]?.textContent;
        const horaInicio = document.getElementById('start-time').value;
        const horaFin = document.getElementById('end-time').value;
        const motivo = reasonSelect.options[reasonSelect.selectedIndex]?.textContent;
        const observaciones = document.getElementById('description').value;

        const nuevoPermiso = {
            id: permisos.length + 1,
            nombre,
            jefe,
            unidad,
            horaInicio,
            horaFin,
            motivo,
            observaciones,
        };

        if (editingIndex === null) {
            permisos.push(nuevoPermiso);
            agregarFila(nuevoPermiso, permisos.length - 1);
            alert('Permiso creado correctamente.');
        } else {
            permisos[editingIndex] = nuevoPermiso;
            actualizarFila(nuevoPermiso, editingIndex);
            alert('Permiso modificado correctamente.');
        }

        localStorage.setItem('permisos', JSON.stringify(permisos));

        form.reset();
        modal.style.display = 'none';
    });

    // Cargar filas existentes al inicio
    permisos.forEach((permiso, index) => agregarFila(permiso, index));

    // Función para agregar una fila a la tabla
    function agregarFila(permiso, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${permiso.id}</td>
            <td>${permiso.nombre}</td>
            <td>${permiso.jefe}</td>
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

        newRow.querySelector('.btn-modify').addEventListener('click', function () {
            abrirParaEditar(permiso, index);
        });

        newRow.querySelector('.btn-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar este permiso?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    function abrirParaEditar(permiso, index) {
        modal.style.display = 'flex';
        document.getElementById('name').value = permiso.nombre;
        document.getElementById('boss').value = permiso.jefe;
        unitSelect.value = permiso.unidad;
        document.getElementById('start-time').value = permiso.horaInicio;
        document.getElementById('end-time').value = permiso.horaFin;
        reasonSelect.value = permiso.motivo;
        document.getElementById('description').value = permiso.observaciones;
        editingIndex = index;
    }

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

    function eliminarFila(index) {
        permisos.splice(index, 1);
        localStorage.setItem('permisos', JSON.stringify(permisos));
    }

    // Cargar tipos de permisos en el selector
    const cargarTiposPermisos = () => {
        reasonSelect.innerHTML = '<option value="" disabled selected></option>';
        tiposPermisos.forEach((tipo) => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nombre;
            reasonSelect.appendChild(option);
        });
    };

    // Cargar departamentos en el selector de unidad
    const cargarDepartamentos = () => {
        unitSelect.innerHTML = '<option value="" disabled selected></option>';
        departamentos.forEach((departamento) => {
            const option = document.createElement('option');
            option.value = departamento.id;
            option.textContent = departamento.nombre;
            unitSelect.appendChild(option);
        });
    };

    cargarTiposPermisos();
    cargarDepartamentos();
});
