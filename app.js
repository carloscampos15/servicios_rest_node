'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express
var app = express();

//Cargar rutas
var authRoutes = require('./routes/Auth');
var userRoutes = require('./routes/User');
var messageRoutes = require('./routes/Message');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/message', messageRoutes);

//exportamos el modulo
module.exports = app;