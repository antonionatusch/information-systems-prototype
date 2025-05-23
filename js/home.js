document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const gestionarEmpleadoLink = document.getElementById(
    'gestionar-empleado-link',
  );
  const empresasLink = document.getElementById('empresas-link');
  const propuestasLink = document.getElementById('gestionar-propuestas-link');

  if (currentUser) {
    // Mostrar enlaces para usuarios autenticados
    logoutLink.style.display = 'block';
    loginLink.style.display = 'none';

    // Mostrar enlaces de gestión solo para Gerente Administrativo
    if (currentUser.role === 'Gerente Administrativo') {
      gestionarEmpleadoLink.style.display = 'block';
      empresasLink.style.display = 'block';
      propuestasLink.style.display = 'block';
    } else {
      gestionarEmpleadoLink.style.display = 'none';
      empresasLink.style.display = 'none';
      propuestasLink.style.display = 'none';
    }
  } else {
    // Ocultar enlaces si no hay usuario autenticado
    logoutLink.style.display = 'none';
    gestionarEmpleadoLink.style.display = 'none';
    empresasLink.style.display = 'none';
    propuestasLink.style.display = 'none';
    loginLink.style.display = 'block';
  }

  // Cerrar sesión
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser'); // Eliminar datos del usuario actual
    alert('Has cerrado sesión exitosamente.');
    window.location.href = 'index.html'; // Redirigir al inicio
  });
});
