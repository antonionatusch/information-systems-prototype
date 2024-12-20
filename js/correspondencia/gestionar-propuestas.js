document.addEventListener('DOMContentLoaded', function () {
  const proposalTable = document.getElementById('proposal-table');
  const formModal = document.getElementById('form-modal');
  const closeModalButton = document.querySelector('.close');
  const proposalForm = document.getElementById('proposal-form');
  const contractSelector = document.getElementById('contract-selector');
  const typeSelector = document.getElementById('tipo');
  const amountField = document.getElementById('monto');
  const createNewButton = document.getElementById('create-new');

  let proposals = JSON.parse(localStorage.getItem('propuestas')) || [];
  let proposalTypes = JSON.parse(localStorage.getItem('proposalTypes')) || [];
  let contracts = JSON.parse(localStorage.getItem('contratos')) || [];
  let editingIndex = null;

  // Cargar tipos de propuesta
  function loadProposalTypes() {
    typeSelector.innerHTML = '<option value="">Seleccione un tipo</option>';
    proposalTypes.forEach((type) => {
      const option = document.createElement('option');
      option.value = type.codigo;
      option.textContent = type.nombre;
      typeSelector.appendChild(option);
    });
  }

  // Cargar contratos
  function loadContracts() {
    contractSelector.innerHTML = '<option value="">Sin contrato</option>';
    contracts.forEach((contract) => {
      const option = document.createElement('option');
      option.value = contract.codigo;
      option.textContent = `${contract.codigo}`;
      contractSelector.appendChild(option);
    });
  }

  // Actualizar monto al seleccionar contrato
  contractSelector.addEventListener('change', function () {
    const selectedContract = contracts.find(
      (contract) => contract.codigo === this.value,
    );
    amountField.value = selectedContract ? selectedContract.monto : '';
  });

  // Renderizar propuestas
  function renderProposals() {
    proposalTable.innerHTML = '';
    proposals.forEach((proposal, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${proposal.codigo}</td>
        <td>${proposal.tipo}</td>
        <td>${proposal.destinatario}</td>
        <td>${proposal.responsable}</td>
        <td>${proposal.monto}</td>
        <td>${proposal.contrato || 'Sin contrato'}</td>
        <td>
          <button onclick="editProposal(${index})">Modificar</button>
          <button onclick="deleteProposal(${index})">Eliminar</button>
        </td>
      `;
      proposalTable.appendChild(row);
    });
  }

  // Mostrar modal para crear nueva propuesta
  createNewButton.addEventListener('click', function () {
    formModal.style.display = 'flex';
    proposalForm.reset();
    contractSelector.value = '';
    amountField.value = '';
    editingIndex = null;
  });

  // Guardar propuesta
  proposalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newProposal = {
      codigo: document.getElementById('codigo').value,
      tipo: typeSelector.value,
      destinatario: document.getElementById('destinatario').value,
      responsable: document.getElementById('responsable').value,
      monto: amountField.value,
      contrato: contractSelector.value || 'Sin contrato',
    };

    if (editingIndex === null) {
      proposals.push(newProposal);
    } else {
      proposals[editingIndex] = newProposal;
      editingIndex = null;
    }

    localStorage.setItem('propuestas', JSON.stringify(proposals));
    renderProposals();
    formModal.style.display = 'none';
    proposalForm.reset();
  });

  // Editar propuesta
  window.editProposal = function (index) {
    const proposal = proposals[index];
    document.getElementById('codigo').value = proposal.codigo;
    typeSelector.value = proposal.tipo;
    document.getElementById('destinatario').value = proposal.destinatario;
    document.getElementById('responsable').value = proposal.responsable;
    contractSelector.value = proposal.contrato;
    amountField.value = proposal.monto;

    editingIndex = index;
    formModal.style.display = 'flex';
  };

  // Eliminar propuesta
  window.deleteProposal = function (index) {
    if (confirm('¿Está seguro de eliminar esta propuesta?')) {
      proposals.splice(index, 1);
      localStorage.setItem('propuestas', JSON.stringify(proposals));
      renderProposals();
    }
  };

  // Inicializar
  closeModalButton.addEventListener(
    'click',
    () => (formModal.style.display = 'none'),
  );
  loadProposalTypes();
  loadContracts();
  renderProposals();
});
