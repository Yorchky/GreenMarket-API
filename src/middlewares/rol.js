const checkRole = (rolPermitido) => {
    return (req, res, next) => {

        console.log("ROL DEL TOKEN:", req.user.usuario.rol); 
        console.log("ROL REQUERIDO:", rolPermitido); 


        if (req.user.usuario.rol !== rolPermitido) {
            return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
        }
        console.log("ROL:", req.user.usuario.rol);
        next();
    };
};

module.exports = checkRole;