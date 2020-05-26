'use stric'

var mongoose = require("mongoose")
var app = require("./app");
var port = process.env.PORT || 3999;

//Conexion a la base de datos
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/distribuidos8', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            //Conexion del servidor
            console.log("Connection established with mongodb");
            app.listen(port, () => {
                console.log("Executing server http://localhost:3999");                    
            })
        })
        .catch(error => console.log(error));