module.exports = {
    apps: [
        {
            name: 'security',
            exec_mode: 'fork',
            script: './dist/security/src/index.js',
            env: {
                MONGO_CONNECTION_STRING: "",
                EMAIL_SERVICE: "",
                BREVO_API_KEY: ""
            }
        }
    ]
}