from flask import Flask
from flask_cors import CORS

from routes.routes import (
    traer_productos,
    agregar_carrito,
    eliminar_carrito,
    obtener_total,
    ver_carrito
)
# creamos la aplicación
app = Flask(__name__)
# permite que React acceda a las APIs
CORS(app)
# endpoints
app.route('/productos', methods=['GET'])(traer_productos)
app.route('/carrito', methods=['GET'])(ver_carrito)
app.route('/carrito/add', methods=['POST'])(agregar_carrito)
app.route('/carrito/<int:id>', methods=['DELETE'])(eliminar_carrito)
app.route('/carrito/total', methods=['GET'])(obtener_total)


# Ejecuta la aplicación Flask
#if __name__ == '__main__':
#    app.run(debug=True)