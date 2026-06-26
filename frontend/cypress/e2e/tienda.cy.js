beforeEach(() => { //Previo a la ejecución de cada test
  cy.visit('http://localhost:3000'); // Asegura la interacción Frontend-Backend al iniciar
});

describe('Pruebas E2E - Validación de Consigna Oficial', () => {

  it('1. Debe validar la interacción Frontend-Backend al cargar el catálogo', () => {
    // Verifica que el backend le haya enviado los productos al frontend y que no esté vacío
    cy.get('.productos-list').should('be.visible'); // productos visibles
    cy.get('.producto-card').should('have.length.greaterThan', 0); //productos > 0
  });

  it('2. Debe validar el flujo de compra: Agregar un producto al carrito', () => {
    // Simula la acción del usuario en el frontend
    cy.contains('Agregar').first().click(); //first(), primer boton. 
    // Abrir carrito
    cy.get('.btn-carrito').click();
    // Valida el flujo: el carrito ya no dice que está vacío
    cy.get('.carrito-section').should('not.contain', 'El carrito está vacío'); //Que no contenga 'El carrito está vacío'
    cy.get('.carrito-item').should('be.visible'); //carrito visible (<li>)
  });

  it('3. Debe validar la persistencia de datos (Recargar la página)', () => {
    // Agregamos un producto para asegurar que impacte en la base de datos (MongoDB)
    cy.contains('Agregar').first().click();
    // Simulamos que el usuario cierra o recarga la pestaña del navegador
    cy.reload();
    // Abrir carrito
    cy.get('.btn-carrito').click();
    // Verificación de persistencia: Al volver a cargar, los datos deben seguir viniendo del backend
    cy.get('.carrito-section').should('not.contain', 'El carrito está vacío');
    cy.get('.carrito-item').should('be.visible');
  });

  it('4. Debe validar el flujo de compra completo: Eliminar un producto del carrito', () => {
    // Abrir carrito
    cy.get('.btn-carrito').click();
    // 1. Buscamos cuántos elementos hay en el carrito antes de borrar
    cy.get('.carrito-section').then(($section) => { //.carrito-section lo mete dentro de $section
      // Si el carrito estaba vacío, agregamos uno para poder borrarlo
      if ($section.text().includes('El carrito está vacío')) {
        cy.contains('Agregar').first().click();
      }
      
      // 2. Tomamos la cantidad de productos actuales
      cy.get('.carrito-item').then(($itemsBefore) => {
        const countBefore = $itemsBefore.length;

        // 3. Hacemos clic en el primer botón Eliminar
        cy.get('.btn-eliminar').first().click();

        // 4. Verificamos que ahora haya MENOS elementos o que el cartel de vacío haya aparecido
        cy.get('.carrito-section').then(($sectionAfter) => {
          if ($sectionAfter.text().includes('El carrito está vacío')) {
            // Si quedó vacío, el test es exitoso
            cy.contains('El carrito está vacío').should('be.visible');
          } else {
            // Si todavía quedan otros productos, validamos que la lista se redujo en 1
            cy.get('.carrito-item').should('have.length', countBefore - 1);
          }
        });
      });
    });
  });
});