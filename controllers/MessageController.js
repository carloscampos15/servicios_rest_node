"use strict";

var Message = require("./../models/Message");
var validator = require("./../helpers/Validate");
var User = require("./../models/User");

var MessageController = {
  create: function (req, res) {
    // Obtener los datos que llegan del frontend
    var params = req.body;
    var userEmisor = req.user;

    // Establecer reglas de validacion para el post
    const validationRule = {
      receptors: "required|array",
      subject: "required|string",
      body: "required|string",
    };

    // Validar los datos, si llegan en un formato que no cumpla las reglas retornara un error
    validator(params, validationRule, {}, (err, status) => {
      if (!status) {
        return res.status(412).send({
          success: false,
          message: "Insert failed",
          data: err,
        });
      } else {
        // Asignar clave email para cada receptor en el array de receptores
        params.receptors.forEach((email, index) => {
          params.receptors[index] = { email: email };
        });

        // Crear el mensaje
        var message = new Message();
        message.sender_id = userEmisor.sub;
        message.sender_email = userEmisor.email;
        message.receptors = params.receptors;
        message.subject = params.subject;
        message.body = params.body;
        message.state = "RECIBIDO";

        // Guardar el mensaje
        message.save((err, messageStored) => {
          try {
            // Si el usuario no se guarda retornar error
            if (!messageStored) {
              return res.status(400).send({
                message: "El mensaje no se ha guardado",
              });
            }

            // Agregar el mensaje a los usuarios que lo rebiciran
            params.receptors.forEach((receptor) => {
              User.findOneAndUpdate(
                { email: receptor.email },
                { $push: { received_messages: messageStored } },
                (err, result) => {}
              );
            });

            // Agregar el mensaje enviado al usuario que lo envio
            messageStored.state = "ENVIADO";
            User.findOneAndUpdate(
              { email: userEmisor.email },
              { $push: { sended_messages: messageStored } },
              (err, result) => {}
            );

            //Una vez guardado el mensaje, devolverlo al usuario con un codigo success
            return res.status(200).send({
              status: "success",
              message: "Mensaje guardado con exito",
            });
          } catch (err) {
            return res.status(500).send({
              message: "Error al enviar el mensaje",
            });
          }
        });
      }
    });
  },
  inbox: function (req, res) {
    var user = req.user;

    User.findOne({ email: user.email }, (err, user) => {
      try {
        return res.status(200).send({
          status: "success",
          messages: user.received_messages,
        });
      } catch (err) {
        return res.status(500).send({
          message: "Error al obtener la informacion",
        });
      }
    });
  },
  outbox: function (req, res) {
    var user = req.user;
    User.findOne({ email: user.email }, (err, user) => {
      try {
        return res.status(200).send({
          status: "success",
          messages: user.sended_messages,
        });
      } catch (err) {
        return res.status(500).send({
          message: "Error al obtener la informacion",
        });
      }
    });
  },
  showReceive: function (req, res) {
    var user = req.user;
    User.findOne({ email: user.email }, (err, user) => {
      var message;

      user.received_messages.forEach((item, index) => {
        if (item._id == req.params.message_id) {
          message = item;
          User.updateOne(
            { _id: user.id, "received_messages._id": message._id },
            { $set: { "received_messages.$.state": "VISTO" } },
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      });

      if (!message) {
        return res.status(404).send({
          message: "No se encontro el recurso",
        });
      }

      try {
        return res.status(200).send({
          status: "success",
          message: message,
        });
      } catch (err) {
        return res.status(500).send({
          message: "Error al obtener la informacion",
        });
      }
    });
  },
  showSend: function (req, res) {
    var user = req.user;
    User.findOne({ email: user.email }, (err, user) => {
      var message;

      user.sended_messages.forEach((item) => {
        if (item._id == req.params.message_id) {
          message = item;
        }
      });

      if (!message) {
        return res.status(404).send({
          message: "No se encontro el recurso",
        });
      }

      try {
        return res.status(200).send({
          status: "success",
          message: message,
        });
      } catch (err) {
        return res.status(500).send({
          message: "Error al obtener la informacion",
        });
      }
    });
  },
  deleteInbox: function (req, res) {
    var user = req.user;

    User.findOne({ email: user.email }, (err, user) => {
      var message;

      user.received_messages.forEach((item) => {
        if (item._id == req.params.message_id) {
          message = item;
        }
      });

      if (!message) {
        return res.status(404).send({
          message: "No se encontro el recurso",
        });
      }

      try {
        user.received_messages.forEach((element, index) => {
          if (element._id == req.params.message_id) {
            user.received_messages.splice(index, 1);
          }
        });

        user.save();
        console.log(user);

        return res.status(200).send({
          status: "success",
          message: "mensaje eliminado",
        });
      } catch (err) {
        return res.status(500).send({
          message: "Error al obtener la informacion",
        });
      }
    });
  },
};

module.exports = MessageController;
