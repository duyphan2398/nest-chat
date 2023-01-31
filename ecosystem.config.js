module.exports = {
    apps : [
        {
            name: "nest-chat",
            script: "./dist/main.js",
            watch: true,
            instance_var: [
                'ENV_NAME',
                'DB_HOST',
                'DB_PORT',
                'DB_DATABASE',
                'DB_USERNAME',
                'DB_PASSWORD',
                'FALLBACK_LANGUAGE',
                'TZ',
                'IMAGE_SERVER_DOMAIN'
            ],
        }
    ]
}
