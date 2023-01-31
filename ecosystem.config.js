module.exports = {
    apps: [
        {
            name: 'nest-chat',
            exec_mode: 'cluster',
            instances: 'max',
            script: './dist/main.js',
            args: '',
        },
    ],
    deploy: {
        staging: {
            user: 'admin',
            host: ['45.251.114.197'],
            ref: 'origin/master',
            repo: 'git@github.com:duyphan2398/nest-chat.git',
            ssh_options: ['ForwardAgent=yes'],
            path: '/var/www/CHAT/nest-chat/',
            'post-deploy': 'npm install && npm run build &&  pm2 start dist/main.js --name "nest-chat" -- run "start:prod"',
        },
    }
}
