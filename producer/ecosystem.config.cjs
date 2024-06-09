module.exports = {
    apps: [
        {
            name: 'Producer',
            port: '3000',
            exec_mode: 'fork',
            script: './dist/producer/src/index.js',
            env: {
                PORT: "8088",
                REDIS_URL: "redis://litlyx.com",
                REDIS_USERNAME: "default",
                REDIS_PASSWORD: "cameriera",
                STREAM_NAME: "lib-events"
            }
        }
    ]
}