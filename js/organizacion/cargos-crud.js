document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('cargo-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('cargo-table');

  let cargos = JSON.parse(localStorage.getItem('cargos')) || [];
  let editingIndex = null;

  // Mostrar modal para crear cargo
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Guardar o editar cargo
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;

    const nuevoCargo = { codigo, nombre, descripcion };

    if (editingIndex === null) {
      // Validar que el código no exista
      const codigoExistente = cargos.some((cargo) => cargo.codigo === codigo);
      if (codigoExistente) {
        alert('El código del cargo ya existe en el sistema.');
        return;
      }
      cargos.push(nuevoCargo);
      agregarFila(nuevoCargo, cargos.length - 1);
      alert('Cargo creado correctamente.');
    } else {
      cargos[editingIndex] = nuevoCargo;
      actualizarFila(nuevoCargo, editingIndex);
      alert('Cargo modificado correctamente.');
    }

    localStorage.setItem('cargos', JSON.stringify(cargos));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(cargo, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${cargo.codigo}</td>
      <td>${cargo.nombre}</td>
      <td>${cargo.descripcion}</td>
      <td>
        <button class="btn btn-modify">Modificar</button>
        <button class="btn btn-delete">Eliminar</button>
      </td>
    `;

    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(cargo, index);
    });

    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar este cargo?')) {
        cargos.splice(index, 1);
        localStorage.setItem('cargos', JSON.stringify(cargos));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar un cargo
  function abrirParaEditar(cargo, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = cargo.codigo;
    document.getElementById('nombre').value = cargo.nombre;
    document.getElementById('descripcion').value = cargo.descripcion;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(cargo, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = cargo.codigo;
    row.cells[1].textContent = cargo.nombre;
    row.cells[2].textContent = cargo.descripcion;
  }

  // Inicializar tabla con cargos existentes
  cargos.forEach((cargo, index) => agregarFila(cargo, index));
});
