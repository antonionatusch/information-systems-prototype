document.addEventListener('DOMContentLoaded', () => {
  const materialSelect = document.getElementById('material');
  const quantityInput = document.getElementById('quantity');
  const unitDisplay = document.getElementById('unit-display');
  const requesterField = document.getElementById('requester');
  const dateInput = document.getElementById('date');
  const requestsTable = document.getElementById('requests-table');
  const form = document.getElementById('request-form');

  // Recuperar datos del Local Storage
  const materials = JSON.parse(localStorage.getItem('materials')) || [];
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Configurar el campo del solicitante
  if (currentUser && currentUser.name) {
    requesterField.value = currentUser.name;
  } else {
    alert('No hay un usuario autenticado. Por favor, inicia sesión.');
    window.location.href = '../../html/login.html';
    return;
  }

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

  // Calcular cantidad total solicitada para un material
  const calculateRequestedQuantity = (materialCode) => {
    return requests
      .filter(
        (request) =>
          request.materialCode === materialCode &&
          request.status !== 'Denegado',
      )
      .reduce((sum, request) => sum + request.quantity, 0);
  };

  // Manejar selección de material
  materialSelect.addEventListener('change', () => {
    const selectedMaterial = materials.find(
      (m) => m.code === materialSelect.value,
    );
    if (selectedMaterial) {
      unitDisplay.textContent = selectedMaterial.unit;
    } else {
      unitDisplay.textContent = '';
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

    if (!selectedMaterial) {
      alert('Por favor, selecciona un material válido.');
      return;
    }

    const alreadyRequested = calculateRequestedQuantity(selectedMaterial.code);
    const availableQuantity = selectedMaterial.quantity - alreadyRequested;

    if (quantity > availableQuantity) {
      alert(
        `El material "${selectedMaterial.name}" ya no está disponible. Cantidad disponible: ${availableQuantity}`,
      );
      return;
    }

    const newRequest = {
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      quantity,
      unit: selectedMaterial.unit,
      requester: currentUser.name,
      date,
      status: 'Pendiente',
    };

    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    renderRequests();

    form.reset();
    unitDisplay.textContent = '';
  });

  // Añadir funcionalidad para modificar el estado
  requestsTable.addEventListener('click', (e) => {
    const rowIndex = e.target.dataset.index;

    if (e.target.classList.contains('approve')) {
      if (currentUser.role === 'Gerente Administrativo') {
        requests[rowIndex].status = 'Autorizado';
        localStorage.setItem('requests', JSON.stringify(requests));
        renderRequests();
      }
    } else if (e.target.classList.contains('deny')) {
      if (currentUser.role === 'Gerente Administrativo') {
        requests[rowIndex].status = 'Denegado';
        localStorage.setItem('requests', JSON.stringify(requests));
        renderRequests();
      }
    } else if (e.target.classList.contains('edit')) {
      const request = requests[rowIndex];
      materialSelect.value = request.materialCode;
      quantityInput.value = request.quantity;
      dateInput.value = request.date;

      requests.splice(rowIndex, 1);
      localStorage.setItem('requests', JSON.stringify(requests));
      renderRequests();
    } else if (e.target.classList.contains('delete')) {
      requests.splice(rowIndex, 1);
      localStorage.setItem('requests', JSON.stringify(requests));
      renderRequests();
    }
  });

  // Renderizar solicitudes
  const renderRequests = () => {
    requestsTable.innerHTML = '';
    requests.forEach((request, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
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

  // Inicializar datos
  populateMaterials();
  renderRequests();
});
