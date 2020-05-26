"use strict";

var validator = require("./../../helpers/Validate");
var bcrypt = require("bcrypt");
var User = require("./../../models/User");
var jwt = require("./../../services/Jwt");

var RegisterController = {
  register: function (req, res) {
    //Obtener los datos
    var params = req.body;

    //Establecer reglas de validacion
    const validationRule = {
      name: "required|string",
      lastname: "required|string",
      email: "required|email",
      password: "required|string",
    };

    // Validar los datos, en caso de que entren datos erroneos no dejara seguir con el proceso
    validator(params, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: "Register failed",
          data: err,
        });
      } else {
        var user = new User();
        user.name = params.name;
        user.lastname = params.lastname;
        user.email = params.email;

        if(params.role){
          user.role = params.role;
        }

        //Buscar el usuario en la base de datos
        User.findOne({ email: user.email }, function (err, issetUser) {
          try {
            if (!issetUser) {
              // Si no existe el usuario cifrar la contraseña, el valor de 5 quiere decir que la
              // clave se esta cifrando 5 veces
              bcrypt.hash(params.password, 5, (err, hash) => {
                user.password = hash;
                // Guardar el usuario
                user.save((err, userStored) => {
                  try {
                    if (!userStored) {
                      return res.status(400).send({
                        message: "El usuario no se ha guardado",
                      });
                    }

                    //Primero limpiar el objeto user para evitar entregar informacion
                    //que no debe ser visible
                    user.password = undefined;

                    return res.status(200).send({
                      message: "Register succesfull",
                      status: "success",
                      user,
                      token: jwt.createToken(user),
                    });
                  } catch (err) {
                    return res.status(500).send({
                      message: "Error al guardar el usuario",
                    });
                  }
                });
              });
            } else {
              return res.status(400).send({
                message: "El email ya se encuentra registrado",
              });
            }
          } catch (err) {
            return res.status(500).send({
              message: "Error al comprobar duplicidad de los datos",
            });
          }
        });
      }
    });
  },
};

module.exports = RegisterController;
