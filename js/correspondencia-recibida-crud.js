document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('form-modal');
    const form = document.getElementById('correspondencia-form');
    const closeModal = document.getElementById('close-modal');
    const btnCreate = document.getElementById('create-new');
    const tableBody = document.getElementById('correspondencia-table');

    let correspondenciasRecibidas = JSON.parse(localStorage.getItem('correspondenciasRecibidas')) || [];
    let editingIndex = null;

    // Mostrar modal al hacer clic en "Registrar Correspondencia"
    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        editingIndex = null;
    });

    // Cerrar modal al hacer clic en "X"
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar o actualizar correspondencia al enviar el formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const codigo = document.getElementById('codigo').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const asunto = document.getElementById('asunto').value;
        const remitente = document.getElementById('remitente').value;

        const nuevaCorrespondencia = { codigo, fecha, hora, asunto, remitente };

        if (editingIndex === null) {
            correspondenciasRecibidas.push(nuevaCorrespondencia);
            agregarFila(nuevaCorrespondencia, correspondenciasRecibidas.length - 1);
            alert('Correspondencia registrada correctamente.');
        } else {
            correspondenciasRecibidas[editingIndex] = nuevaCorrespondencia;
            actualizarFila(nuevaCorrespondencia, editingIndex);
            alert('Correspondencia actualizada correctamente.');
        }

        localStorage.setItem('correspondenciasRecibidas', JSON.stringify(correspondenciasRecibidas));
        form.reset();
        modal.style.display = 'none';
    });

    // Cargar filas existentes al inicio
    correspondenciasRecibidas.forEach((correspondencia, index) => agregarFila(correspondencia, index));

    // Función para agregar una fila a la tabla
    function agregarFila(correspondencia, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${correspondencia.codigo}</td>
            <td>${correspondencia.fecha}</td>
            <td>${correspondencia.hora}</td>
            <td>${correspondencia.asunto}</td>
            <td>${correspondencia.remitente}</td>
            <td>
                <button class="button btn-modify">Modificar</button>
                <button class="button btn-delete">Eliminar</button>
            </td>
        `;

        // Botón "Modificar"
        newRow.querySelector('.btn-modify').addEventListener('click', () => {
            abrirParaEditar(correspondencia, index);
        });

        // Botón "Eliminar"
        newRow.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar esta correspondencia?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    // Función para abrir el modal y rellenar el formulario para edición
    function abrirParaEditar(correspondencia, index) {
        modal.style.display = 'flex';
        document.getElementById('codigo').value = correspondencia.codigo;
        document.getElementById('fecha').value = correspondencia.fecha;
        document.getElementById('hora').value = correspondencia.hora;
        document.getElementById('asunto').value = correspondencia.asunto;
        document.getElementById('remitente').value = correspondencia.remitente;
        editingIndex = index;
    }

    // Función para actualizar una fila en la tabla
    function actualizarFila(correspondencia, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        row.cells[0].textContent = correspondencia.codigo;
        row.cells[1].textContent = correspondencia.fecha;
        row.cells[2].textContent = correspondencia.hora;
        row.cells[3].textContent = correspondencia.asunto;
        row.cells[4].textContent = correspondencia.remitente;
    }

    // Función para eliminar una fila del localStorage
    function eliminarFila(index) {
        correspondenciasRecibidas.splice(index, 1);
        localStorage.setItem('correspondenciasRecibidas', JSON.stringify(correspondenciasRecibidas));
    }
});
