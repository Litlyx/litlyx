module.exports = {
    apps: [
        {
            name: 'consumer-limits',
            exec_mode: 'fork',
            script: './dist/consumer-limits/src/index.js',
            env: {
                EMAIL_SERVICE: "",
                BREVO_API_KEY: "",
                MONGO_CONNECTION_STRING: "",
                REDIS_URL: "",
                REDIS_USERNAME: "",
                REDIS_PASSWORD: "",
                STREAM_NAME: "",
                GROUP_NAME: ""
            }
        }
    ]
}