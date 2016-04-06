module.exports = function (grunt) {
    var proxyConfiguration = require('grunt-connect-proxy/lib/utils').proxyRequest;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            eslint: {
                target: ['web/**/*.js']
            },
            server: {
                options: {
                    port: grunt.option("port") || 8080,
                    hostname: 'localhost',
                    logger: 'dev',
                    keepalive: true,
                    middleware: function (connect) {
                        return [
                            proxyConfiguration,
                            connect.static('web/'),
                            connect.directory('web/')
                        ];
                    }
                },
                proxies: [{
                    context: '/api',
                    https: false,
                    host: 'localhost',
                    changeOrigin: true,
                    port: '8180'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('lint', 'eslint');
    grunt.registerTask('server', function () {
        grunt.task.run([
            'configureProxies:server',
            'connect:server'
        ]);
    });

};
