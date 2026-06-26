from pymongo import MongoClient
# conexión con MongoDB
client = MongoClient("mongodb://localhost:27017/")

# base de datos
db = client["tp_integrador"]
# colección de productos
productos_collection = db["productos"]
# colección del carrito
carrito_collection = db["carrito"]