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
                dest: 'public/app/compiled/css/build.css'
            },
            server:{
                src: [
                        'mod/global.js',
                        'mod/everyauth.js',
                        'mod/mongoose.js',
                        'mod/expressconfig.js',
                        'mod/root.js',
                        'mod/track.js',
                        'mod/resolve.js',
                        'mod/minify.js',
                        'mod/socket.js',
                        'mod/http.js',
                    ],
                dest: 'riotlink.js'
            }
        },
        uglify: {
            build: {
                src: 'public/app/compiled/js/build.js',
                dest: 'public/app/compiled/js/build.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/app/compiled/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/app/compiled/css/',
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
                files: 'public/app/viewer/**/*.jsx',
                tasks: ['browserify', 'react']
            },
            tracker: {
                files: 'public/app/tracker/**/*.jsx',
                tasks: ['browserify', 'react']
            },
            server: {
                files: 'mod/*.js',
                tasks: ['concat:server']
            }
        },
        react:{
            convert: {
                files: {
                    'public/app/compiled/js/viewer.built.js' : 'public/app/viewer/viewer.built.js',
                    'public/app/compiled/js/tracker.built.js' : 'public/app/tracker/tracker.built.js'
                }
            }
        },
        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ]
            },
            client: {
                src: ['public/app/viewer/**/*.jsx'],
                dest: 'public/app/viewer/viewer.built.js'
            },
            tracker: {
                src: ['public/app/tracker/**/*.jsx'],
                dest: 'public/app/tracker/tracker.built.js'
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
    grunt.registerTask('build', ['browserify', 'sass', 'concat', 'uglify', 'cssmin', 'react']);
};
