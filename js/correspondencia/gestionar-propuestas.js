document.addEventListener('DOMContentLoaded', function () {
  const proposalTable = document.getElementById('proposal-table');
  const formModal = document.getElementById('form-modal');
  const closeModalButton = document.querySelector('.close');
  const proposalForm = document.getElementById('proposal-form');
  const contractSelector = document.getElementById('contract-selector');
  const typeSelector = document.getElementById('tipo');
  const amountField = document.getElementById('monto');
  const createNewButton = document.getElementById('create-new');
  const destinatarioSelector = document.getElementById('destinatario');
  const responsableSelector = document.getElementById('responsable');

  let proposals = JSON.parse(localStorage.getItem('propuestas')) || [];
  let proposalTypes = JSON.parse(localStorage.getItem('proposalTypes')) || [];
  let contracts = JSON.parse(localStorage.getItem('contratos')) || [];
  let empresas = JSON.parse(localStorage.getItem('empresas')) || [];
  let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
  let editingIndex = null;

  function loadProposalTypes() {
    typeSelector.innerHTML = '<option value="">Seleccione un tipo</option>';
    proposalTypes.forEach((type) => {
      const option = document.createElement('option');
      option.value = type.codigo;
      option.textContent = type.nombre;
      typeSelector.appendChild(option);
    });
  }

  function loadContracts() {
    contractSelector.innerHTML = '<option value="">Sin contrato</option>';
    contracts.forEach((contract) => {
      const option = document.createElement('option');
      option.value = contract.codigo;
      option.textContent = `${contract.codigo}`;
      contractSelector.appendChild(option);
    });
  }

  function loadDestinatarios() {
    destinatarioSelector.innerHTML =
      '<option value="">Seleccione un destinatario</option>';
    empresas.forEach((empresa) => {
      const option = document.createElement('option');
      option.value = empresa.responsable;
      option.textContent = empresa.responsable;
      destinatarioSelector.appendChild(option);
    });
  }

  function loadResponsables() {
    responsableSelector.innerHTML =
      '<option value="">Seleccione un responsable</option>';
    empleados.forEach((empleado) => {
      const option = document.createElement('option');
      option.value = empleado.nombre;
      option.textContent = empleado.nombre;
      responsableSelector.appendChild(option);
    });
  }

  contractSelector.addEventListener('change', function () {
    const selectedContract = contracts.find(
      (contract) => contract.codigo === this.value,
    );
    amountField.value = selectedContract ? selectedContract.monto : '';
  });

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

  createNewButton.addEventListener('click', function () {
    formModal.style.display = 'flex';
    proposalForm.reset();
    contractSelector.value = '';
    amountField.value = '';
    editingIndex = null;
  });

  proposalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newProposal = {
      codigo: document.getElementById('codigo').value,
      tipo: typeSelector.value,
      destinatario: destinatarioSelector.value,
      responsable: responsableSelector.value,
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

  window.editProposal = function (index) {
    const proposal = proposals[index];
    document.getElementById('codigo').value = proposal.codigo;
    typeSelector.value = proposal.tipo;
    destinatarioSelector.value = proposal.destinatario;
    responsableSelector.value = proposal.responsable;
    contractSelector.value = proposal.contrato;
    amountField.value = proposal.monto;

    editingIndex = index;
    formModal.style.display = 'flex';
  };

  window.deleteProposal = function (index) {
    if (confirm('¿Está seguro de eliminar esta propuesta?')) {
      proposals.splice(index, 1);
      localStorage.setItem('propuestas', JSON.stringify(proposals));
      renderProposals();
    }
  };

  closeModalButton.addEventListener(
    'click',
    () => (formModal.style.display = 'none'),
  );
  loadProposalTypes();
  loadContracts();
  loadDestinatarios();
  loadResponsables();
  renderProposals();
});
