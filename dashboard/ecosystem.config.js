module.exports = {
    apps: [
        {
            name: 'dashboard',
            port: '3010',
            exec_mode: 'fork',
            script: './.output/server/index.mjs',
        }
    ]
}