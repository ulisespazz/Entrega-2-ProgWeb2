import React, { useState, useEffect } from 'react'; 
import Swal from 'sweetalert2';
import './App.css';

function App() {
  // Estados para guardar la información que viene de tu Flask API
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Sincroniza el estado local del carrito con los datos del Backend
  const obtenerCarrito = () => {          
  fetch('http://localhost:5000/carrito') // consulta carrito
    .then(response => response.json())   // traduce a json
    .then(data => setCarrito(data));     // se guarda en setCarrito (actualiza la pantalla automáticamente)
  };

  // Envía el ID del producto a Flask mediante una petición POST
  const agregarAlCarrito = async (id) => {
    try {
      await fetch('http://localhost:5000/carrito/add', {  
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
      });
      obtenerCarrito();
      obtenerTotal();   //total
      Swal.fire({
        title: '¡Agregado!',
        text: 'Producto Agregado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Envía una petición DELETE a Flask usando el ID 
  const eliminarDelCarrito = async (id) => {
  try {
    await fetch(`http://localhost:5000/carrito/${id}`, {
      method: 'DELETE'
    });
    obtenerCarrito();
    obtenerTotal();      //total
    Swal.fire({
      title: '¡Eliminado!',
      text: 'Producto Eliminado',
      icon: 'info',
      showConfirmButton: false,
      timer: 1000
    });
  } catch (error) {
    console.error(error);
  }};

  // Consulta el endpoint del total acumulado y actualiza el estado local
  const obtenerTotal = () => {
  fetch('http://localhost:5000/carrito/total') // consulta precio final
    .then(response => response.json())         // traduce el numero
    .then(data => setTotal(data.total));       // actualiza el cartel en pantalla
  };

  const pagar = async () => {
  try {
    await fetch("http://localhost:5000/carrito", {
      method: "DELETE"
    });

    obtenerCarrito();
    obtenerTotal();

    Swal.fire({
      title: "¡Gracias por tu compra!",
      text: "Tu pedido fue realizado con éxito.",
      icon: "success"
    });

  } catch (error) {
    console.error(error);
  }};

  // useEffect se ejecuta automáticamente cuando se abre la página
  useEffect(() => {
    // Traer todos los productos
    fetch('http://localhost:5000/productos')                             
      .then(response => {
        if (!response.ok) throw new Error('Error al traer productos');
        return response.json();
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message));

    // Traer el estado actual del carrito
    fetch('http://localhost:5000/carrito')  
      .then(response => {
        if (!response.ok) throw new Error('Error al traer el carrito');
        return response.json();
      })
      .then(data => setCarrito(data))
      .catch(err => setError(err.message));
      obtenerTotal();
  }, []); // Los [] aseguran que solo se ejecute una vez al cargar

  return (
    <>
      <nav className="navbar">
        <h1>Bebidas Ya</h1>

        <button
          className="btn-carrito"
          onClick={() => setMostrarCarrito(!mostrarCarrito)}
        >
          🛒 ({carrito.length})
        </button>
      </nav>
      <div className="container">
        {error && <p className="error-msg">Hubo un problema: {error}</p>}
        <div className="shop-layout">
          
          <section className="productos-section">                   {/*seccion productos*/}
            <h2>Productos Disponibles</h2>
            <div className="productos-list">
              {productos.map((producto) => (
                <div key={producto.id} className="producto-card">
                  
                  {/* --- AGREGAMOS LA FOTO ACÁ --- */}
                  {producto.imagen && (
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre} 
                      className="producto-foto" 
                    />
                  )}

                  <h3>{producto.nombre || `Producto ${producto.id}`}</h3>
                  <p className="precio">${producto.precio}</p>
                  <button className="btn-agregar"
                  onClick={() => agregarAlCarrito(producto.id)}
                  >
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </section>

          {mostrarCarrito && (
          <section className="carrito-section">                 {/*seccion carrito*/}
            <h2>Tu Carrito</h2>
            {carrito.length === 0 ? (
              <p>El carrito está vacío</p>
            ) : (
              <ul className="carrito-list">
                {carrito.map((item, index) => (
                  <li key={index} className="carrito-item">
                    <h3>{item.nombre}</h3>
                    <p className="precio">${item.precio}</p>
                    <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}> 
                      Eliminar 
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="total-container">
              <span>Total:</span>
              <span style={{ color: '#2e7d32' }}>${total}</span>
            </div>
            <button className="btn-pagar" onClick={pagar}>
                Pagar
            </button>
          </section>)}

        </div>
      </div>
    </>
  );
}

export default App;