module.exports = {
    apps: [
        {
            name: 'QueueBroker',
            port: '3000',
            exec_mode: 'cluster',
            instances: '2',
            script: './dist/broker/src/index.js',
            env: {
                EMAIL_SERVICE: "",
                EMAIL_HOST: "",
                EMAIL_USER: "",
                EMAIL_PASS: "",
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