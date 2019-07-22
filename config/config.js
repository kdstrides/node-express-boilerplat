let path = require('path');
let rootPath = path.normalize(__dirname + '/../');

module.exports = {
    development: {
        appName : 'ProjectName',
        appEmail : 'dipeshbeckham@gmail.com',
        db: 'mongodb://localhost/bolierplat',
        rootPath: rootPath,
        port: process.env.PORT || 1987,
        secretKey : '3rQ8rG1kIj1M?k%^NYKiBiBdfsSl|0h!=04kzJTtrT8nnEcEf2lspueoP5ESw0h4YUM^E?sinZ8!UvZIeWXMEnYuVaJkQDB&B&1?',
        perPageLimit : 30,
        sessionTable: "are-you-kidding-me-session",
        sessionId: "6211290444"
    },
    production: {
        appName : 'ProjectName',
        appEmail : 'dipeshbeckham@gmail.com',
        rootPath: rootPath,
        db: 'PRODUCTION_MONGODB_CONNECTION_STRING',
        port: process.env.PORT || 80,
        secretKey : 'LUXI1jeXrF=F|cQI-C^P%znRL|kRCNy2jq=+xZBz#675##Q+W?yC-d3b4T3&TT*O9WYt?eodFUbgBJ|71k5!&6O#xP=nR9jvw*bo',
        perPageLimit : 30,
        sessionTable: "woah-production-session",
        sessionId: "9722154363"
    },
    Other: {
        appName : 'ProjectName',
        appEmail : 'dipeshbeckham@gmail.com',
        rootPath: rootPath,
        db: 'OTHER_MONGODB_CONNECTION_STRING',
        port: process.env.PORT || 9090,
        secretKey : '6%db1|fR9poyWWxNDi#QvmCq=$d%M_OWhM@KB9#?@*96#yzM!luY7jaAY?j2=F-Bqs&Yz+Wl%Uq|&bshEnl$ioBGLREI$yd^e9EF',
        perPageLimit : 30,
        sessionTable: "good-heroku-session",
        sessionId: "9364053624"
    }
};
