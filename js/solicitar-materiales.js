document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('request-form');
  const materialSelect = document.getElementById('material');
  const requestList = document.getElementById('request-list');

  // Load materials and types from Local Storage
  const materials = JSON.parse(localStorage.getItem('materials')) || [];
  const requests = JSON.parse(localStorage.getItem('requests')) || [];

  // Populate materials dropdown
  const populateMaterials = () => {
    materialSelect.innerHTML = '';
    materials.forEach((material) => {
      const option = document.createElement('option');
      option.value = material.code;
      option.textContent = `${material.name} (${material.type})`;
      materialSelect.appendChild(option);
    });
  };

  // Render requests
  const renderRequests = () => {
    requestList.innerHTML = '';
    requests.forEach((request) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${request.material}</td>
                <td>${request.quantity}</td>
                <td>${request.unit}</td>
                <td>${request.status}</td>
            `;
      requestList.appendChild(row);
    });
  };

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedMaterial =
      materialSelect.options[materialSelect.selectedIndex].textContent;
    const quantity = document.getElementById('quantity').value;
    const unit = document.getElementById('unit').value;

    // Add request to Local Storage
    const newRequest = {
      material: selectedMaterial,
      quantity,
      unit,
      status: 'Pendiente de Revisión',
    };
    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));

    renderRequests();
    form.reset();
  });

  // Initial load
  populateMaterials();
  renderRequests();
});
``;
