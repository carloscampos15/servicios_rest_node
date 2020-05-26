"use strict";

var User = require("./../models/User");

var UserController = {
  updateProfile: function (req, res) {
    return res.status(202).send({
      message: "Funcion update controller",
    });
  },
  searchUsers: function (req, res) {
    // Obtener los datos que llegan del frontend
    var params = req.body;

    //Realizar la busqueda de los usuarios por el email con respecto a los que coincidan
    User.find({ email: new RegExp(params.search, "i") }, (err, users) => {
      try {
        //Limpiar los datos
        var emails = [];
        users.forEach((user) => {
          emails.push(user.email);
        });

        //retornar los usuarios
        return res.status(202).send({
          emails: emails,
        });
      } catch (err) {
        return res.status(500).send({
          message: "Error al realizar la consulta",
        });
      }
    });
  },
};

module.exports = UserController;
