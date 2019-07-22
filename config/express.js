const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const express = require("express");
const boom = require('express-boom-2');

module.exports = (app, config) =>
{
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ extended: true }));
    app.use(boom());

    app.disable('x-powered-by');

    app.set('views', path.join(config.rootPath, 'public/partials'));
    app.use(express.static(path.join(config.rootPath, 'public')));

    app.use('/modules',express.static(config.rootPath + "node_modules"));

    app.use(require(config.rootPath + 'server/routes'));
    app.all('*', (req, res, next) =>
    {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    app.use((req, res) => {
        res.boom.notFound();
    });

    app.listen(global.config.port, () =>
    {
        console.log('App running on '+ global.config.port);
    });
};
