const Usuario = require("../models/Usuarios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUsuario = async (req, res) => {
    try {
        const { email, password, rol } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(401).json({ msg: "El Usuario ya existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        // Validar rol permitido
        let rolFinal = "user";

        if (rol === "admin") {
            rolFinal = "admin";
        }

        const nuevoUsuario = new Usuario({
            email,
            password: newPassword,
            rol: rolFinal
        });

        await nuevoUsuario.save();

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({
            msg: "Error creando usuario",
            error: error.message,
        });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (!usuario) return res.status(400).json({ msg: "Usuario no existe. Credencial inválida" });

        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) return res.status(400).json({ msg: "Password incorrecta. Credencial inválida" });

        const payload = {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            },
        );
    } catch (error) {
        res.status(500).json({
            error: "Error en el servidor",
            message: error.message,
        });
    }
};

exports.getPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.usuario.id).select("-password");

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            error: "Error en el servidor", message: error.message
        });
    }
};

exports.actualizarPerfil = async (req, res) => {
    try {
        const { nombreNegocio, descripcion, umbralStockBajo, umbralStockMedio } = req.body;

        const camposActualizar = {};

        if (nombreNegocio !== undefined) camposActualizar.nombreNegocio = nombreNegocio;
        if (descripcion !== undefined) camposActualizar.descripcion = descripcion;
        if (umbralStockBajo !== undefined) camposActualizar.umbralStockBajo = umbralStockBajo;
        if (umbralStockMedio !== undefined) camposActualizar.umbralStockMedio = umbralStockMedio;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.user.usuario.id,
            { $set: camposActualizar },
            { new: true }
        ).select("-password");

        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el perfil", message: error.message });
    }
};