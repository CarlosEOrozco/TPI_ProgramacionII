document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://localhost:7133/api'; // Reemplaza con tu URL real

    // Obtener los elementos del formulario
    const form = document.getElementById('form-componente');
    const inputNombre = document.getElementById('input-nombre');
    const inputPrecio = document.getElementById('input-precio');


    // Agregar un listener al formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Formulario enviado'); // Esto te ayudará a saber si el evento se activa

        const nombre = inputNombre.value;
        const precio = inputPrecio.value;

        const body = {
            nombre: nombre,
            precio: precio
        };
        
        try {
            const response = await fetch(`${API_URL}/Articulos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert('articulo agregado con exito');
                // Opcionalmente, redirigir o resetear el formulario
                form.reset();
            } else {
                alert('Error al agregar el articulo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar agregar el articulo');
        }
    });
});


