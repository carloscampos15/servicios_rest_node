"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "miperrocat539";

exports.authenticated = function (req, res, next) {
  // Comprobar si llega autorizacion
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "Falta authorizacion en la cabecera de la peticion",
    });
  }

  // Limpiar el token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    // Decodificar token
    var payload = jwt.decode(token, secret);

    // Comprobar si el roken ha expirado
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: "El token ha expirado",
      });
    }
  } catch (ex) {
    return res.status(401).send({
      message: "El token no es valido",
    });
  }

  // Adjuntar usuario identificado a request
  req.user = payload;

  // Pasar a la accion
  next();
};
