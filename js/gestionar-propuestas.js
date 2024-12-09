document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('propuesta-form');
    const modal = document.getElementById('form-modal');
    const closeModal = document.querySelector('.close');
    const btnCreate = document.getElementById('create-new');
    const tableBody = document.getElementById('propuestas-table');

    let propuestas = JSON.parse(localStorage.getItem('propuestas')) || [];
    let editingIndex = null;

    btnCreate.addEventListener('click', () => {
        modal.style.display = 'flex';
        form.reset();
        editingIndex = null;
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const propuesta = {
            codigo: document.getElementById('codigo').value,
            fechaSalida: document.getElementById('fecha-salida').value,
            horaSalida: document.getElementById('hora-salida').value,
            destinatario: document.getElementById('destinatario').value,
            asunto: document.getElementById('asunto').value,
            despachante: document.getElementById('despachante').value,
            tipo: document.getElementById('tipo').value,
            monto: parseFloat(document.getElementById('monto').value),
            fechaInicio: document.getElementById('fecha-inicio').value,
            fechaFin: document.getElementById('fecha-fin').value,
            responsable: document.getElementById('responsable').value,
            tipoContrato: document.getElementById('tipo-contrato').value
        };

        if (editingIndex === null) {
            propuestas.push(propuesta);
            agregarFila(propuesta, propuestas.length - 1);
            alert('Propuesta registrada correctamente.');
        } else {
            propuestas[editingIndex] = propuesta;
            actualizarFila(propuesta, editingIndex);
            alert('Propuesta modificada correctamente.');
        }

        localStorage.setItem('propuestas', JSON.stringify(propuestas));
        form.reset();
        modal.style.display = 'none';
    });

    propuestas.forEach((propuesta, index) => agregarFila(propuesta, index));

    function agregarFila(propuesta, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${propuesta.codigo}</td>
            <td>${propuesta.fechaSalida}</td>
            <td>${propuesta.horaSalida}</td>
            <td>${propuesta.destinatario}</td>
            <td>${propuesta.asunto}</td>
            <td>${propuesta.despachante}</td>
            <td>${propuesta.tipo}</td>
            <td>${propuesta.monto}</td>
            <td>${propuesta.fechaInicio}</td>
            <td>${propuesta.fechaFin}</td>
            <td>${propuesta.responsable}</td>
            <td>${propuesta.tipoContrato}</td>
            <td>
                <button class="btn-modify">Modificar</button>
                <button class="btn-delete">Eliminar</button>
            </td>
        `;

        newRow.querySelector('.btn-modify').addEventListener('click', function () {
            abrirParaEditar(propuesta, index);
        });

        newRow.querySelector('.btn-delete').addEventListener('click', function () {
            if (confirm('¿Estás seguro de que deseas eliminar esta propuesta?')) {
                eliminarFila(index);
                newRow.remove();
            }
        });

        tableBody.appendChild(newRow);
    }

    function abrirParaEditar(propuesta, index) {
        modal.style.display = 'flex';
        for (const key in propuesta) {
            document.getElementById(key).value = propuesta[key];
        }
        editingIndex = index;
    }

    function actualizarFila(propuesta, index) {
        const rows = tableBody.getElementsByTagName('tr');
        const row = rows[index];
        Object.keys(propuesta).forEach((key, i) => {
            row.cells[i].textContent = propuesta[key];
        });
    }

    function eliminarFila(index) {
        propuestas.splice(index, 1);
        localStorage.setItem('propuestas', JSON.stringify(propuestas));
    }
});
