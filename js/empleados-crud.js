document.addEventListener('DOMContentLoaded', () => {
  const employeeTable = document.getElementById('employee-table');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const form = document.getElementById('employee-form');
  const employees = JSON.parse(localStorage.getItem('employees')) || [];
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

  const departmentSelect = document.getElementById('department');
  const departamentos = JSON.parse(localStorage.getItem('departamentos')) || [];

  // Renderizar la tabla de empleados
  const renderTable = () => {
    employeeTable.innerHTML = '';
    employees.forEach((employee, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.role}</td>
                <td>${employee.departmentName || 'No asignado'}</td>
                <td>
                    <button class="btn edit" data-index="${index}">Modificar</button>
                    <button class="btn delete" data-index="${index}">Eliminar</button>
                </td>
            `;
      employeeTable.appendChild(row);
    });
  };

  // Mostrar el modal para crear un nuevo empleado
  document.getElementById('create-new').addEventListener('click', () => {
    modal.style.display = 'block';
    form.reset();
    form.dataset.editing = false;
  });
  document.getElementById('back-to-home').addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirige al archivo del index
  });

  // Cerrar el modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Manejar el envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id =
      form.dataset.editing === 'true'
        ? form.dataset.index
        : Date.now().toString();
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const departmentId = departmentSelect.value;
    const departmentName = departmentSelect.options[departmentSelect.selectedIndex].textContent;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (form.dataset.editing === 'true') {
      const index = form.dataset.index;
      employees[index] = { id, name, role, departmentId, departmentName, username, password };
      accounts[index] = { username, password, name, role, departmentName }; // Actualizar cuenta
    } else {
      employees.push({ id, name, role, departmentId, departmentName, username, password });
      accounts.push({ username, password, name, role, departmentName }); // Nueva cuenta
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('accounts', JSON.stringify(accounts));

    modal.style.display = 'none';
    renderTable();
  });

  // Manejar acciones de edición y eliminación
  employeeTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit')) {
      const index = e.target.dataset.index;
      const employee = employees[index];

      document.getElementById('name').value = employee.name;
      document.getElementById('role').value = employee.role;
      departmentSelect.value = employee.departmentId;
      document.getElementById('username').value = employee.username;
      document.getElementById('password').value = employee.password;

      form.dataset.editing = true;
      form.dataset.index = index;
      modal.style.display = 'block';
    }

    if (e.target.classList.contains('delete')) {
      const index = e.target.dataset.index;
      employees.splice(index, 1);
      accounts.splice(index, 1); // Eliminar también la cuenta
      localStorage.setItem('employees', JSON.stringify(employees));
      localStorage.setItem('accounts', JSON.stringify(accounts));
      renderTable();
    }
  });

  renderTable();

    // Cargar departamentos en el `select`
    const loadDepartments = () => {
      departmentSelect.innerHTML = '<option value="" disabled selected>Seleccione un departamento</option>';
      departamentos.forEach((departamento) => {
        const option = document.createElement('option');
        option.value = departamento.id;
        option.textContent = departamento.nombre;
        departmentSelect.appendChild(option);
      });
    };

    loadDepartments();
});
