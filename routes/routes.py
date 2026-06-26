from flask import jsonify, request
from database.conexion import productos_collection, carrito_collection

# GET productos
def traer_productos():
    # trae todos los productos de Mongo y convierte a lista
    productos = list(productos_collection.find({}, {"_id": 0}))
    return jsonify(productos)

# GET carrito
def ver_carrito():
    # trae productos de Mongo del carrito y convierte a lista
    carrito = list(carrito_collection.find({}, {"_id": 0}))
    return jsonify(carrito)

# POST carrito
def agregar_carrito():
    # obtiene los datos json enviados por el cliente
    datos = request.get_json()
    # obtiene el id
    id_producto = datos.get("id")

    # busca el producto en Mongo
    producto = productos_collection.find_one(
        {"id": id_producto},
        {"_id": 0}
    )
    # si existe en la BD, lo agrega al carrito sino error
    if producto:
        carrito_collection.insert_one(producto)
        return jsonify({
            "mensaje": "Producto agregado al carrito"
        })
    return jsonify({
        "error": "Producto no encontrado"
    }), 404


# DELETE carrito
def eliminar_carrito(id):
    # borra producto por id
    resultado = carrito_collection.delete_one({"id": id})
    # si se elimino al menos un producto, confirma eliminación sino error
    if resultado.deleted_count > 0:
        return jsonify({
            "mensaje": "Producto eliminado"
        })
    return jsonify({
        "error": "Producto no encontrado en carrito"
    }), 404


# GET total
def obtener_total():
    # trae productos de Mongo del carrito y convierte a lista
    carrito = list(carrito_collection.find({}, {"_id": 0}))

    total = 0
    # recorre productos para sumar precios
    for producto in carrito:
        total += producto["precio"]

    return jsonify({
        "total": total
    })