// Aquí puedes añadir cualquier funcionalidad JavaScript necesaria para la página
console.log('Sistema de Gestión Administrativa iniciado');

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const loginLink = document.getElementById('login-link');
  const gestionarEmpleadoLink = document.getElementById(
    'gestionar-empleado-link',
  );

  if (currentUser && currentUser.role === 'Gerente Administrativo') {
    // Mostrar enlace "Gestionar Empleados" y ocultar "Login"
    gestionarEmpleadoLink.style.display = 'block';
    loginLink.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const gestionarEmpleadoLink = document.getElementById(
    'gestionar-empleado-link',
  );

  if (currentUser && currentUser.role === 'Gerente Administrativo') {
    // Mostrar enlaces para usuarios autenticados
    gestionarEmpleadoLink.style.display = 'block';
    logoutLink.style.display = 'block';
    loginLink.style.display = 'none';
  }

  // Cerrar sesión
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser'); // Eliminar datos del usuario actual
    alert('Has cerrado sesión exitosamente.');
    window.location.href = 'index.html'; // Redirigir al inicio
  });
});
