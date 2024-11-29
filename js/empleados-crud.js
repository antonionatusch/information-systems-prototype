document.addEventListener('DOMContentLoaded', () => {
  const employeeTable = document.getElementById('employee-table');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const form = document.getElementById('employee-form');
  const backToHomeButton = document.getElementById('back-to-home');

  // Recuperar empleados del Local Storage
  const employees = JSON.parse(localStorage.getItem('employees')) || [];

  const renderTable = () => {
    employeeTable.innerHTML = '';
    employees.forEach((employee, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.role}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Modificar</button>
                    <button class="btn delete" data-index="${index}">Eliminar</button>
                </td>
            `;
      employeeTable.appendChild(row);
    });
  };

  document.getElementById('create-new').addEventListener('click', () => {
    modal.style.display = 'block';
    form.reset();
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('employee-id').value || Date.now();
    const name = document.getElementById('employee-name').value;
    const role = document.getElementById('employee-role').value;

    const existingIndex = employees.findIndex((emp) => emp.id === id);

    if (existingIndex !== -1) {
      employees[existingIndex] = { id, name, role };
    } else {
      employees.push({ id, name, role });
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    renderTable();
    modal.style.display = 'none';
  });

  employeeTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit')) {
      const index = e.target.dataset.index;
      const employee = employees[index];
      document.getElementById('employee-id').value = employee.id;
      document.getElementById('employee-name').value = employee.name;
      document.getElementById('employee-role').value = employee.role;
      modal.style.display = 'block';
    }

    if (e.target.classList.contains('delete')) {
      const index = e.target.dataset.index;
      employees.splice(index, 1);
      localStorage.setItem('employees', JSON.stringify(employees));
      renderTable();
    }
  });

  // Funcionalidad del botón "Volver al Inicio"
  backToHomeButton.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  renderTable();
});
