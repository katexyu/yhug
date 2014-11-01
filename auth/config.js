var config = {
    test:{
        clientID: '303717226484450',
        clientSecret: 'cfe0a1a6bc5c909edc1da81c46867d68',
        callbackURL: "http://localhost:8080/auth/facebook/callback"
    },
    production: {
        clientID: 'SECRET',
        clientSecret: 'SECRET',
        callbackURL: "http://yhug-kateyu.rhcloud.com/auth/facebook/callback"
    }
}

module.exports = config;