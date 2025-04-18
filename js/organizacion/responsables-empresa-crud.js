document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('responsable-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('responsable-table');
  const unidadSelect = document.getElementById('unidad');
  const cargoSelect = document.getElementById('cargo');

  let responsables = JSON.parse(localStorage.getItem('responsables')) || [];
  let unidades = JSON.parse(localStorage.getItem('departamentos')) || [];
  let cargos = JSON.parse(localStorage.getItem('cargos')) || [];
  let editingIndex = null;

  // Cargar opciones en los selectores
  function cargarOpciones() {
    unidades.forEach((unidad) => {
      const option = document.createElement('option');
      option.value = unidad.id;
      option.textContent = unidad.nombre;
      unidadSelect.appendChild(option);
    });

    cargos.forEach((cargo) => {
      const option = document.createElement('option');
      option.value = cargo.codigo;
      option.textContent = cargo.nombre;
      cargoSelect.appendChild(option);
    });
  }

  cargarOpciones();

  // Mostrar modal para crear responsable
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

  // Guardar o editar responsable
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const unidadId = unidadSelect.value;
    const cargoId = cargoSelect.value;
    const telefono = document.getElementById('telefono').value;

    const unidadSeleccionada = unidades.find((u) => u.id === unidadId);
    const cargoSeleccionado = cargos.find((c) => c.codigo === cargoId);

    const nuevoResponsable = {
      nombre,
      unidad: unidadSeleccionada ? unidadSeleccionada.nombre : 'No asignada',
      cargo: cargoSeleccionado ? cargoSeleccionado.nombre : 'No asignado',
      telefono,
    };

    if (editingIndex === null) {
      responsables.push(nuevoResponsable);
      agregarFila(nuevoResponsable, responsables.length - 1);
      alert('Responsable creado correctamente.');
    } else {
      responsables[editingIndex] = nuevoResponsable;
      actualizarFila(nuevoResponsable, editingIndex);
      alert('Responsable modificado correctamente.');
    }

    localStorage.setItem('responsables', JSON.stringify(responsables));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(responsable, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td>${responsable.nombre}</td>
            <td>${responsable.unidad}</td>
            <td>${responsable.cargo}</td>
            <td>${responsable.telefono}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

    // Botón modificar
    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(responsable, index);
    });

    // Botón eliminar
    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas eliminar este responsable?')) {
        responsables.splice(index, 1);
        localStorage.setItem('responsables', JSON.stringify(responsables));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar
  function abrirParaEditar(responsable, index) {
    modal.style.display = 'flex';
    document.getElementById('nombre').value = responsable.nombre;
    unidadSelect.value =
      unidades.find((u) => u.nombre === responsable.unidad)?.id || '';
    cargoSelect.value =
      cargos.find((c) => c.nombre === responsable.cargo)?.codigo || '';
    document.getElementById('telefono').value = responsable.telefono;
    editingIndex = index;
  }

  // Actualizar fila
  function actualizarFila(responsable, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = responsable.nombre;
    row.cells[1].textContent = responsable.unidad;
    row.cells[2].textContent = responsable.cargo;
    row.cells[3].textContent = responsable.telefono;
  }

  // Inicializar tabla
  responsables.forEach((responsable, index) => agregarFila(responsable, index));
});
