document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('empresa-form');
    const modal = document.getElementById('form-modal');
    const closeModal = document.querySelector('.close');
    const btnCreate = document.getElementById('create-new');
    const tableBody = document.getElementById('empresa-table');
    const responsablesSelect = document.getElementById('responsables');

    let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    let responsables = JSON.parse(localStorage.getItem('responsables')) || [];
    let editingIndex = null; // Índice para edición

    // Poblar el selector de responsables
    function populateResponsablesSelect(selectedResponsable = "") {
        responsablesSelect.innerHTML = '';
        responsables.forEach(responsable => {
            const option = document.createElement('option');
            option.value = responsable.nombre;
            option.textContent = responsable.nombre;
            if (selectedResponsable === responsable.nombre) {
                option.selected = true;
            }
            responsablesSelect.appendChild(option);
        });
    }

    // Mostrar modal para crear empresa
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        editingIndex = null;
        populateResponsablesSelect();
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar o editar empresa
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const direccion = document.getElementById('direccion').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const responsableSeleccionado = responsablesSelect.value;

        const nuevaEmpresa = { nombre, direccion, email, telefono, responsable: responsableSeleccionado };

        if (editingIndex === null) {
            empresas.push(nuevaEmpresa);
            agregarFila(nuevaEmpresa, empresas.length - 1);
            alert('Empresa creada correctamente.');
        } else {
            empresas[editingIndex] = nuevaEmpresa;
            actualizarFila(nuevaEmpresa, editingIndex);
            alert('Empresa modificada correctamente.');
        }

        localStorage.setItem('empresas', JSON.stringify(empresas));
        form.reset();
        modal.style.display = 'none';
    });

    // Agregar fila a la tabla
    function agregarFila(empresa, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${empresa.nombre}</td>
            <td>${empresa.direccion}</td>
            <td>${empresa.email}</td>
            <td>${empresa.telefono}</td>
            <td>${empresa.responsable}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

        // Botón modificar
        newRow.querySelector('.btn-modify').addEventListener('click', () => {
            abrirParaEditar(empresa, index);
        });

        // Botón eliminar
        newRow.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
                empresas.splice(index, 1);
                localStorage.setItem('empresas', JSON.stringify(empresas));
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Abrir modal para editar
    function abrirParaEditar(empresa, index) {
        modal.style.display = 'flex';
        document.getElementById('nombre').value = empresa.nombre;
        document.getElementById('direccion').value = empresa.direccion;
        document.getElementById('email').value = empresa.email;
        document.getElementById('telefono').value = empresa.telefono;
        populateResponsablesSelect(empresa.responsable);
        editingIndex = index;
    }

    // Actualizar fila
    function actualizarFila(empresa, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[0].textContent = empresa.nombre;
        row.cells[1].textContent = empresa.direccion;
        row.cells[2].textContent = empresa.email;
        row.cells[3].textContent = empresa.telefono;
        row.cells[4].textContent = empresa.responsable;
    }

    // Inicializar tabla
    empresas.forEach((empresa, index) => agregarFila(empresa, index));
    populateResponsablesSelect();
});
