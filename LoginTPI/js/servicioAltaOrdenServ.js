document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://localhost:7133/api';

    const form = document.getElementById('form-orden');
    const inputFecha = document.getElementById('input-fecha');
    const selectFormaPago = document.getElementById('component');
    const inputCliente = document.getElementById('input-cliente');
    const inputClienteId = document.getElementById('input-cliente-id');
    const clienteList = document.getElementById('cliente-list');
    const selectArticulos = document.getElementById('component1');

    // Llenar el campo de fecha con la fecha actual
    const today = new Date().toISOString().split('T')[0];
    inputFecha.value = today;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Formulario enviado');

        const fechaInput = new Date(inputFecha.value);
        if (isNaN(fechaInput)) {
            alert('Fecha no válida');
            return;
        }
        const fecha = fechaInput.toISOString();
        const formaPago = parseInt(selectFormaPago.value);
        const cliente = parseInt(inputClienteId.value);

        const detalles = obtenerDetallesTabla();

        const body = {
            nrofactura: 0,
            fecha: fecha,
            formapago: formaPago,
            cliente: cliente,
            detalles: detalles
        };

        console.log('Datos enviados:', body);

        try {
            const response = await fetch(`${API_URL}/Factura`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert('Factura agregada con éxito');
                form.reset();
                inputFecha.value = today; // Restablecer la fecha al día de hoy
            } else {
                const errorText = await response.text();
                console.error('Error al agregar la factura:', errorText);
                alert(`Error al agregar la factura: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar agregar la factura');
        }
    });

    cargarFormasPago();
    cargarArticulos();
    configurarAutocompletadoClientes();

    async function cargarFormasPago() {
        try {
            const response = await fetch(`${API_URL}/Factura/formas`);
            if (!response.ok) throw new Error('Error al cargar Forma pago');

            const formaspago = await response.json();
            formaspago.forEach(formapago => {
                const option = document.createElement('option');
                option.value = formapago.idFormaPago; // Asegúrate de usar el campo correcto
                option.textContent = formapago.nombre.trim(); // Elimina espacios en blanco
                selectFormaPago.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar forma pago:', error);
            alert('Ocurrió un error al cargar las forma pago');
        }
    }

    async function cargarArticulos() {
        try {
            const response = await fetch(`${API_URL}/Articulos`);
            if (!response.ok) throw new Error('Error al cargar Articulos');

            const articulos = await response.json();
            articulos.forEach(articulo => {
                const option = document.createElement('option');
                option.value = articulo.idarticulo;
                option.textContent = articulo.nombre;
                selectArticulos.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar articulos:', error);
            alert('Ocurrió un error al cargar los articulos');
        }
    }

    async function configurarAutocompletadoClientes() {
        try {
            const response = await fetch(`${API_URL}/Factura/clientes`);
            if (!response.ok) throw new Error('Error al cargar Clientes');

            const clientes = await response.json();
            inputCliente.addEventListener('input', () => {
                const searchTerm = inputCliente.value.toLowerCase();
                clienteList.innerHTML = '';

                clientes
                    .filter(cliente => `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm))
                    .forEach(cliente => {
                        const item = document.createElement('a');
                        item.href = '#';
                        item.classList.add('list-group-item', 'list-group-item-action');
                        item.textContent = `${cliente.nombre} ${cliente.apellido}`;
                        item.addEventListener('click', () => {
                            inputCliente.value = `${cliente.nombre} ${cliente.apellido}`;
                            inputClienteId.value = cliente.idcliente;
                            clienteList.innerHTML = '';
                        });
                        clienteList.appendChild(item);
                    });
            });

            document.addEventListener('click', (event) => {
                if (!inputCliente.contains(event.target) && !clienteList.contains(event.target)) {
                    clienteList.innerHTML = '';
                }
            });
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            alert('Ocurrió un error al cargar los clientes');
        }
    }

    function obtenerDetallesTabla() {
        const tabla = document.getElementById('detailsTable');
        const filas = tabla.querySelectorAll('tbody tr');
        const detalles = [];

        filas.forEach(fila => {
            const idarticulo = parseInt(fila.children[0].textContent);
            const cantidad = parseInt(fila.children[2].textContent);

            detalles.push({
                idarticulo: idarticulo,
                cantidad: cantidad
            });
        });

        return detalles;
    }
});