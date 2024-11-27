document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('request-form');
  const materialSelect = document.getElementById('material');
  const quantityInput = document.getElementById('quantity');
  const unitDisplay = document.getElementById('unit-display');
  const requestsTable = document.getElementById('requests-table');

  // Recuperar datos del Local Storage
  const materials = JSON.parse(localStorage.getItem('materials')) || [];
  const requests = JSON.parse(localStorage.getItem('requests')) || [];

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

  // Renderizar solicitudes
  const renderRequests = () => {
    requestsTable.innerHTML = '';
    requests.forEach((request) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${request.materialName}</td>
                <td>${request.quantity}</td>
                <td>${request.unit}</td>
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
    const quantity = quantityInput.value;

    if (!selectedMaterial) {
      alert('Por favor, selecciona un material válido.');
      return;
    }

    const newRequest = {
      materialCode: selectedMaterial.code,
      materialName: selectedMaterial.name,
      quantity: quantity,
      unit: selectedMaterial.unit,
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
