// Función para obtener los detalles de las facturas
async function fetchDetallesFactura() {
    const DETALLE_FACTURA_URL = 'https://localhost:7133/api/Factura/DetallesFactura';
    try {
        const response = await fetch(DETALLE_FACTURA_URL);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los detalles de las facturas:', error);
        return [];
    }
}

// Función para obtener el nombre del artículo por su ID
async function fetchNombreArticulo(id) {
    const ARTICULO_URL = `https://localhost:7133/getby${id}`;
    try {
        const response = await fetch(ARTICULO_URL);
        const articulo = await response.json();
        return articulo[0].nombre;
    } catch (error) {
        console.error(`Error al obtener el nombre del artículo con ID ${id}:`, error);
        return 'Desconocido';
    }
}

// Función para cargar los artículos más vendidos en la tabla
async function cargarArticulosMasVendidos() {
    const detalles = await fetchDetallesFactura();
    const articulosMap = {};

    // Sumar las cantidades de los artículos con el mismo idarticulo
    detalles.forEach(detalle => {
        if (articulosMap[detalle.idarticulo]) {
            articulosMap[detalle.idarticulo] += detalle.cantidad;
        } else {
            articulosMap[detalle.idarticulo] = detalle.cantidad;
        }
    });

    // Convertir el mapa en una lista de artículos y ordenarlos por cantidad
    const articulosList = Object.keys(articulosMap).map(idarticulo => ({
        idarticulo,
        cantidad: articulosMap[idarticulo]
    }));
    articulosList.sort((a, b) => b.cantidad - a.cantidad);

    // Tomar los 10 primeros artículos
    const top10Articulos = articulosList.slice(0, 10);

    // Crear las filas de la tabla
    const tbody = document.getElementById('articulos-mas-vendidos-body');
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

    for (const articulo of top10Articulos) {
        const row = document.createElement('tr');

        const nombreArticulo = await fetchNombreArticulo(articulo.idarticulo);

        const nombreTd = document.createElement('td');
        nombreTd.textContent = nombreArticulo;
        row.appendChild(nombreTd);

        const cantidadTd = document.createElement('td');
        cantidadTd.textContent = articulo.cantidad;
        row.appendChild(cantidadTd);

        tbody.appendChild(row);
    }
}

// Llamar a la función para cargar los artículos más vendidos cuando la página cargue
document.addEventListener('DOMContentLoaded', cargarArticulosMasVendidos);