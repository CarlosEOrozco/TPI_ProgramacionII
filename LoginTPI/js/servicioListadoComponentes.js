document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://localhost:7133/api/Factura';
    const FORMAS_PAGO_URL = 'https://localhost:7133/api/Factura/formas';
    const CLIENTES_URL = 'https://localhost:7133/api/Factura/clientes';
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

            // Columna Acciones (Eliminar)
            const accionesTd = document.createElement('td');
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
            accionesTd.appendChild(borrarBtn);
            row.appendChild(accionesTd);

            tbody.appendChild(row);
        });
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