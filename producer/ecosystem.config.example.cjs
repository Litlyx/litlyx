module.exports = {
    apps: [
        {
            name: 'producer',
            port: '3000',
            exec_mode: 'cluster',
            instances: '1',
            script: './dist/broker/src/index.js',
            env: {
                PORT: "",
                REDIS_URL: "",
                REDIS_USERNAME: "",
                REDIS_PASSWORD: "",
                STREAM_NAME: ""
            }
        }
    ]
}