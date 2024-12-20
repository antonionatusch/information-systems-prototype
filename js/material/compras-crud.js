document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('compra-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('compras-table');

  let compras = JSON.parse(localStorage.getItem('compras')) || [];
  let ordenes = JSON.parse(localStorage.getItem('ordenes')) || [];
  let editingIndex = null;

  // Mostrar modal para registrar una nueva compra
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Validar y guardar o modificar compra
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigoOrden = document.getElementById('codigo-orden').value;
    const codigoCompra = document.getElementById('codigo-compra').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const detalle = document.getElementById('detalle').value;
    const fecha = document.getElementById('fecha').value;

    // Validaciones
    if (!ordenes.some((orden) => orden.codigoOrden === codigoOrden)) {
      alert('El código de la orden no existe. Por favor, verifica.');
      return;
    }

    if (
      compras.some((compra) => compra.codigoCompra === codigoCompra) &&
      editingIndex === null
    ) {
      alert(
        'El código de la compra ya existe. Por favor, elige uno diferente.',
      );
      return;
    }

    const nuevaCompra = { codigoOrden, codigoCompra, monto, detalle, fecha };

    if (editingIndex === null) {
      compras.push(nuevaCompra);
      agregarFila(nuevaCompra, compras.length - 1);
      alert('Compra registrada correctamente.');
    } else {
      compras[editingIndex] = nuevaCompra;
      actualizarFila(nuevaCompra, editingIndex);
      alert('Compra modificada correctamente.');
    }

    localStorage.setItem('compras', JSON.stringify(compras));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(compra, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${compra.codigoOrden}</td>
      <td>${compra.codigoCompra}</td>
      <td>${compra.monto}</td>
      <td>${compra.detalle}</td>
      <td>${compra.fecha}</td>
      <td>
        <button class="btn btn-modify">Modificar</button>
        <button class="btn btn-delete">Eliminar</button>
      </td>
    `;

    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(compra, index);
    });

    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de eliminar esta compra?')) {
        compras.splice(index, 1);
        localStorage.setItem('compras', JSON.stringify(compras));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar compra
  function abrirParaEditar(compra, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo-orden').value = compra.codigoOrden;
    document.getElementById('codigo-compra').value = compra.codigoCompra;
    document.getElementById('monto').value = compra.monto;
    document.getElementById('detalle').value = compra.detalle;
    document.getElementById('fecha').value = compra.fecha;
    editingIndex = index;
  }

  // Actualizar fila
  function actualizarFila(compra, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = compra.codigoOrden;
    row.cells[1].textContent = compra.codigoCompra;
    row.cells[2].textContent = compra.monto;
    row.cells[3].textContent = compra.detalle;
    row.cells[4].textContent = compra.fecha;
  }

  // Inicializar tabla
  compras.forEach((compra, index) => agregarFila(compra, index));
});
