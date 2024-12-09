document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('asunto-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('asunto-table');

  let asuntos = JSON.parse(localStorage.getItem('asuntos')) || [];
  let editingIndex = null;

  // Mostrar modal para crear nuevo asunto
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Guardar o editar asunto
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;

    const nuevoAsunto = { codigo, titulo, descripcion };

    if (editingIndex === null) {
      // Verificar si el código ya existe
      if (asuntos.some((asunto) => asunto.codigo === codigo)) {
        alert('El código del asunto ya existe. Intente con otro.');
        return;
      }

      asuntos.push(nuevoAsunto);
      agregarFila(nuevoAsunto, asuntos.length - 1);
      alert('Asunto creado correctamente.');
    } else {
      // Actualizar el asunto existente
      asuntos[editingIndex] = nuevoAsunto;
      actualizarFila(nuevoAsunto, editingIndex);
      alert('Asunto modificado correctamente.');
    }

    // Guardar en Local Storage
    localStorage.setItem('asuntos', JSON.stringify(asuntos));

    // Limpiar y cerrar formulario
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(asunto, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td>${asunto.codigo}</td>
            <td>${asunto.titulo}</td>
            <td>${asunto.descripcion}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

    // Botón Modificar
    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(asunto, index);
    });

    // Botón Eliminar
    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar este asunto?')) {
        asuntos.splice(index, 1);
        localStorage.setItem('asuntos', JSON.stringify(asuntos));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar
  function abrirParaEditar(asunto, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = asunto.codigo;
    document.getElementById('titulo').value = asunto.titulo;
    document.getElementById('descripcion').value = asunto.descripcion;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(asunto, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = asunto.codigo;
    row.cells[1].textContent = asunto.titulo;
    row.cells[2].textContent = asunto.descripcion;
  }

  // Inicializar tabla con asuntos existentes
  asuntos.forEach((asunto, index) => agregarFila(asunto, index));
});
