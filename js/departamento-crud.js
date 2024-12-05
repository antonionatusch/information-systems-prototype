document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-department');
    const modal = document.getElementById('form-modal');
    const closeModal = document.getElementById('close-modal');
    const btnCreate = document.getElementById('btn-create');
    const tableBody = document.querySelector('#table-requests tbody');

    let departamentos = JSON.parse(localStorage.getItem('departamentos')) || [];
    let editingIndex = null; // Índice para rastrear la fila que se está editando

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

    // Guardar o actualizar departamento al enviar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Capturar valores del formulario
        const id = document.getElementById('id').value;
        const nombre = document.getElementById('name').value;
        const descripcion = document.getElementById('description').value;

        const nuevoDepartamento = { id, nombre, descripcion };

        if (editingIndex === null) {
            // Si no se está editando, agregar un nuevo tipo
            departamentos.push(nuevoDepartamento);
            agregarFila(nuevoDepartamento, departamentos.length - 1);
            alert('departamento creado correctamente.');
        } else {
            // Si se está editando, actualizar los datos
            departamentos[editingIndex] = nuevoDepartamento;
            actualizarFila(nuevoDepartamento, editingIndex);
            alert('departamento modificado correctamente.');
        }

        // Guardar en localStorage
        localStorage.setItem('departamentos', JSON.stringify(departamentos));

        // Limpiar y cerrar el formulario
        form.reset();
        modal.style.display = 'none';
    });

    // Cargar filas existentes al inicio
    departamentos.forEach((tipo, index) => agregarFila(tipo, index));

    // Función para agregar una fila a la tabla
    function agregarFila(tipo, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${tipo.id}</td>
            <td>${tipo.nombre}</td>
            <td>${tipo.descripcion}</td>
            <td>
                <button class="button btn-modify">Modificar</button>
                <button class="button btn-delete">Eliminar</button>
            </td>
        `;

        // Botón "Modificar"
        newRow.querySelector('.btn-modify').addEventListener('click', function () {
            abrirParaEditar(tipo, index);
        });

        // Botón "Eliminar"
        newRow.querySelector('.btn-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para abrir el modal y rellenar el formulario para edición
    function abrirParaEditar(tipo, index) {
        modal.style.display = 'flex';
        document.getElementById('id').value = tipo.id;
        document.getElementById('name').value = tipo.nombre;
        document.getElementById('description').value = tipo.descripcion;
        editingIndex = index; // Guardar el índice de la fila que se está editando
    }

    // Función para actualizar una fila en la tabla
    function actualizarFila(tipo, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[0].textContent = tipo.id;
        row.cells[1].textContent = tipo.nombre;
        row.cells[2].textContent = tipo.descripcion;
    }

    // Función para eliminar una fila de localStorage
    function eliminarFila(index) {
        departamentos.splice(index, 1); // Eliminar del array
        localStorage.setItem('departamentos', JSON.stringify(departamentos)); // Guardar cambios
    }
});
