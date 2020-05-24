'use strict'

var UserController = {
    updateProfile: function (req, res) {
        return res.status(202).send({
            message: 'Funcion update controller'
        });
    }
};

module.exports = UserController;