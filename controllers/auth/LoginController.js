"use strict";

var validator = require("./../../helpers/Validate");
var bcrypt = require("bcrypt");
var User = require("./../../models/User");
var jwt = require("./../../services/Jwt");

var LoginController = {
  login: function (req, res) {
    //Obtener los datos
    var params = req.body;

    //Establecer reglas de validacion para el post
    const validationRule = {
      email: "required|email",
      password: "required|string",
    };

    //Validar los datos
    validator(params, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: "Login failed",
          data: err,
        });
      } else {
        //Buscar el usuario en la base de datos
        User.findOne({ email: params.email }, (err, user) => {
          try {
            //Si el usuario no existe devolver una respuesta
            if (!user) {
              return res.status(404).send({
                message: "El usuario no existe",
              });
            }

            //Si el usuario existe comprobar que la clave ingresada coincide
            bcrypt.compare(params.password, user.password, (err, check) => {
              //Comprobar si la clave es correcta
              if (check) {
                //Primero limpiar el objeto user para evitar entregar informacion
                //que no debe ser visible
                user.password = undefined;

                return res.status(200).send({
                  message: "Login succesfull",
                  status: "success",
                  user,
                  token: jwt.createToken(user)
                });
              } else {
                return res.status(400).send({
                  message: "Login error",
                  status: "error",
                });
              }
            });
          } catch (err) {
            return res.status(500).send({
              message: "Error al realizar la consulta",
            });
          }
        });
        // return res.status(200).send({
        //   message: "Hola mundo",
        // });
      }
    });
  },
};

module.exports = LoginController;
