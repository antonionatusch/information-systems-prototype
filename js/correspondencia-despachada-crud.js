document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('despachada-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('despachada-table');

  let correspondencias =
    JSON.parse(localStorage.getItem('correspondenciasDespachadas')) || [];
  let editingIndex = null;

  // Mostrar modal para crear correspondencia
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
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

  // Guardar o editar correspondencia
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const asunto = document.getElementById('asunto').value;
    const despachante = document.getElementById('despachante').value;
    const destinatario = document.getElementById('destinatario').value;

    const nuevaCorrespondencia = {
      codigo,
      fecha,
      hora,
      asunto,
      despachante,
      destinatario,
    };

    if (editingIndex === null) {
      correspondencias.push(nuevaCorrespondencia);
      agregarFila(nuevaCorrespondencia, correspondencias.length - 1);
      alert('Correspondencia registrada correctamente.');
    } else {
      correspondencias[editingIndex] = nuevaCorrespondencia;
      actualizarFila(nuevaCorrespondencia, editingIndex);
      alert('Correspondencia actualizada correctamente.');
    }

    localStorage.setItem(
      'correspondenciasDespachadas',
      JSON.stringify(correspondencias),
    );
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(correspondencia, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${correspondencia.codigo}</td>
      <td>${correspondencia.fecha}</td>
      <td>${correspondencia.hora}</td>
      <td>${correspondencia.asunto}</td>
      <td>${correspondencia.despachante}</td>
      <td>${correspondencia.destinatario}</td>
      <td>
        <button class="btn btn-modify">Modificar</button>
        <button class="btn btn-delete">Eliminar</button>
      </td>
    `;

    // Modificar correspondencia
    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(correspondencia, index);
    });

    // Eliminar correspondencia
    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar esta correspondencia?')) {
        correspondencias.splice(index, 1);
        localStorage.setItem(
          'correspondenciasDespachadas',
          JSON.stringify(correspondencias),
        );
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para edición
  function abrirParaEditar(correspondencia, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = correspondencia.codigo;
    document.getElementById('fecha').value = correspondencia.fecha;
    document.getElementById('hora').value = correspondencia.hora;
    document.getElementById('asunto').value = correspondencia.asunto;
    document.getElementById('despachante').value = correspondencia.despachante;
    document.getElementById('destinatario').value =
      correspondencia.destinatario;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(correspondencia, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = correspondencia.codigo;
    row.cells[1].textContent = correspondencia.fecha;
    row.cells[2].textContent = correspondencia.hora;
    row.cells[3].textContent = correspondencia.asunto;
    row.cells[4].textContent = correspondencia.despachante;
    row.cells[5].textContent = correspondencia.destinatario;
  }

  // Inicializar tabla con datos existentes
  correspondencias.forEach((correspondencia, index) =>
    agregarFila(correspondencia, index),
  );
});
