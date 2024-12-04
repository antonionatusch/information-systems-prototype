document.addEventListener("DOMContentLoaded", () => {
    const solicitanteSelect = document.getElementById("solicitante");

    // Cargar empleados desde localStorage
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    employees.forEach((employee) => {
        const option = document.createElement("option");
        option.value = employee.id;
        option.textContent = employee.name;
        solicitanteSelect.appendChild(option);
    });

    // Manejador del formulario
    document.getElementById("reporte-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const solicitante = solicitanteSelect.value;
        const fechaInicio = document.getElementById("fecha-inicio").value;
        const fechaFin = document.getElementById("fecha-fin").value;

        if (!solicitante || !fechaInicio || !fechaFin) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // En este punto se puede redirigir o realizar una acción con los datos
        console.log("Generar reporte para:", {
            solicitante,
            fechaInicio,
            fechaFin,
        });
    });
});
