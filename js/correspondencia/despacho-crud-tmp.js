document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('despacho-form');
  const modal = document.getElementById('form-modal');
  const closeModal = document.querySelector('.close');
  const btnCreate = document.getElementById('create-new');
  const tableBody = document.getElementById('despachos-table');

  let despachos = JSON.parse(localStorage.getItem('despachos')) || [];
  let editingIndex = null; // Índice para edición

  // Mostrar modal para registrar despacho
  btnCreate.addEventListener('click', () => {
    modal.style.display = 'flex';
    form.reset();
    editingIndex = null;
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

  // Guardar o editar despacho
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const receptor = document.getElementById('receptor').value;
    const despachante = document.getElementById('despachante').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    const nuevoDespacho = { codigo, receptor, despachante, fecha, hora };

    if (editingIndex === null) {
      despachos.push(nuevoDespacho);
      agregarFila(nuevoDespacho, despachos.length - 1);
      alert('Despacho registrado correctamente.');
    } else {
      despachos[editingIndex] = nuevoDespacho;
      actualizarFila(nuevoDespacho, editingIndex);
      alert('Despacho modificado correctamente.');
    }

    localStorage.setItem('despachos', JSON.stringify(despachos));
    form.reset();
    modal.style.display = 'none';
  });

  // Agregar fila a la tabla
  function agregarFila(despacho, index) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td>${despacho.codigo}</td>
            <td>${despacho.receptor}</td>
            <td>${despacho.despachante}</td>
            <td>${despacho.fecha}</td>
            <td>${despacho.hora}</td>
            <td>
                <button class="btn btn-modify">Modificar</button>
                <button class="btn btn-delete">Eliminar</button>
            </td>
        `;

    newRow.querySelector('.btn-modify').addEventListener('click', () => {
      abrirParaEditar(despacho, index);
    });

    newRow.querySelector('.btn-delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas eliminar este despacho?')) {
        despachos.splice(index, 1);
        localStorage.setItem('despachos', JSON.stringify(despachos));
        newRow.remove();
      }
    });

    tableBody.appendChild(newRow);
  }

  // Abrir modal para editar despacho
  function abrirParaEditar(despacho, index) {
    modal.style.display = 'flex';
    document.getElementById('codigo').value = despacho.codigo;
    document.getElementById('receptor').value = despacho.receptor;
    document.getElementById('despachante').value = despacho.despachante;
    document.getElementById('fecha').value = despacho.fecha;
    document.getElementById('hora').value = despacho.hora;
    editingIndex = index;
  }

  // Actualizar fila en la tabla
  function actualizarFila(despacho, index) {
    const rows = tableBody.getElementsByTagName('tr');
    const row = rows[index];
    row.cells[0].textContent = despacho.codigo;
    row.cells[1].textContent = despacho.receptor;
    row.cells[2].textContent = despacho.despachante;
    row.cells[3].textContent = despacho.fecha;
    row.cells[4].textContent = despacho.hora;
  }

  // Inicializar tabla
  despachos.forEach((despacho, index) => agregarFila(despacho, index));
});
