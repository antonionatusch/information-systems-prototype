document.addEventListener("DOMContentLoaded", () => {
    const tipoMaterialSelect = document.getElementById("tipo-material");

    const types = JSON.parse(localStorage.getItem("types")) || [];
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.code;
        option.textContent = type.class;
        tipoMaterialSelect.appendChild(option);
    });

    document.getElementById("reporte-tipo-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const tipoMaterial = tipoMaterialSelect.value;
        const fechaInicio = document.getElementById("fecha-inicio").value;
        const fechaFin = document.getElementById("fecha-fin").value;

        if (!tipoMaterial || !fechaInicio || !fechaFin) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // En este punto se puede redirigir o realizar una acción con los datos
        console.log("Generar reporte para:", {
            tipoMaterial,
            fechaInicio,
            fechaFin,
        });
    });
});
