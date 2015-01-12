module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // combine js files
        concat: {
            js:{
                src: [
                'public/app/components/jquery/dist/jquery.min.js',
                'public/app/components/bootstrap/dist/js/bootstrap.min.js'
                ],
                dest: 'public/app/dist/js/build.js'
            },
                css:{
                src: [
                'public/app/components/bootstrap/dist/css/bootstrap.min.css',
                'public/app/css/main.css'
                ],
                dest: 'public/app/dist/css/build.css'
            }
        },
        uglify: {
            build: {
                src: 'public/app/dist/js/build.js',
                dest: 'public/app/dist/js/build.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/app/dist/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/app/dist/css/',
                    ext: '.min.css'
                }]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'public/app/css/main.css': 'public/app/css/main.scss'
                }
            }
        },
        watch: {
            styles: {
                files: ['public/app/css/*.scss'],
                tasks: ['sass', 'concat:css', 'cssmin'],
                options: {
                    spawn: false,
                },
            },
            react: {
                files: 'public/app/js/**/*.jsx',
                tasks: ['browserify', 'react']
            }
        },
        react:{
            convert: {
                files: {
                    'public/app/dist/js/app.built.js' : 'public/app/js/app.built.js'
                }
            }
        },
        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ]
            },
            client: {
                src: ['public/app/js/**/*.jsx'],
                dest: 'public/app/js/app.built.js'
            }
        }
    });

    // tell grunt we are using this plugin
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-react');

    // tell grunt what to do when we run it
    grunt.registerTask('default', ['browserify', 'sass', 'concat', 'uglify', 'cssmin', 'react', 'watch']);
};
