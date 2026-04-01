// API
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuarios");

// Get all reports
// req = request, body {} params url?param1=datos
// res
exports.getProductos = async (req , res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({error: "Eror al obtener productos", message: error.message});
    }
}

// Create new product
// error 400 es bad request y 500 es error en el api
exports.createProducto = async (req, res ) => {
    console.log("USER:", req.user);
    try {
        const {nombreProducto, descripcion, precio, stock, categoria, productor, ubicacion} = req.body; // solo se puede cuando es un objeto


        // logica inteligente para determinar el nivel de stock
        let nivelStock = "alto";
        let alerta = "";
        let estado = "disponible";

        
        const usuarioDB = await Usuario.findById(req.user.usuario.id);


        if (!usuarioDB) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const umbralStockBajo = usuarioDB.umbralStockBajo;
        const umbralStockMedio = usuarioDB.umbralStockMedio;

        //stock / logica inteligente para determinar el nivel de stock
        if (stock === 0) {
         nivelStock = "bajo";
         estado = "agotado";
         alerta = "Producto agotado";
        }
        else if (stock < umbralStockBajo) {
            nivelStock  = "bajo";
            alerta = "Stock bajo, considera reabastecer pronto.";
        }
        else if  (stock < umbralStockMedio) {
            nivelStock = "medio";
            alerta = "Stock medio, Se recomienda realizar un pedido pronto para evitar que se agote.";
        }
        
        const NuevoProducto =  new Producto ({
        nombreProducto,
        descripcion,
        precio,
        stock,
        categoria,
        productor,
        ubicacion,
        nivelStock,
        alerta,
        estado,
        negocioId: req.user?.usuario?.id
       });

       await NuevoProducto.save();

       res.status(200).json(NuevoProducto); 
    } catch (error) {
        console.log(error);
        res.status(400).json({error: "Error al crear productos", message : error});
    }
}


exports.getBajoStock = async (req, res) => {
    try {
        const productos = await Producto.find({
        nivelStock: "bajo",
        negocioId: req.user.usuario.id
    })
        res.json(productos);
    } catch (error) {
        res.status(500).json({error: "Error", message: error.message});
    }
}


exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock, precio } = req.body;

        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const usuarioDB = await Usuario.findById(req.user.usuario.id);

        if (!usuarioDB) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // actualizar campos
        if (stock !== undefined) producto.stock = stock;
        if (precio !== undefined) producto.precio = precio;

        // lógica inteligente (igual a la tuya)
        let nivelStock = "alto";
        let alerta = "";
        let estado = "disponible";

        if (producto.stock === 0) {
            nivelStock = "bajo";
            estado = "agotado";
            alerta = "Producto agotado";
        } else if (producto.stock < usuarioDB.umbralStockBajo) {
            nivelStock = "bajo";
            alerta = "Stock bajo, considera reabastecer pronto.";
        } else if (producto.stock < usuarioDB.umbralStockMedio) {
            nivelStock = "medio";
            alerta = "Stock medio, Se recomienda realizar un pedido pronto para evitar que se agote.";
        }

        producto.nivelStock = nivelStock;
        producto.alerta = alerta;
        producto.estado = estado;

        await producto.save();

        res.json(producto);

    } catch (error) {
        res.status(500).json({ error: "Error al actualizar producto", message: error.message });
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await producto.deleteOne();

        res.json({ message: "Producto eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto", message: error.message });
    }
};
