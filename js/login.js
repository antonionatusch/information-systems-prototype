document.addEventListener('DOMContentLoaded', () => {
  const defaultAccount = {
    username: 'admin',
    password: 'admin123',
    role: 'Gerente Administrativo',
  };

  if (!localStorage.getItem('accounts')) {
    localStorage.setItem('accounts', JSON.stringify([defaultAccount]));
  }

  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const accounts = JSON.parse(localStorage.getItem('accounts'));
    const account = accounts.find(
      (acc) => acc.username === username && acc.password === password,
    );

    if (account) {
      localStorage.setItem('currentUser', JSON.stringify(account));
      alert('Inicio de sesión exitoso');
      window.location.href = '../index.html';
    } else {
      alert('Credenciales incorrectas');
    }
  });
});
