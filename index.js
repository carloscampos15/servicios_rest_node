'use stric'

var mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/distribuidos8', {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log("Conexion establecida");
            })
            .catch(error => console.log(error));