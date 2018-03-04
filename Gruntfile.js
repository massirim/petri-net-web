'use strict';

module.exports = function(grunt) {
    var config = {
        app: 'app',
        build: 'app/build',
        useminPrepare: {
            html: '<%= app %>/index.html',
            options: {
                dest: '<%= build %>'
            }
        },
        usemin: {
            html: '<%= build %>/index.html'
        },
        copy: {
            main: {
                cwd: '<%= app %>',
                expand: true,
                filter: 'isFile',
                src: [
                    'assets/webfonts/*',
                    'assets/img/*',
                    'index.html'
                ],
                dest: '<%= build %>/'
            }
        },
        htmlmin: {
            options: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true
            },
            main: {
                options: {
                    removeComments: true
                },
                cwd: '<%= app %>',
                expand: true,
                filter: 'isFile',
                src: [
                    '**/*.html',
                    '!index.html',
                    '!bower_components/**'
                ],
                dest: '<%= build %>/'
            },
            index: {
                src: ['<%= build %>/index.html'],
                dest: '<%= build %>/index.html'
            }
        },
        clean: {
            pre: ['app/build/'],
            pos: ['.tmp/']
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('default', [
        'clean:pre',
        'copy',
        'htmlmin:main',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'usemin',
        'htmlmin:index',
        'clean:pos'
    ]);
}
