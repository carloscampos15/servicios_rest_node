"use strict";

var validator = require("validator");
var bcrypt = require("bcrypt");
var User = require("./../../models/User");

var RegisterController = {
  register: function (req, res) {
    //Obtener los datos
    var params = req.body;

    //validar los datos
    var validateName = !validator.isEmpty(params.name);
    var validateLastName = !validator.isEmpty(params.lastname);
    var validateEmail =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validatePassword = !validator.isEmpty(params.password);

    if (validateName && validateLastName && validateEmail && validatePassword) {
      var user = new User();
      user.name = params.name;
      user.lastname = params.lastname;
      user.email = params.email;

      User.findOne({ email: user.email }, function (err, issetUser) {
        try {
          if (!issetUser) {
            // Si no existe el usuario cifrar la contraseña
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
                  return res.status(200).send({ user: userStored });
                } catch (err) {
                  return res.status(500).send({
                    message: "Error al guardar el usuario",
                  });
                }
              });
            });
          } else {
            return res.status(200).send({
              message: "El usuario ya se encuentra registrado",
            });
          }
        } catch (err) {
          return res.status(500).send({
            message: "Error al comprobar duplicidad de los datos",
          });
        }
      });
    } else {
      return res.status(200).send({
        message: "Campos vacios",
      });
    }
  },
};

module.exports = RegisterController;
