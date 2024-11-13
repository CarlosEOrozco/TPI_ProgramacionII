
// Función para obtener el parámetro "id" del query string
function obtenerIdDeQueryString() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Retorna el valor de "id"
}

// Función para obtener el componente por ID desde la base de datos (fetch)
async function obtenerArticuloPorId(id) {
    const response = await fetch(`https://localhost:7133/getby${id}`);
    const data = await response.json();
    return data;
}
// Función para cargar los valores del JSON en los inputs
function cargarDatosEnFormulario(articulo) {
    document.getElementById('idarticulo').value = articulo.idarticulo;
    document.getElementById('nombre').value = articulo.nombre;
    document.getElementById('precio').value = articulo.precio;
    document.getElementById('estado').value = articulo.estado;
}

// Cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar la carga de datos
    window.onload = async function () {
        const id = obtenerIdDeQueryString();
        if (id) {
            const articulo = await obtenerArticuloPorId(id);
            cargarDatosEnFormulario(articulo);
        } else {
            alert('No se ha proporcionado un ID válido en la URL.');
        }
    };

    // Evento para manejar el envío del formulario
    document.getElementById('componenteForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const idarticulo = document.getElementById('idarticulo').value;
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const estado = document.getElementById('estado').value;

        // Crear el objeto JSON con los datos
        const articuloActualizado = {
            idarticulo: parseInt(idarticulo), // Asegúrate de que "idarticulo" sea un número
            nombre: nombre,
            precio: parseFloat(precio),       // Asegúrate de que "precio" sea un número
            estado: estado
        };

        // Enviar los datos actualizados con un PUT request
        const response = await fetch(`https://localhost:7133/api/Articulos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articuloActualizado)
        });

        if (response.ok) {
            alert('Artículo actualizado con éxito');
        } else {
            alert('Hubo un error al actualizar el artículo');
        }
    });
});
