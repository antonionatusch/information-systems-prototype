document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('despacho-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const btnHome = document.getElementById('back-to-home');
  const tableBody = document.getElementById('despacho-table');
  const codigoCorrespondenciaSelect = document.getElementById(
    'codigo-correspondencia',
  );
  const despachanteSelect = document.getElementById('despachante');
  const receptorSelect = document.getElementById('receptor');

  // Campos del formulario
  const fechaCorrespondenciaInput = document.getElementById(
    'fecha-correspondencia',
  );
  const horaCorrespondenciaInput = document.getElementById(
    'hora-correspondencia',
  );
  const asuntoInput = document.getElementById('asunto');
  const destinatarioInput = document.getElementById('destinatario');
  const fechaEntregaInput = document.getElementById('fecha-entrega');
  const horaEntregaInput = document.getElementById('hora-entrega');

  let despachos = JSON.parse(localStorage.getItem('despachos')) || [];
  let correspondencias =
    JSON.parse(localStorage.getItem('correspondenciasDespachadas')) || [];
  let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
  let editingIndex = null;

  // Renderizar selectores
  const populateSelect = (select, data, displayField) => {
    select.innerHTML = '<option value="">Seleccione</option>';
    data.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.nombre || item.codigo;
      option.textContent = item[displayField];
      select.appendChild(option);
    });
  };

  // Cargar selectores
  const populateSelectors = () => {
    populateSelect(codigoCorrespondenciaSelect, correspondencias, 'codigo');
    populateSelect(despachanteSelect, empleados, 'nombre');
    populateSelect(receptorSelect, empleados, 'nombre');
  };

  // Autorellenar campos al seleccionar correspondencia
  codigoCorrespondenciaSelect.addEventListener('change', function () {
    const selectedCorrespondencia = correspondencias.find(
      (correspondencia) => correspondencia.codigo === this.value,
    );

    if (selectedCorrespondencia) {
      fechaCorrespondenciaInput.value = selectedCorrespondencia.fecha;
      horaCorrespondenciaInput.value = selectedCorrespondencia.hora;
      asuntoInput.value = selectedCorrespondencia.asunto;
      destinatarioInput.value = selectedCorrespondencia.destinatario || '';
    }
  });

  // Renderizar tabla
  const renderTable = () => {
    tableBody.innerHTML = '';
    despachos.forEach((despacho, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${despacho.codigo || ''}</td>
        <td>${despacho.receptor || ''}</td>
        <td>${despacho.despachante || ''}</td>
        <td>${despacho.fechaEntrega || ''}</td>
        <td>${despacho.horaEntrega || ''}</td>
        <td>
          <button class="btn edit" data-index="${index}">Modificar</button>
          <button class="btn delete" data-index="${index}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  };

  // Guardar despacho
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newDespacho = {
      codigo: codigoCorrespondenciaSelect.value,
      fechaCorrespondencia: fechaCorrespondenciaInput.value,
      horaCorrespondencia: horaCorrespondenciaInput.value,
      asunto: asuntoInput.value,
      despachante: despachanteSelect.value,
      destinatario: destinatarioInput.value,
      receptor: receptorSelect.value,
      fechaEntrega: fechaEntregaInput.value,
      horaEntrega: horaEntregaInput.value,
    };

    if (editingIndex !== null) {
      despachos[editingIndex] = newDespacho;
      editingIndex = null;
    } else {
      despachos.push(newDespacho);
    }

    localStorage.setItem('despachos', JSON.stringify(despachos));
    renderTable();
    modal.style.display = 'none';
    form.reset();
  });

  // Inicializar tabla y selectores
  renderTable();
  populateSelectors();

  // Manejo del modal
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'block';
    form.reset();
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  tableBody.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit')) {
      const index = e.target.dataset.index;
      const despacho = despachos[index];

      codigoCorrespondenciaSelect.value = despacho.codigo;
      fechaCorrespondenciaInput.value = despacho.fechaCorrespondencia;
      horaCorrespondenciaInput.value = despacho.horaCorrespondencia;
      asuntoInput.value = despacho.asunto;
      despachanteSelect.value = despacho.despachante;
      destinatarioInput.value = despacho.destinatario;
      receptorSelect.value = despacho.receptor;
      fechaEntregaInput.value = despacho.fechaEntrega;
      horaEntregaInput.value = despacho.horaEntrega;

      editingIndex = index;
      modal.style.display = 'block';
    }

    if (e.target.classList.contains('delete')) {
      const index = e.target.dataset.index;
      despachos.splice(index, 1);
      localStorage.setItem('despachos', JSON.stringify(despachos));
      renderTable();
    }
  });
});
