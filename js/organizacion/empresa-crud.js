document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('empresa-form');
    const modal = document.getElementById('form-modal');
    const closeModal = document.querySelector('.close');
    const btnCreate = document.getElementById('create-new');
    const tableBody = document.getElementById('empresa-table');
    const cancelButton = document.getElementById('cancel-button');

    let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    let editingIndex = null; // Índice para rastrear la fila que se está editando

    // Mostrar modal al hacer clic en "Crear Empresa"
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        editingIndex = null; // Restablecer el índice de edición
    });

    // Cerrar modal al hacer clic en la "X"
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic en "Cancelar"
    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar o actualizar empresa al enviar el formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Capturar valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const contacto = document.getElementById('contacto').value.trim();

        const nuevaEmpresa = { nombre, direccion, email, telefono, contacto };

        if (editingIndex === null) {
            // Si no se está editando, agregar una nueva empresa
            empresas.push(nuevaEmpresa);
            agregarFila(nuevaEmpresa, empresas.length - 1);
            alert('Empresa creada correctamente.');
        } else {
            // Si se está editando, actualizar los datos
            empresas[editingIndex] = nuevaEmpresa;
            actualizarFila(nuevaEmpresa, editingIndex);
            alert('Empresa modificada correctamente.');
        }

        // Guardar en localStorage
        localStorage.setItem('empresas', JSON.stringify(empresas));

        // Limpiar y cerrar el formulario
        form.reset();
        modal.style.display = 'none';
    });

    // Cargar filas existentes al inicio
    empresas.forEach((empresa, index) => agregarFila(empresa, index));

    // Función para agregar una fila a la tabla
    function agregarFila(empresa, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${empresa.nombre}</td>
            <td>${empresa.direccion}</td>
            <td>${empresa.email}</td>
            <td>${empresa.telefono}</td>
            <td>${empresa.contacto}</td>
            <td>
                <button class="button btn-modify">Modificar</button>
                <button class="button btn-delete">Eliminar</button>
            </td>
        `;

        // Botón "Modificar"
        newRow.querySelector('.btn-modify').addEventListener('click', function () {
            abrirParaEditar(empresa, index);
        });

        // Botón "Eliminar"
        newRow.querySelector('.btn-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para abrir el modal y rellenar el formulario para edición
    function abrirParaEditar(empresa, index) {
        modal.style.display = 'flex';
        document.getElementById('nombre').value = empresa.nombre;
        document.getElementById('direccion').value = empresa.direccion;
        document.getElementById('email').value = empresa.email;
        document.getElementById('telefono').value = empresa.telefono;
        document.getElementById('contacto').value = empresa.contacto;
        editingIndex = index; // Guardar el índice de la fila que se está editando
    }

    // Función para actualizar una fila en la tabla
    function actualizarFila(empresa, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[0].textContent = empresa.nombre;
        row.cells[1].textContent = empresa.direccion;
        row.cells[2].textContent = empresa.email;
        row.cells[3].textContent = empresa.telefono;
        row.cells[4].textContent = empresa.contacto;
    }

    // Función para eliminar una fila de localStorage
    function eliminarFila(index) {
        empresas.splice(index, 1); // Eliminar del array
        localStorage.setItem('empresas', JSON.stringify(empresas)); // Guardar cambios
    }
});
