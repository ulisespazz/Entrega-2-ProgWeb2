# TP Programación Web 2 - Tienda de Bebidas (SPA)

Aplicación que simula un sistema de catálogo y carrito de compras dinámico en tiempo real.

## Tecnologías utilizadas

* Frontend: React.js, HTML5, CSS3, JavaScript (ES6).
* Backend: Python, Flask, Flask-CORS (para permitir peticiones entre puertos).
* Librerías de (Alertas): SweetAlert2.
* Base de Datos: MongoDB (a través de PyMongo).
* Pruebas(E2E): Cypress.

#### Ejecución Flask
- Crear entorno virtual: 
    python -m venv venv

- Activar entorno virtual: 
    venv\Scripts\activate

- Instalar Flask: 
    pip install flask

- Configurar Flask:
    set FLASK_APP=app.py

- Ejecutar aplicación: 

    flask --app app run

#### Ejecución React
- Terminal VS, ubicarse en la carperta del front:
    cd frontend

- Iniciar el servidor de desarrollo de React:
    npm start

##### Ejecución Cypress
- Terminal, ubicarse en la carperta del front:
    cd frontend

- npx cypress open (Visual)
- npx cypress run --spec "cypress/e2e/tienda.cy.js" (consola)