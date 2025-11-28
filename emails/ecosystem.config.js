module.exports = {
    apps: [
        {
            name: 'email-service',
            port: '3020',
            exec_mode: 'cluster',
            instances: '1',
            script: './dist/src/index.js',
            env: {}
        }
    ]
}