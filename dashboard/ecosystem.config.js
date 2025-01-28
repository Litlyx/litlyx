module.exports = {
    apps: [
        {
            name: 'Dashboard',
            port: '3010',
            exec_mode: 'fork',
            script: './.output/server/index.mjs',
        }
    ]
}