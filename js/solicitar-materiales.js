document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('request-form');
  const materialSelect = document.getElementById('material');
  const quantityInput = document.getElementById('quantity');
  const unitDisplay = document.getElementById('unit-display');
  const requestsTable = document.getElementById('requests-table');
  const requesterField = document.getElementById('requester'); // Campo para el solicitante

  // Recuperar datos del Local Storage
  const materials = JSON.parse(localStorage.getItem('materials')) || [];
  const requests = JSON.parse(localStorage.getItem('requests')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Usuario actual

  // Configurar el campo del solicitante
  if (currentUser && currentUser.name) {
    requesterField.value = currentUser.name; // Autocompletar el solicitante
  } else {
    alert('No hay un usuario autenticado. Por favor, inicia sesión.');
    window.location.href = '../html/login.html'; // Redirigir al login si no hay usuario
    return;
  }

  // Renderizar opciones de materiales
  const populateMaterials = () => {
    materialSelect.innerHTML = '';
    materials.forEach((material) => {
      const option = document.createElement('option');
      option.value = material.code;
      option.textContent = material.name;
      materialSelect.appendChild(option);
    });
  };

  // Mostrar unidad de medida al seleccionar un material
  materialSelect.addEventListener('change', (e) => {
    const selectedMaterial = materials.find((m) => m.code === e.target.value);
    if (selectedMaterial) {
      unitDisplay.textContent = selectedMaterial.unit;
    }
  });

  // Calcular la cantidad ya solicitada de un material
  const calculateRequestedQuantity = (materialCode) => {
    return requests
      .filter((request) => request.materialCode === materialCode)
      .reduce((total, request) => total + parseInt(request.quantity, 10), 0);
  };

  // Renderizar solicitudes
  const renderRequests = () => {
    requestsTable.innerHTML = '';
    requests.forEach((request) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${request.materialName}</td>
                <td>${request.quantity}</td>
                <td>${request.unit}</td>
                <td>${request.requester}</td> <!-- Agregado el solicitante -->
                <td>${request.status}</td>
            `;
      requestsTable.appendChild(row);
    });
  };

  // Manejar envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedMaterial = materials.find(
      (m) => m.code === materialSelect.value,
    );
    const quantity = parseInt(quantityInput.value, 10);

    if (!selectedMaterial) {
      alert('Por favor, selecciona un material válido.');
      return;
    }

    const alreadyRequested = calculateRequestedQuantity(selectedMaterial.code);
    const availableQuantity = selectedMaterial.quantity - alreadyRequested;

    if (quantity > availableQuantity) {
      alert(
        `El material "${selectedMaterial.name}" ya no está disponible para su solicitud. Cantidad disponible: ${availableQuantity}`,
      );
      return;
    }

    const newRequest = {
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      quantity: quantity,
      unit: selectedMaterial.unit,
      requester: currentUser.name, // Asociar al solicitante actual
      status: 'Pendiente',
    };

    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    renderRequests();

    // Resetear formulario
    form.reset();
    unitDisplay.textContent = '';
  });

  // Inicializar
  populateMaterials();
  renderRequests();
});
