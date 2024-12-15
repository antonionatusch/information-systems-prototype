document.addEventListener('DOMContentLoaded', function () {
  const tipoRecepcion = document.getElementById('tipo-recepcion');
  const tipoEnvio = document.getElementById('tipo-envio');
  const recepcionFields = document.getElementById('recepcion-fields');
  const envioFields = document.getElementById('envio-fields');

  // Cambiar visibilidad según el radio seleccionado
  const toggleFields = () => {
    if (tipoRecepcion.checked) {
      recepcionFields.classList.remove('hidden');
      envioFields.classList.add('hidden');
    } else if (tipoEnvio.checked) {
      envioFields.classList.remove('hidden');
      recepcionFields.classList.add('hidden');
    }
  };

  // Asignar eventos
  tipoRecepcion.addEventListener('change', toggleFields);
  tipoEnvio.addEventListener('change', toggleFields);

  // Inicialización
  toggleFields();
});
