document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('proposal-type-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('proposal-type-table');

  let proposalTypes = JSON.parse(localStorage.getItem('proposalTypes')) || [];
  let editingIndex = null;

  // Mostrar modal para crear un nuevo tipo
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

  // Guardar o editar un tipo de propuesta
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;

    const nuevoTipoPropuesta = { codigo, nombre, descripcion };

    if (editingIndex === null) {
      // Verificar duplicados
      const existe = proposalTypes.some(
        (proposal) => proposal.codigo === codigo,
      );
      if (existe) {
        alert('El código del tipo de propuesta ya existe. Intente con otro.');
        return;
      }

      proposalTypes.push(nuevoTipoPropuesta);
      agregarFila(nuevoTipoPropuesta, proposalTypes.length - 1);
      alert('Tipo de propuesta creado correctamente.');
    } else {
      proposalTypes[editingIndex] = nuevoTipoPropuesta;
      actualizarFila(nuevoTipoPropuesta, editingIndex);
      alert('Tipo de propuesta modificado correctamente.');
    }

    localStorage.setItem('proposalTypes', JSON.stringify(proposalTypes));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(tipo, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${tipo.codigo}</td>
      <td>${tipo.nombre}</td>
      <td>${tipo.descripcion}</td>
      <td>
        <button class="btn btn-modify">Modificar</button>
        <button class="btn btn-delete">Eliminar</button>
      </td>
    `;

    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(tipo, index);
    });

    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (
        confirm('¿Estás seguro de que deseas eliminar este tipo de propuesta?')
      ) {
        proposalTypes.splice(index, 1);
        localStorage.setItem('proposalTypes', JSON.stringify(proposalTypes));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar un tipo de propuesta
  function abrirParaEditar(tipo, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = tipo.codigo;
    document.getElementById('nombre').value = tipo.nombre;
    document.getElementById('descripcion').value = tipo.descripcion;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(tipo, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = tipo.codigo;
    row.cells[1].textContent = tipo.nombre;
    row.cells[2].textContent = tipo.descripcion;
  }

  // Inicializar tabla
  proposalTypes.forEach((tipo, index) => agregarFila(tipo, index));
});
