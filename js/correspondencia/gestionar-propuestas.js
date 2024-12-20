document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('propuesta-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const btnHome = document.getElementById('back-to-home');
  const tableBody = document.getElementById('propuestas-table');
  const tipoSelect = document.getElementById('tipo');
  const contratoSelect = document.getElementById('contrato');

  // Obtener proposalTypes del localStorage
  const proposalTypes = JSON.parse(localStorage.getItem('proposalTypes')) || [];

  // Renderizar opciones en el selector de tipo de propuesta
  proposalTypes.forEach((proposalType) => {
    const option = document.createElement('option');
    option.value = proposalType.codigo;
    option.textContent = proposalType.nombre;
    tipoSelect.appendChild(option);
  });
  let propuestas = JSON.parse(localStorage.getItem('propuestas')) || [];
  let tipos = JSON.parse(localStorage.getItem('tiposPropuesta')) || [];
  let contratos = JSON.parse(localStorage.getItem('tiposContrato')) || [];
  let editingIndex = null;

  // Renderizar opciones en los selectores
  tipos.forEach((tipo) => {
    const option = document.createElement('option');
    option.value = tipo.codigo;
    option.textContent = tipo.nombre;
    tipoSelect.appendChild(option);
  });

  contratos.forEach((contrato) => {
    const option = document.createElement('option');
    option.value = contrato.codigo;
    option.textContent = contrato.nombre;
    contratoSelect.appendChild(option);
  });

  // Mostrar modal para crear propuesta
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

  // Guardar o editar propuesta
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const tipo = tipoSelect.value;
    const contrato = contratoSelect.value;
    const destinatario = document.getElementById('destinatario').value;
    const responsable = document.getElementById('responsable').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaTermino = document.getElementById('fecha-termino').value;

    const nuevaPropuesta = {
      codigo,
      tipo,
      contrato,
      destinatario,
      responsable,
      monto,
      fechaInicio,
      fechaTermino,
    };

    if (editingIndex === null) {
      propuestas.push(nuevaPropuesta);
      agregarFila(nuevaPropuesta, propuestas.length - 1);
      alert('Propuesta creada correctamente.');
    } else {
      propuestas[editingIndex] = nuevaPropuesta;
      actualizarFila(nuevaPropuesta, editingIndex);
      alert('Propuesta actualizada correctamente.');
    }

    localStorage.setItem('propuestas', JSON.stringify(propuestas));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(propuesta, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td>${propuesta.codigo}</td>
            <td>${propuesta.tipo}</td>
            <td>${propuesta.contrato}</td>
            <td>${propuesta.destinatario}</td>
            <td>${propuesta.responsable}</td>
            <td>${propuesta.monto}</td>
            <td>${propuesta.fechaInicio} - ${propuesta.fechaTermino}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(propuesta, index);
    });

    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar esta propuesta?')) {
        propuestas.splice(index, 1);
        localStorage.setItem('propuestas', JSON.stringify(propuestas));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar propuesta
  function abrirParaEditar(propuesta, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = propuesta.codigo;
    tipoSelect.value = propuesta.tipo;
    contratoSelect.value = propuesta.contrato;
    document.getElementById('destinatario').value = propuesta.destinatario;
    document.getElementById('responsable').value = propuesta.responsable;
    document.getElementById('monto').value = propuesta.monto;
    document.getElementById('fecha-inicio').value = propuesta.fechaInicio;
    document.getElementById('fecha-termino').value = propuesta.fechaTermino;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(propuesta, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = propuesta.codigo;
    row.cells[1].textContent = propuesta.tipo;
    row.cells[2].textContent = propuesta.contrato;
    row.cells[3].textContent = propuesta.destinatario;
    row.cells[4].textContent = propuesta.responsable;
    row.cells[5].textContent = propuesta.monto;
    row.cells[6].textContent = `${propuesta.fechaInicio} - ${propuesta.fechaTermino}`;
  }

  // Inicializar tabla
  propuestas.forEach((propuesta, index) => agregarFila(propuesta, index));
});
