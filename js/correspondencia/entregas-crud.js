document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('entrega-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const cancelButton = document.getElementById('cancel-button');
  const tableBody = document.getElementById('entregas-table');
  const codigoCorrespondenciaSelect = document.getElementById(
    'codigo-correspondencia',
  );
  const fechaCorrespondenciaInput = document.getElementById(
    'fecha-correspondencia',
  );
  const horaCorrespondenciaInput = document.getElementById(
    'hora-correspondencia',
  );
  const asuntoInput = document.getElementById('asunto');
  const remitenteInput = document.getElementById('remitente');
  const destinatarioInput = document.getElementById('destinatario');
  const depositanteInput = document.getElementById('depositante');
  const receptorInput = document.getElementById('receptor');
  const fechaEntregaInput = document.getElementById('fecha-entrega');
  const horaEntregaInput = document.getElementById('hora-entrega');

  let entregas = JSON.parse(localStorage.getItem('entregas')) || [];
  let correspondencias =
    JSON.parse(localStorage.getItem('correspondenciasRecibidas')) || [];
  let editingIndex = null;

  // Cargar correspondencias en el selector
  correspondencias.forEach((correspondencia) => {
    const option = document.createElement('option');
    option.value = correspondencia.codigo;
    option.textContent = `${correspondencia.codigo} - ${correspondencia.asunto}`;
    codigoCorrespondenciaSelect.appendChild(option);
  });

  // Actualizar campos de correspondencia al seleccionar una
  codigoCorrespondenciaSelect.addEventListener('change', () => {
    const selectedCorrespondencia = correspondencias.find(
      (c) => c.codigo === codigoCorrespondenciaSelect.value,
    );
    if (selectedCorrespondencia) {
      fechaCorrespondenciaInput.value = selectedCorrespondencia.fecha;
      horaCorrespondenciaInput.value = selectedCorrespondencia.hora;
      asuntoInput.value = selectedCorrespondencia.asunto;
      remitenteInput.value = selectedCorrespondencia.remitente;
      destinatarioInput.value = selectedCorrespondencia.destinatario;
    } else {
      fechaCorrespondenciaInput.value = '';
      horaCorrespondenciaInput.value = '';
      asuntoInput.value = '';
      remitenteInput.value = '';
      destinatarioInput.value = '';
    }
  });

  // Mostrar modal para registrar una nueva entrega
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => (modal.style.display = 'none'));
  cancelButton.addEventListener('click', () => (modal.style.display = 'none'));
  window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = 'none';
  });

  // Guardar o modificar entrega
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const codigoCorrespondencia = codigoCorrespondenciaSelect.value;
    const fechaCorrespondencia = fechaCorrespondenciaInput.value;
    const horaCorrespondencia = horaCorrespondenciaInput.value;
    const asunto = asuntoInput.value;
    const remitente = remitenteInput.value;
    const destinatario = destinatarioInput.value;
    const depositante = depositanteInput.value;
    const receptor = receptorInput.value;
    const fechaEntrega = fechaEntregaInput.value;
    const horaEntrega = horaEntregaInput.value;

    const nuevaEntrega = {
      codigoCorrespondencia,
      fechaCorrespondencia,
      horaCorrespondencia,
      asunto,
      remitente,
      destinatario,
      depositante,
      receptor,
      fechaEntrega,
      horaEntrega,
    };

    if (editingIndex === null) {
      entregas.push(nuevaEntrega);
      agregarFila(nuevaEntrega, entregas.length - 1);
      alert('Entrega registrada correctamente.');
    } else {
      entregas[editingIndex] = nuevaEntrega;
      actualizarFila(nuevaEntrega, editingIndex);
      alert('Entrega modificada correctamente.');
    }

    localStorage.setItem('entregas', JSON.stringify(entregas));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(entrega, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td>${entrega.codigoCorrespondencia}</td>
            <td>${entrega.fechaCorrespondencia}</td>
            <td>${entrega.horaCorrespondencia}</td>
            <td>${entrega.asunto}</td>
            <td>${entrega.remitente}</td>
            <td>${entrega.destinatario}</td>
            <td>${entrega.depositante}</td>
            <td>${entrega.receptor}</td>
            <td>${entrega.fechaEntrega}</td>
            <td>${entrega.horaEntrega}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;
    newRow
      .querySelector('.btn-modify')
      .addEventListener('click', () => abrirParaEditar(entrega, index));
    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Está seguro de eliminar esta entrega?')) {
        entregas.splice(index, 1);
        localStorage.setItem('entregas', JSON.stringify(entregas));
        newRow.remove();
      }
    });
    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar entrega
  function abrirParaEditar(entrega, index) {
    modal.style.display = 'flex';
    codigoCorrespondenciaSelect.value = entrega.codigoCorrespondencia;
    fechaCorrespondenciaInput.value = entrega.fechaCorrespondencia;
    horaCorrespondenciaInput.value = entrega.horaCorrespondencia;
    asuntoInput.value = entrega.asunto;
    remitenteInput.value = entrega.remitente;
    destinatarioInput.value = entrega.destinatario;
    depositanteInput.value = entrega.depositante;
    receptorInput.value = entrega.receptor;
    fechaEntregaInput.value = entrega.fechaEntrega;
    horaEntregaInput.value = entrega.horaEntrega;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(entrega, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = entrega.codigoCorrespondencia;
    row.cells[1].textContent = entrega.fechaCorrespondencia;
    row.cells[2].textContent = entrega.horaCorrespondencia;
    row.cells[3].textContent = entrega.asunto;
    row.cells[4].textContent = entrega.remitente;
    row.cells[5].textContent = entrega.destinatario;
    row.cells[6].textContent = entrega.depositante;
    row.cells[7].textContent = entrega.receptor;
    row.cells[8].textContent = entrega.fechaEntrega;
    row.cells[9].textContent = entrega.horaEntrega;
  }

  // Inicializar tabla con las entregas existentes
  entregas.forEach((entrega, index) => agregarFila(entrega, index));
});
