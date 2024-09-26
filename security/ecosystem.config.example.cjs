module.exports = {
    apps: [
        {
            name: 'security',
            exec_mode: 'fork',
            script: './.output/security/src/index.mjs',
            env: {
                MONGO_CONNECTION_STRING: "",
                EMAIL_SERVICE: "",
                BREVO_API_KEY: ""
            }
        }
    ]
}