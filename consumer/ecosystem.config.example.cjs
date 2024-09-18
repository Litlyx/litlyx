module.exports = {
    apps: [
        {
            name: 'consumer',
            exec_mode: 'fork',
            script: './dist/consumer/src/index.js',
            env: {
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