document.addEventListener('DOMContentLoaded', () => {
  const materialTable = document.getElementById('material-table');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const form = document.getElementById('material-form');
  const typeSelect = document.getElementById('type');

  // Registros predefinidos de materiales
  let materials = [
    {
      name: 'Pestañas Separadoras',
      description: 'Separadores para documentos',
      quantity: 20,
      type: 'Papelería',
    },
    {
      name: 'Sobre doble oficio',
      description: 'Sobres tamaño oficio',
      quantity: 50,
      type: 'Papelería',
    },
    {
      name: 'Folder Amarillo',
      description: 'Carpetas de color amarillo',
      quantity: 30,
      type: 'Papelería',
    },
  ];

  // Tipos de material cargados desde gestionar-tipo-material
  let types = ['Papelería', 'Herramientas', 'Electrónica'];

  const renderTable = () => {
    materialTable.innerHTML = '';
    materials.forEach((material, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${material.name}</td>
                <td>${material.description}</td>
                <td>${material.quantity}</td>
                <td>${material.type}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Modificar</button>
                    <button class="btn delete" data-index="${index}">Eliminar</button>
                </td>
            `;
      materialTable.appendChild(row);
    });
  };

  const populateTypeSelect = () => {
    typeSelect.innerHTML = '';
    types.forEach((type) => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeSelect.appendChild(option);
    });
  };

  document.getElementById('create-new').addEventListener('click', () => {
    modal.style.display = 'block';
    form.reset();
    form.dataset.editing = false;
    populateTypeSelect();
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const type = document.getElementById('type').value;

    if (form.dataset.editing === 'true') {
      const index = form.dataset.index;
      materials[index] = { name, description, quantity, type };
    } else {
      materials.push({ name, description, quantity, type });
    }

    modal.style.display = 'none';
    renderTable();
  });

  materialTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit')) {
      const index = e.target.dataset.index;
      const material = materials[index];

      document.getElementById('name').value = material.name;
      document.getElementById('description').value = material.description;
      document.getElementById('quantity').value = material.quantity;
      document.getElementById('type').value = material.type;

      form.dataset.editing = true;
      form.dataset.index = index;
      modal.style.display = 'block';
      populateTypeSelect();
    }

    if (e.target.classList.contains('delete')) {
      const index = e.target.dataset.index;
      materials.splice(index, 1);
      renderTable();
    }
  });

  renderTable();
});
