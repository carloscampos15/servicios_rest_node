"use strict";

var User = require("./../models/User");

var UserController = {
  index: function (req, res) {
    var user = req.user;
    //Validar que el usuario tiene permiso para acceder a esta accion
    if (user.role == "ADMIN") {
      User.find({ role: "USER" }, (err, users) => {
        try {
          //Limpiar los datos
          users.forEach((user) => {
            user.received_messages = undefined;
            user.sended_messages = undefined;
            user.password = undefined;
          });

          //retornar los usuarios
          return res.status(202).send({
            status: "success",
            users: users,
          });
        } catch (err) {
          return res.status(500).send({
            status: "error",
            message: "Error al realizar la consulta",
          });
        }
      });
    } else {
      return res.status(404).send({
        status: "error",
        message: "No tienes acceso a este recurso",
      });
    }
  },
  updateProfile: function (req, res) {
    return res.status(202).send({
      message: "Funcion update controller",
    });
  },
  search: function (req, res) {
    // Obtener los datos que llegan del frontend
    var params = req.body;

    //Realizar la busqueda de los usuarios por el email con respecto a los que coincidan
    User.find({ email: new RegExp(params.search, "i") }, (err, users) => {
      try {
        //Limpiar los datos
        var emails = [];
        users.forEach((user) => {
          if (user.role == "USER") {
            emails.push(user.email);
          }
        });

        //retornar los usuarios
        return res.status(202).send({
          status: "success",
          emails: emails,
        });
      } catch (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al realizar la consulta",
        });
      }
    });
  },
  show: function (req, res) {
    // Obtener los datos en la ruta, en este caso el id
    var user_id = req.params.user_id;
    var user = req.user;

    //Validar que el usuario tiene permiso para acceder a esta accion
    if (user.role == "ADMIN") {
      //Realizar la busqueda de los usuarios por el email con respecto a los que coincidan
      User.findOne({ _id: user_id }, (err, user) => {
        try {
          //Si el usuario no existe devolver una respuesta
          if (!user) {
            return res.status(404).send({
              status: "error",
              message: "El usuario no existe",
            });
          }

          //Limpiar los datos
          user.received_messages = undefined;
          user.sended_messages = undefined;
          user.password = undefined;

          //retornar los usuarios
          return res.status(202).send({
            status: "success",
            user: user,
          });
        } catch (err) {
          return res.status(500).send({
            status: "error",
            message: "Error al realizar la consulta",
          });
        }
      });
    } else {
      return res.status(404).send({
        status: "error",
        message: "No tienes acceso a este recurso",
      });
    }
  },
  delete: function (req, res) {
    // Obtener los datos en la ruta, en este caso el id
    var user_id = req.params.user_id;
    var user = req.user;

    //Validar que el usuario tiene permiso para acceder a esta accion
    if (user.role == "ADMIN") {
      try {
        //Realizar la accion de borrado, si no encuentra al usuario
        //responder que ese usuario no se encontro
        User.deleteOne({ _id: user_id }, (err) => {
          if (err) {
            return res.status(404).send({
              status: "error",
              message: "No se encontro el recurso",
            });
          }
          return res.status(202).send({
            status: "success",
            message: "Usuario eliminado",
          });
        });
      } catch (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al realizar la consulta",
        });
      }
    } else {
      return res.status(404).send({
        status: "error",
        message: "No tienes acceso a este recurso",
      });
    }
  },
};

module.exports = UserController;
