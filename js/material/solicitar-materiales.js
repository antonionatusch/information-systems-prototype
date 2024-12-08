document.addEventListener('DOMContentLoaded', () => {
  const materialSelect = document.getElementById('material');
  const quantityInput = document.getElementById('quantity');
  const unitDisplay = document.getElementById('unit-display');
  const requesterField = document.getElementById('requester');
  const dateInput = document.getElementById('date');
  const requestCodeField = document.getElementById('request-code');
  const requestsTable = document.getElementById('requests-table');
  const form = document.getElementById('request-form');

  // Recuperar datos del Local Storage
  const materials = JSON.parse(localStorage.getItem('materials')) || [];
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  let editingIndex = null; // Para rastrear la fila que se está editando

  // Configurar el campo del solicitante
  if (currentUser && currentUser.name) {
    requesterField.value = currentUser.name;
  } else {
    alert('No hay un usuario autenticado. Por favor, inicia sesión.');
    window.location.href = '../../html/login.html';
    return;
  }

  // Generar un código único para la solicitud
  const generateRequestCode = () => `REQ-${Date.now()}`;

  // Renderizar opciones de materiales
  const populateMaterials = () => {
    materialSelect.innerHTML =
      '<option value="">Seleccione un material</option>';
    materials.forEach((material) => {
      const option = document.createElement('option');
      option.value = material.code;
      option.textContent = material.name;
      materialSelect.appendChild(option);
    });
  };

  // Manejar selección de material
  materialSelect.addEventListener('change', () => {
    const selectedMaterial = materials.find(
      (m) => m.code === materialSelect.value,
    );
    if (selectedMaterial) {
      unitDisplay.textContent = selectedMaterial.unit;
      requestCodeField.value = generateRequestCode(); // Generar código al seleccionar material
    } else {
      unitDisplay.textContent = '';
      requestCodeField.value = ''; // Limpiar código si no hay material seleccionado
    }
  });

  // Manejar envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedMaterial = materials.find(
      (m) => m.code === materialSelect.value,
    );
    const quantity = parseInt(quantityInput.value, 10);
    const date = dateInput.value;
    const requestCode = requestCodeField.value;

    if (!selectedMaterial) {
      alert('Por favor, selecciona un material válido.');
      return;
    }

    const newRequest = {
      requestCode,
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      quantity,
      unit: selectedMaterial.unit,
      requester: currentUser.name,
      date,
      status: 'Pendiente',
    };

    if (editingIndex === null) {
      // Si no se está editando, agregar la nueva solicitud
      requests.push(newRequest);
      alert('Solicitud creada correctamente.');
    } else {
      // Si se está editando, actualizar la solicitud existente
      requests[editingIndex] = newRequest;
      alert('Solicitud modificada correctamente.');
      editingIndex = null; // Restablecer el índice de edición
    }

    // Guardar en Local Storage y actualizar la tabla
    localStorage.setItem('requests', JSON.stringify(requests));
    renderRequests();
    form.reset();
    unitDisplay.textContent = '';
    requestCodeField.value = '';
  });

  // Renderizar solicitudes
  const renderRequests = () => {
    requestsTable.innerHTML = '';
    requests.forEach((request, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.requestCode}</td>
        <td>${request.materialName}</td>
        <td>${request.quantity}</td>
        <td>${request.unit}</td>
        <td>${request.requester}</td>
        <td>${request.date || 'Sin Fecha'}</td>
        <td>${request.status}</td>
        <td>
          <button class="edit" data-index="${index}">Modificar</button>
          <button class="delete" data-index="${index}">Eliminar</button>
          ${
            currentUser.role === 'Gerente Administrativo'
              ? `
            <button class="approve" data-index="${index}">Autorizar</button>
            <button class="deny" data-index="${index}">Denegar</button>
          `
              : ''
          }
        </td>
      `;
      requestsTable.appendChild(row);
    });
  };

  // Manejar eventos de la tabla (modificar y eliminar)
  requestsTable.addEventListener('click', (e) => {
    const rowIndex = e.target.dataset.index;

    if (e.target.classList.contains('edit')) {
      // Llenar el formulario con los datos de la solicitud seleccionada
      const request = requests[rowIndex];
      materialSelect.value = request.materialCode;
      quantityInput.value = request.quantity;
      dateInput.value = request.date;
      requestCodeField.value = request.requestCode;

      editingIndex = rowIndex; // Guardar el índice de la solicitud que se está editando
    } else if (e.target.classList.contains('delete')) {
      // Confirmar eliminación y eliminar la solicitud
      if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
        requests.splice(rowIndex, 1);
        localStorage.setItem('requests', JSON.stringify(requests));
        renderRequests();
        alert('Solicitud eliminada correctamente.');
      }
    } else if (e.target.classList.contains('approve')) {
      // Autorizar solicitud
      requests[rowIndex].status = 'Autorizado';
      localStorage.setItem('requests', JSON.stringify(requests));
      renderRequests();
    } else if (e.target.classList.contains('deny')) {
      // Denegar solicitud
      requests[rowIndex].status = 'Denegado';
      localStorage.setItem('requests', JSON.stringify(requests));
      renderRequests();
    }
  });

  // Inicializar datos
  populateMaterials();
  renderRequests();
});
