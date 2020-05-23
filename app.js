'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express
var app = express();

//Cargar rutas
var userRoutes = require('./routes/Auth');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Rutas
app.use('/api', userRoutes);

//exportamos el modulo
module.exports = app;