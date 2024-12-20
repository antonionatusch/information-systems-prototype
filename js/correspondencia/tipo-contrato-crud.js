document.addEventListener('DOMContentLoaded', function () {
  const formModal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const createNewButton = document.getElementById('create-new');
  const cancelButton = document.getElementById('cancel-button');
  const form = document.getElementById('contract-type-form');
  const tableBody = document.getElementById('contract-type-table');

  let contractTypes = JSON.parse(localStorage.getItem('contractTypes')) || [
    {
      codigo: 'CON-001',
      nombre: 'Contrato de Auditoría Financiera',
      descripcion:
        'Realización de auditorías financieras según normativas internacionales.',
    },
    {
      codigo: 'CON-002',
      nombre: 'Contrato de Consultoría',
      descripcion: 'Servicios de consultoría para optimización financiera.',
    },
    {
      codigo: 'CON-003',
      nombre: 'Contrato de Outsourcing',
      descripcion: 'Gestión externa de procesos administrativos y contables.',
    },
  ];

  let editingIndex = null;

  // Función para mostrar la lista en la tabla
  function renderTable() {
    tableBody.innerHTML = '';
    contractTypes.forEach((type, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${type.codigo}</td>
        <td>${type.nombre}</td>
        <td>${type.descripcion}</td>
        <td>
          <button class="btn btn-edit" data-index="${index}">Editar</button>
          <button class="btn btn-delete" data-index="${index}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Botones de editar
    document.querySelectorAll('.btn-edit').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        openModal(contractTypes[index], index);
      }),
    );

    // Botones de eliminar
    document.querySelectorAll('.btn-delete').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (confirm('¿Estás seguro de eliminar este tipo de contrato?')) {
          contractTypes.splice(index, 1);
          localStorage.setItem('contractTypes', JSON.stringify(contractTypes));
          renderTable();
        }
      }),
    );
  }

  // Función para abrir el modal
  function openModal(type = {}, index = null) {
    editingIndex = index;
    form.codigo.value = type.codigo || '';
    form.nombre.value = type.nombre || '';
    form.descripcion.value = type.descripcion || '';
    formModal.style.display = 'block';
  }

  // Función para cerrar el modal
  function closeModalHandler() {
    formModal.style.display = 'none';
    form.reset();
    editingIndex = null;
  }

  // Guardar o actualizar tipo de contrato
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const codigo = form.codigo.value.trim();
    const nombre = form.nombre.value.trim();
    const descripcion = form.descripcion.value.trim();

    if (editingIndex !== null) {
      // Actualizar
      contractTypes[editingIndex] = { codigo, nombre, descripcion };
      alert('Tipo de contrato actualizado correctamente.');
    } else {
      // Crear nuevo
      if (contractTypes.some((type) => type.codigo === codigo)) {
        alert('El código ya existe. Usa un código único.');
        return;
      }
      contractTypes.push({ codigo, nombre, descripcion });
      alert('Tipo de contrato creado correctamente.');
    }

    localStorage.setItem('contractTypes', JSON.stringify(contractTypes));
    closeModalHandler();
    renderTable();
  });

  // Eventos para botones
  createNewButton.addEventListener('click', () => openModal());
  closeModal.addEventListener('click', closeModalHandler);
  cancelButton.addEventListener('click', closeModalHandler);

  // Inicializar la tabla
  renderTable();
});
