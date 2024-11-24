document.addEventListener('DOMContentLoaded', () => {
  const typeTable = document.getElementById('type-table');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const form = document.getElementById('type-form');

  let types = [
    { code: 'T001', class: 'Papelería' },
    { code: 'T002', class: 'Herramientas' },
    { code: 'T003', class: 'Electrónica' },
  ];

  const renderTable = () => {
    typeTable.innerHTML = '';
    types.forEach((type, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${type.code}</td>
                <td>${type.class}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Modificar</button>
                    <button class="btn delete" data-index="${index}">Eliminar</button>
                </td>
            `;
      typeTable.appendChild(row);
    });
  };

  document.getElementById('create-new-type').addEventListener('click', () => {
    modal.style.display = 'block';
    form.reset();
    form.dataset.editing = false;
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value;
    const classType = document.getElementById('class').value;

    if (form.dataset.editing === 'true') {
      const index = form.dataset.index;
      types[index] = { code, class: classType };
    } else {
      types.push({ code, class: classType });
    }

    modal.style.display = 'none';
    renderTable();
  });

  typeTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit')) {
      const index = e.target.dataset.index;
      const type = types[index];

      document.getElementById('code').value = type.code;
      document.getElementById('class').value = type.class;

      form.dataset.editing = true;
      form.dataset.index = index;
      modal.style.display = 'block';
    }

    if (e.target.classList.contains('delete')) {
      const index = e.target.dataset.index;
      types.splice(index, 1);
      renderTable();
    }
  });

  renderTable();
});
