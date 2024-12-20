document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contrato-form');
  const modal = document.getElementById('contrato-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-contrato');
  const tableBody = document.getElementById('contratos-table');
  const codigoPropuestaSelect = document.getElementById('codigo-propuesta');
  const tipoContratoSelect = document.getElementById('tipo-contrato');
  const tipoPropuestaSelect = document.getElementById('tipo-propuesta');

  // Obtener datos del Local Storage
  let contratos = JSON.parse(localStorage.getItem('contratos')) || [];
  let propuestas = JSON.parse(localStorage.getItem('propuestas')) || [];
  let tiposContrato = JSON.parse(localStorage.getItem('contractTypes')) || [];
  let tiposPropuesta = JSON.parse(localStorage.getItem('proposalTypes')) || [];
  let editingIndex = null;

  // Cargar opciones de propuestas, tipos de contrato y tipos de propuesta
  propuestas.forEach((propuesta) => {
    const option = document.createElement('option');
    option.value = propuesta.codigo;
    option.textContent = `${propuesta.codigo} - ${propuesta.destinatario}`;
    codigoPropuestaSelect.appendChild(option);
  });

  tiposContrato.forEach((tipo) => {
    const option = document.createElement('option');
    option.value = tipo.codigo;
    option.textContent = tipo.nombre;
    tipoContratoSelect.appendChild(option);
  });

  tiposPropuesta.forEach((tipo) => {
    const option = document.createElement('option');
    option.value = tipo.codigo;
    option.textContent = tipo.nombre;
    tipoPropuestaSelect.appendChild(option);
  });

  // Mostrar modal para crear un nuevo contrato
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
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

  // Guardar o editar un contrato
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const codigoPropuesta = codigoPropuestaSelect.value;
    const tipoContrato = tipoContratoSelect.value;
    const tipoPropuesta = tipoPropuestaSelect.value;
    const destinatario = document.getElementById('destinatario').value;
    const responsable = document.getElementById('responsable').value;
    const monto = document.getElementById('monto').value;
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaTermino = document.getElementById('fecha-termino').value;
    const fechaContrato = document.getElementById('fecha-contrato').value;

    if (!codigoPropuesta || !tipoContrato || !tipoPropuesta) {
      alert(
        'Seleccione valores válidos para la propuesta, tipo de contrato y tipo de propuesta.',
      );
      return;
    }

    const nuevoContrato = {
      codigo,
      codigoPropuesta,
      tipoContrato,
      tipoPropuesta,
      destinatario,
      responsable,
      monto,
      fechaInicio,
      fechaTermino,
      fechaContrato,
    };

    if (editingIndex === null) {
      // Agregar nuevo contrato
      contratos.push(nuevoContrato);
      agregarFila(nuevoContrato, contratos.length - 1);
      alert('Contrato creado correctamente.');
    } else {
      // Editar contrato existente
      contratos[editingIndex] = nuevoContrato;
      actualizarFila(nuevoContrato, editingIndex);
      alert('Contrato actualizado correctamente.');
    }

    // Guardar en Local Storage
    localStorage.setItem('contratos', JSON.stringify(contratos));

    // Limpiar y cerrar el formulario
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(contrato, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td>${contrato.codigo}</td>
            <td>${contrato.codigoPropuesta}</td>
            <td>${contrato.tipoContrato}</td>
            <td>${contrato.tipoPropuesta}</td>
            <td>${contrato.destinatario}</td>
            <td>${contrato.responsable}</td>
            <td>${contrato.monto}</td>
            <td>${contrato.fechaInicio}</td>
            <td>${contrato.fechaTermino}</td>
            <td>${contrato.fechaContrato}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(contrato, index);
    });

    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar este contrato?')) {
        contratos.splice(index, 1);
        localStorage.setItem('contratos', JSON.stringify(contratos));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar un contrato
  function abrirParaEditar(contrato, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = contrato.codigo;
    codigoPropuestaSelect.value = contrato.codigoPropuesta;
    tipoContratoSelect.value = contrato.tipoContrato;
    tipoPropuestaSelect.value = contrato.tipoPropuesta;
    document.getElementById('destinatario').value = contrato.destinatario;
    document.getElementById('responsable').value = contrato.responsable;
    document.getElementById('monto').value = contrato.monto;
    document.getElementById('fecha-inicio').value = contrato.fechaInicio;
    document.getElementById('fecha-termino').value = contrato.fechaTermino;
    document.getElementById('fecha-contrato').value = contrato.fechaContrato;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(contrato, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = contrato.codigo;
    row.cells[1].textContent = contrato.codigoPropuesta;
    row.cells[2].textContent = contrato.tipoContrato;
    row.cells[3].textContent = contrato.tipoPropuesta;
    row.cells[4].textContent = contrato.destinatario;
    row.cells[5].textContent = contrato.responsable;
    row.cells[6].textContent = contrato.monto;
    row.cells[7].textContent = contrato.fechaInicio;
    row.cells[8].textContent = contrato.fechaTermino;
    row.cells[9].textContent = contrato.fechaContrato;
  }

  // Inicializar tabla con contratos existentes
  contratos.forEach((contrato, index) => agregarFila(contrato, index));
});
