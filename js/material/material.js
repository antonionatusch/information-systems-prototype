function mostrarOpcionesReportes() {
    const reportesCard = document.getElementById('reportes-card');
    const opcionesReportes = document.getElementById('opciones-reportes');

    // Oculta el card inicial de reportes y muestra las opciones
    reportesCard.style.display = 'none';
    opcionesReportes.style.display = 'flex'; // Cambiar el estilo de display según tu diseño
}
