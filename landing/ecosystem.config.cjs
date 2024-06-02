module.exports = {
    apps: [
        {
            name: 'Landing',
            port: '3009',
            exec_mode: 'fork',
            script: './.output/server/index.mjs',
        }
    ]
}