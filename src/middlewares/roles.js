exports.verAdmin = function(req, res, next) {
    if(req.user.rol !== "Admin") return res.status(403).send({mensaje: "Solo puede acceder el Admin"})
    
    next();
}

exports.verEmpresa = function(req, res, next) {
    if(req.user.rol !== "Cliente") return res.status(403).send({mensaje: "Solo puede acceder la Empresa"})
    
    next();
}
