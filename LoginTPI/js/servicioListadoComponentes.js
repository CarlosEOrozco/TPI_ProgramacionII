document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://localhost:7133/api/Factura';
    const FORMAS_PAGO_URL = 'https://localhost:7133/api/Factura/formas';
    const CLIENTES_URL = 'https://localhost:7133/api/Factura/clientes';
    const DETALLE_FACTURA_URL = 'https://localhost:7133/api/Factura/DetalleFactura';
    let formasPagoMap = {};
    let clientesMap = {};

    // Función para obtener las formas de pago
    async function fetchFormasPago() {
        try {
            const response = await fetch(FORMAS_PAGO_URL);
            const formasPago = await response.json();
            formasPago.forEach(forma => {
                formasPagoMap[forma.idFormaPago] = forma.nombre.trim();
            });
        } catch (error) {
            console.error('Error al obtener las formas de pago:', error);
        }
    }

    // Función para obtener los clientes
    async function fetchClientes() {
        try {
            const response = await fetch(CLIENTES_URL);
            const clientes = await response.json();
            clientes.forEach(cliente => {
                clientesMap[cliente.idcliente] = `${cliente.nombre} ${cliente.apellido}`;
            });
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    }

    // Función para obtener las facturas
    async function fetchFacturas() {
        try {
            const response = await fetch(API_URL);
            const facturas = await response.json();
            cargarFacturas(facturas);
        } catch (error) {
            console.error('Error al obtener las facturas:', error);
        }
    }

    // Función para obtener los detalles de una factura
    async function fetchDetallesFactura(id) {
        try {
            const response = await fetch(`${DETALLE_FACTURA_URL}/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener los detalles de la factura:', error);
            return [];
        }
    }

    // Función para formatear la fecha (de ISO a dd/MM/yyyy)
    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }

    // Función para crear las filas de la tabla
    function cargarFacturas(facturas) {
        const tbody = document.getElementById('componentes-body');
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

        // Ordenar las facturas por fecha, de más reciente a más antigua
        facturas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        facturas.forEach(factura => {
            const row = document.createElement('tr');

            // Columna Número de Factura
            const nroFacturaTd = document.createElement('td');
            nroFacturaTd.textContent = factura.nrofactura;
            row.appendChild(nroFacturaTd);

            // Columna Fecha de Factura
            const fechaTd = document.createElement('td');
            fechaTd.textContent = factura.fecha != null ? formatearFecha(factura.fecha) : '';
            row.appendChild(fechaTd);

            // Columna Forma de Pago
            const formaPagoTd = document.createElement('td');
            formaPagoTd.textContent = formasPagoMap[factura.formapago] || factura.formapago;
            row.appendChild(formaPagoTd);

            // Columna Cliente
            const clienteTd = document.createElement('td');
            clienteTd.textContent = clientesMap[factura.cliente] || factura.cliente;
            row.appendChild(clienteTd);

            // Columna Motivo de Baja
            const motivoBajaTd = document.createElement('td');
            motivoBajaTd.textContent = factura.motivobaja;
            row.appendChild(motivoBajaTd);

            // Columna Acciones (Eliminar y Detalles)
            const accionesTd = document.createElement('td');

            // Botón Eliminar
            const borrarBtn = document.createElement('button');
            borrarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            borrarBtn.textContent = 'Eliminar';
            borrarBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro que deseas dar de baja esta factura?')) {
                    const motivoBaja = prompt('Por favor, ingresa el motivo de baja:');
                    if (motivoBaja && motivoBaja.trim() !== '') {
                        darDeBajaComponente(factura.nrofactura, motivoBaja);
                        borrarBtn.remove();
                    } else {
                        alert('Debes ingresar un motivo de baja válido.');
                    }
                }
            });

            // Botón Detalles
            const detallesBtn = document.createElement('button');
            detallesBtn.classList.add('btn', 'btn-info', 'btn-sm');
            detallesBtn.textContent = 'Detalles';
            detallesBtn.addEventListener('click', async () => {
                if (row.nextSibling && row.nextSibling.classList.contains('detalles-row')) {
                    row.nextSibling.remove();
                } else {
                    const detalles = await fetchDetallesFactura(factura.nrofactura);
                    mostrarDetalles(row, detalles);
                }
            });

            accionesTd.appendChild(borrarBtn);
            accionesTd.appendChild(detallesBtn);
            row.appendChild(accionesTd);

            tbody.appendChild(row);
        });
    }

    // Función para mostrar los detalles de una factura
    function mostrarDetalles(row, detalles) {
        // Crear una fila para los detalles
        const detallesRow = document.createElement('tr');
        detallesRow.classList.add('detalles-row');
        const detallesTd = document.createElement('td');
        detallesTd.colSpan = 6; // Abarcar todas las columnas
        detallesRow.appendChild(detallesTd);

        // Crear una mini tabla para los detalles
        const detallesTable = document.createElement('table');
        detallesTable.classList.add('table', 'table-sm', 'table-bordered', 'mt-2');

        // Crear el encabezado de la mini tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['ID Detalle', 'ID Artículo', 'Cantidad'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.color = 'white'; // Establecer el color del texto a blanco
            th.style.backgroundColor = '#343a40'; // Establecer el color de fondo
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        detallesTable.appendChild(thead);

        // Crear el cuerpo de la mini tabla
        const tbody = document.createElement('tbody');
        detalles.forEach(detalle => {
            const detalleRow = document.createElement('tr');
            ['iddetalle', 'idarticulo', 'cantidad'].forEach(key => {
                const td = document.createElement('td');
                td.textContent = detalle[key];
                detalleRow.appendChild(td);
            });
            tbody.appendChild(detalleRow);
        });
        detallesTable.appendChild(tbody);

        detallesTd.appendChild(detallesTable);
        row.parentNode.insertBefore(detallesRow, row.nextSibling);
    }

    // Función para dar de baja un componente
    async function darDeBajaComponente(id, motivoBaja) {
        try {
            const response = await fetch(`${API_URL}/${id}, ${motivoBaja}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Factura dada de baja correctamente');
                fetchFacturas(); // Recargar las facturas después de dar de baja
            } else {
                alert('Error al dar de baja la factura');
            }
        } catch (error) {
            console.error('Error al dar de baja la factura:', error);
            alert('Ocurrió un error al intentar dar de baja la factura');
        }
    }

    // Llamar a las funciones para cargar las formas de pago y las facturas cuando la página cargue
    fetchFormasPago().then(fetchClientes).then(fetchFacturas);
});