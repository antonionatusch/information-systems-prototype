document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-employee');
  const modal = document.getElementById('form-modal');
  const closeModal = document.getElementById('close-modal');
  const tableBody = document.querySelector('#table-requests tbody');
  const btnCreate = document.getElementById('btn-create');

  let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
  let editingIndex = null; // Índice para rastrear si se está editando una fila

  const positionSelect = document.getElementById('position');
  const positions = JSON.parse(localStorage.getItem('cargos')) || [];

  const unitSelect = document.getElementById('unit');
  const units = JSON.parse(localStorage.getItem('departamentos')) || [];

  // Mostrar modal al hacer clic en "Crear"
  btnCreate.addEventListener('click', () => {
      modal.style.display = 'flex';
      form.reset();
      editingIndex = null; // Restablecer el índice de edición
  });

  // Cerrar modal al hacer clic en la "X"
  closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Guardar o actualizar solicitud al enviar el formulario
  form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Captura los valores del formulario
      const carnet = document.getElementById('carnet').value;
      const nombre = document.getElementById('name').value;
      const cargo = positionSelect.options[positionSelect.selectedIndex]?.textContent;
      const unidad = unitSelect.options[unitSelect.selectedIndex]?.textContent;
      const fechaNacimiento = document.getElementById('birth-date').value;
      const fechaIngreso = document.getElementById('entry-date').value;
      const usuario = document.getElementById('user').value;
      const contraseña = document.getElementById('password').value;

      const nuevoEmpleado = {
          carnet,
          nombre,
          cargo,
          unidad, 
          fechaNacimiento, 
          fechaIngreso, 
          usuario, 
          contraseña, 
      };

      if (editingIndex === null) {
          // Si no se está editando, agregar una nueva solicitud
          empleados.push(nuevoEmpleado);
          agregarFila(nuevoEmpleado, empleados.length - 1);
          alert('Solicitud creada correctamente.');
      } else {
          // Si se está editando, actualizar los datos
          empleados[editingIndex] = nuevoEmpleado;
          actualizarFila(nuevoEmpleado, editingIndex);
          alert('Modificado Correctamente.');
      }

      // Guardar en localStorage
      localStorage.setItem('empleados', JSON.stringify(empleados));

      // Limpiar formulario y cerrar modal
      form.reset();
      modal.style.display = 'none';
  });

  // Cargar filas existentes al inicio
  empleados.forEach((empleado, index) => agregarFila(empleado, index));

  // Función para agregar una fila a la tabla
  function agregarFila(empleado, index) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <td>${empleado.carnet}</td>
          <td>${empleado.nombre}</td>
          <td>${empleado.cargo}</td>
          <td>${empleado.unidad}</td>
          <td>${empleado.fechaNacimiento}</td>
          <td>${empleado.fechaIngreso}</td>
          <td>${empleado.usuario}</td>
          <td>${empleado.contraseña}</td>
          <td>
              <button class="button btn-modify">Modificar</button>
              <button class="button btn-delete">Eliminar</button>
          </td>
      `;

      // Botón "Modificar"
      newRow.querySelector('.btn-modify').addEventListener('click', function () {
          abrirParaEditar(solicitud, index);
      });

      // Botón "Eliminar"
      newRow.querySelector('.btn-delete').addEventListener('click', function () {
          if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
              eliminarFila(index);
              newRow.remove();
          }
      });

      tableBody.appendChild(newRow);
  }

  // Función para abrir el modal y rellenar el formulario para edición
  function abrirParaEditar(empleado, index) {
      modal.style.display = 'flex';
      document.getElementById('name').value = empleado.carnet;
      document.getElementById('boss').value = empleado.nombre;
      positionSelect.value = empleado.cargo;
      unitSelect.value = empleado.unidad;
      document.getElementById('birth-date').value = empleado.fechaNacimiento;
      document.getElementById('entry-time').value = empleado.fechaIngreso;
      document.getElementById('user').value = empleado.usuario;
      document.getElementById('password').value = empleado.contraseña;
      editingIndex = index; // Guardar el índice de la fila que se está editando
  }

  // Función para actualizar una fila en la tabla
  function actualizarFila(empleado, index) {
      const rows = tableBody.getElementsByTagName('tr');
      const row = rows[index];
      row.cells[1].textContent = empleado.nombre;
      row.cells[2].textContent = empleado.jefe;
      row.cells[3].textContent = empleado.fechaInicio;
      row.cells[4].textContent = empleado.fechaFin;
      row.cells[5].textContent = empleado.horaInicio;
      row.cells[6].textContent = empleado.horaFin;
      row.cells[7].textContent = empleado.motivo;
      row.cells[8].textContent = empleado.estado;
  }

  // Función para eliminar una empleado del localStorage
  function eliminarFila(index) {
      empleados.splice(index, 1);
      localStorage.setItem('empleados', JSON.stringify(empleados));
  }

  // Cargar opciones en el select de cargos
  const loadPositions = () => {
    positionSelect.innerHTML = '<option value="" disabled selected></option>';
    positions.forEach((employee) => {
      const option = document.createElement('option');
      option.value = employee.id;
      option.textContent = employee.nombre;
      positionSelect.appendChild(option);
    });
  };

    // Cargar opciones en el select de unidades
    const loadUnits = () => {
      unitSelect.innerHTML = '<option value="" disabled selected></option>';
      units.forEach((employee) => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.nombre;
        unitSelect.appendChild(option);
      });
    };

  loadPositions();
  loadUnits();
});
