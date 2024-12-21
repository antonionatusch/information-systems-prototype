document.addEventListener('DOMContentLoaded', () => {
  const defaultAccount = {
    username: 'admin',
    password: 'admin123',
    name: 'Juan Perez',
    role: 'Gerente Administrativo',
  };

  // Inicializar cuentas predeterminadas si no existen
  if (!localStorage.getItem('accounts')) {
    localStorage.setItem('accounts', JSON.stringify([defaultAccount]));
  }

  // Recuperar datos de empleados si existen
  const getEmployees = () =>
    JSON.parse(localStorage.getItem('empleados')) || [];

  // Recuperar datos de cuentas si existen
  const getAccounts = () => JSON.parse(localStorage.getItem('accounts')) || [];

  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar tanto en el objeto 'accounts' como 'empleados'
    const accounts = getAccounts();
    const employees = getEmployees();

    const account = accounts.find(
      (acc) => acc.username === username && acc.password === password,
    );

    const employee = employees.find(
      (emp) => emp.usuario === username && emp.contraseña === password,
    );

    if (account) {
      localStorage.setItem('currentUser', JSON.stringify(account));
      alert('Inicio de sesión exitoso (Cuentas)');
      window.location.href = '../index.html';
    } else if (employee) {
      localStorage.setItem('currentUser', JSON.stringify(employee));
      alert('Inicio de sesión exitoso (Empleados)');
      window.location.href = '../index.html';
    } else {
      alert('Credenciales incorrectas');
    }
  });
});
