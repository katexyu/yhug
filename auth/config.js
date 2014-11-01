var config = {
    test:{
        clientID: 'SECRET',
        clientSecret: 'SECRET',
        callbackURL: "http://localhost:8080/auth/facebook/callback"
    },
    production: {
        clientID: 'SECRET',
        clientSecret: 'SECRET',
        callbackURL: "http://yhug-kateyu.rhcloud.com/auth/facebook/callback"
    }
}

module.exports = config;