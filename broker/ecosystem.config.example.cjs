module.exports = {
    apps: [
        {
            name: 'QueueBroker',
            port: '3999',
            exec_mode: 'fork',
            script: './dist/producer/src/index.js',
            env: {
                EMAIL_SERVICE: "",
                BREVO_API_KEY: "",
                PORT: "",
                MONGO_CONNECTION_STRING: "",
                REDIS_URL: "",
                REDIS_USERNAME: "",
                REDIS_PASSWORD: "",
                STREAM_NAME: ""
            }
        }
    ]
}