const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    // res.sendfile(global.config.rootPath+'/server/views/index.html');
    res.status(200).send({ message: "Welcome to APi." });
});

router.use('/auth',require('./auth/auth'));

module.exports = router;
