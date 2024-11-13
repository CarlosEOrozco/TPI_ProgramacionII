document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://localhost:7133/api/Articulos';

    // Función para obtener los artículos
    async function fetchArticulo() {
        try {
            const response = await fetch(API_URL);
            const articulos = await response.json();
            cargarArticulos(articulos);
        } catch (error) {
            console.error('Error al obtener los articulos:', error);
        }
    }

    // Función para crear las filas de la tabla
    function cargarArticulos(articulos) {
        const tbody = document.getElementById('ordenes-body');
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

        articulos.forEach(articulo => {
            const row = document.createElement('tr');

            // Columna Número
            const idarticuloTd = document.createElement('td');
            idarticuloTd.textContent = articulo.idarticulo;
            row.appendChild(idarticuloTd);

            // Columna Precio
            const precioTd = document.createElement('td');
            precioTd.textContent = articulo.precio;
            row.appendChild(precioTd);

            // Columna Nombre
            const nombreTd = document.createElement('td');
            nombreTd.textContent = articulo.nombre;
            row.appendChild(nombreTd);

            // Columna Estado
            const estadoTd = document.createElement('td');
            estadoTd.textContent = articulo.estado;
            row.appendChild(estadoTd);

            // Columna Acciones (Detalle y Eliminar)
            const accionesTd = document.createElement('td');

            // Botón Eliminar
            const eliminarBtn = document.createElement('button');
            eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro que deseas eliminar este articulo?')) {
                    eliminarArticulo(articulo.idarticulo);
                }
            });

            // Botón Detalle
            const detalleBtn = document.createElement('button');
            detalleBtn.classList.add('btn', 'btn-info', 'btn-sm', 'btnStyle');
            detalleBtn.textContent = 'Detalle';
            detalleBtn.addEventListener('click', () => {
                window.location.href = `detalleComponente.html?id=${articulo.idarticulo}&nombre=${encodeURIComponent(articulo.nombre)}&precio=${articulo.precio}&estado=${encodeURIComponent(articulo.estado)}`;
            });

            accionesTd.appendChild(eliminarBtn);
            accionesTd.appendChild(detalleBtn);

            row.appendChild(accionesTd);

            // Agregar la fila a la tabla
            tbody.appendChild(row);
        });
    }

    // Función para eliminar un artículo
    async function eliminarArticulo(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Articulo eliminado con éxito');
                fetchArticulo(); // Recargar los artículos después de eliminar
            } else {
                alert('Error al eliminar el articulo');
            }
        } catch (error) {
            console.error('Error al eliminar el articulo:', error);
            alert('Ocurrió un error al intentar eliminar el articulo');
        }
    }

    // Llamar a la función para cargar los artículos cuando la página cargue
    fetchArticulo();
});