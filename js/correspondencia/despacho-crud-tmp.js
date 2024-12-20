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

  // Campos del formulario
  const fechaCorrespondenciaInput = document.getElementById(
    'fecha-correspondencia',
  );
  const horaCorrespondenciaInput = document.getElementById(
    'hora-correspondencia',
  );
  const asuntoInput = document.getElementById('asunto');
  const despachanteInput = document.getElementById('despachante');
  const destinatarioInput = document.getElementById('destinatario');
  const depositanteInput = document.getElementById('depositante');
  const receptorInput = document.getElementById('receptor');
  const fechaEntregaInput = document.getElementById('fecha-entrega');
  const horaEntregaInput = document.getElementById('hora-entrega');

  let despachos = JSON.parse(localStorage.getItem('despachos')) || [];
  let correspondencias =
    JSON.parse(localStorage.getItem('correspondenciasDespachadas')) || [];
  let editingIndex = null;

  // Renderizar correspondencias en el selector
  const populateCorrespondenciaSelect = () => {
    codigoCorrespondenciaSelect.innerHTML =
      '<option value="">Seleccione</option>';
    correspondencias.forEach((correspondencia) => {
      const option = document.createElement('option');
      option.value = correspondencia.codigo;
      option.textContent = `${correspondencia.codigo} - ${correspondencia.asunto}`;
      codigoCorrespondenciaSelect.appendChild(option);
    });
  };

  // Autorellenar campos al seleccionar una correspondencia
  codigoCorrespondenciaSelect.addEventListener('change', function () {
    const selectedCorrespondencia = correspondencias.find(
      (correspondencia) => correspondencia.codigo === this.value,
    );

    if (selectedCorrespondencia) {
      fechaCorrespondenciaInput.value = selectedCorrespondencia.fecha;
      horaCorrespondenciaInput.value = selectedCorrespondencia.hora;
      asuntoInput.value = selectedCorrespondencia.asunto;
      despachanteInput.value = selectedCorrespondencia.despachante || '';
      destinatarioInput.value = selectedCorrespondencia.destinatario || '';
    } else {
      // Limpia los campos si no hay selección
      fechaCorrespondenciaInput.value = '';
      horaCorrespondenciaInput.value = '';
      asuntoInput.value = '';
      despachanteInput.value = '';
      destinatarioInput.value = '';
    }
  });

  // Mostrar modal para crear despacho
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
  });

  btnHome.addEventListener('click', () => {
    window.location.href = '../../index.html';
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Manejar el envío del formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const despacho = {
      codigo: codigoCorrespondenciaSelect.value,
      fechaCorrespondencia: fechaCorrespondenciaInput.value,
      horaCorrespondencia: horaCorrespondenciaInput.value,
      asunto: asuntoInput.value,
      despachante: despachanteInput.value,
      destinatario: destinatarioInput.value,
      depositante: depositanteInput.value,
      receptor: receptorInput.value,
      fechaEntrega: fechaEntregaInput.value,
      horaEntrega: horaEntregaInput.value,
    };

    if (editingIndex === null) {
      despachos.push(despacho);
      agregarFila(despacho, despachos.length - 1);
      alert('Despacho registrado correctamente.');
    } else {
      despachos[editingIndex] = despacho;
      actualizarFila(despacho, editingIndex);
      alert('Despacho actualizado correctamente.');
    }

    localStorage.setItem('despachos', JSON.stringify(despachos));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  const agregarFila = (despacho, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${despacho.codigo}</td>
            <td>${despacho.receptor}</td>
            <td>${despacho.depositante}</td>
            <td>${despacho.fechaEntrega}</td>
            <td>${despacho.horaEntrega}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;
    tableBody.appendChild(row);

    row.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(despacho, index);
    });

    row.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Está seguro de eliminar este despacho?')) {
        despachos.splice(index, 1);
        localStorage.setItem('despachos', JSON.stringify(despachos));
        row.remove();
      }
    });
  };

  // Abrir modal para editar despacho
  const abrirParaEditar = (despacho, index) => {
    modal.style.display = 'flex';
    codigoCorrespondenciaSelect.value = despacho.codigo;
    fechaCorrespondenciaInput.value = despacho.fechaCorrespondencia;
    horaCorrespondenciaInput.value = despacho.horaCorrespondencia;
    asuntoInput.value = despacho.asunto;
    despachanteInput.value = despacho.despachante;
    destinatarioInput.value = despacho.destinatario;
    depositanteInput.value = despacho.depositante;
    receptorInput.value = despacho.receptor;
    fechaEntregaInput.value = despacho.fechaEntrega;
    horaEntregaInput.value = despacho.horaEntrega;
    editingIndex = index;
  };

  // Actualizar fila en la tabla
  const actualizarFila = (despacho, index) => {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = despacho.codigo;
    row.cells[1].textContent = despacho.receptor;
    row.cells[2].textContent = despacho.depositante;
    row.cells[3].textContent = despacho.fechaEntrega;
    row.cells[4].textContent = despacho.horaEntrega;
  };

  // Inicializar tabla y selector
  despachos.forEach((despacho, index) => agregarFila(despacho, index));
  populateCorrespondenciaSelect();
});
