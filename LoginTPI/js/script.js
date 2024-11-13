// Agregar un evento de escucha para el formulario de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const username = document.getElementById('loginUsername').value; // Obtener el valor del campo de usuario
    const password = document.getElementById('loginPassword').value; // Obtener el valor del campo de contraseña

    // Realizar una solicitud fetch al endpoint de login
    fetch('https://localhost:7099/api/Login/login', {
        method: 'POST', // Método HTTP POST
        headers: {
            'Content-Type': 'application/json' // Tipo de contenido JSON
        },
        body: JSON.stringify({ Username: username, Password: password }) // Convertir los datos a JSON
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es OK, lanzar un error con el texto de la respuesta
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
        console.log('Response data:', data); // Imprimir los datos de la respuesta para depuración
        if (data.token) { // Verificar si la respuesta contiene un token
            alert('Login exitoso'); // Mostrar un mensaje de éxito
            localStorage.setItem('jwtToken', data.token); // Guardar el token en el almacenamiento local
            window.location.href ='http://127.0.0.1:5500/TPI_ProgramacionII/TPI_ProgramacionII/LoginTPI/HTML/Inicio.html'; // Redirigir a la página del inicio logeado
        } else {
            alert(data.Message || 'Error desconocido'); // Mostrar un mensaje de error
        }
    })
    .catch(error => alert('Error: ' + error.message)); // Manejar errores y mostrar un mensaje de error
});

// Agregar un evento de escucha para el formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const username = document.getElementById('registerUsername').value; // Obtener el valor del campo de usuario
    const password = document.getElementById('registerPassword').value; // Obtener el valor del campo de contraseña
    const name = document.getElementById('registerName').value; // Obtener el valor del campo de nombre
    const surname = document.getElementById('registerSurname').value; // Obtener el valor del campo de apellido

    // Realizar una solicitud fetch al endpoint de registro
    fetch('https://localhost:7099/api/Login/register', {
        method: 'POST', // Método HTTP POST
        headers: {
            'Content-Type': 'application/json' // Tipo de contenido JSON
        },
        body: JSON.stringify({ Username: username, Password: password, Name: name, Surname: surname }) // Convertir los datos a JSON
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es OK, lanzar un error con el texto de la respuesta
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
        console.log('Response data:', data); // Imprimir los datos de la respuesta para depuración
        if (data.success) { // Verificar si la respuesta indica éxito
            alert('Registro exitoso'); // Mostrar un mensaje de éxito
        } else {
            alert(data.Message || 'Error desconocido'); // Mostrar un mensaje de error
        }
    })
    .catch(error => alert('Error: ' + error.message)); // Manejar errores y mostrar un mensaje de error
});