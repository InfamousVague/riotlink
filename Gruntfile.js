module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        main: {
            files: [
                // includes files within path
                {expand: true, cwd: 'bower_components/', src: ['**'], dest: 'dist/public/components/'},
                {expand: true, cwd: 'html/', src: ['**'], dest: 'dist/public/'},
                {expand: true, cwd: 'img/', src: ['**'], dest: 'dist/public/img/'},
                {expand: false, src: ['conf.js'], dest: 'dist/'},
            ],
        },
        node: {
            files: [
                // includes files within path
                {expand: true, cwd: 'node_modules/', src: ['**'], dest: 'dist/node_modules/'},
            ],
        },
    },
    uglify: {
        build: {
            src: 'dist/public/js/build.js',
            dest: 'dist/public/js/build.min.js'
        },
        tracker: {
            src: 'dist/public/js/tracker.built.js',
            dest: 'dist/public/js/tracker.min.js'
        },
        viewer: {
            src: 'dist/public/js/viewer.built.js',
            dest: 'dist/public/js/viewer.min.js'
        }
    },
    sass: {
        dist: {
            options: {
                style: 'expanded'
            },
            files: {
                'dist/public/css/main.css': 'scss/main.scss'
            }
        }
    },
    cssmin: {
        target: {
            files: [{
                expand: true,
                cwd: 'dist/public/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'dist/public/css/',
                ext: '.min.css'
            }]
        }
    },
    concat: {
        js:{
            src: [
                'dist/public/components/jquery/dist/jquery.min.js',
                'dist/public/components/bootstrap/dist/js/bootstrap.min.js'
            ],
            dest: 'dist/public/js/build.js'
        },
        css:{
            src: [
                'dist/public/components/bootstrap/dist/css/bootstrap.min.css',
                'dist/public/css/main.css'
            ],
            dest: 'dist/public/css/build.css'
        },
        server:{
            src: [
                'server/global.js',
                'server/everyauth.js',
                'server/mongoose.js',
                'server/expressconfig.js',
                'server/root.js',
                'server/track.js',
                'server/resolve.js',
                'server/minify.js',
                'server/socket.js',
                'server/http.js',
            ],
            dest: 'dist/riotlink.js'
        }
    },
    browserify: {
        options: {
            transform: [ require('grunt-react').browserify ]
        },
        client: {
            src: ['js/viewer/**/*.jsx'],
            dest: 'js/viewer.built.js'
        },
        tracker: {
            src: ['js/tracker/**/*.jsx'],
            dest: 'js/tracker.built.js'
        }
    },
    react:{
        convert: {
            files: {
                'dist/public/js/viewer.built.js' : 'js/viewer.built.js',
                'dist/public/js/tracker.built.js' : 'js/tracker.built.js'
            }
        }
    },
    watch: {
        styles: {
            files: ['scss/*.scss'],
            tasks: ['sass', 'concat:css', 'cssmin'],
            options: {
                spawn: false,
            },
        },
        react: {
            files: 'js/**/*.jsx',
            tasks: ['browserify', 'react', 'uglify']
        },
        server: {
            files: 'mod/*.js',
            tasks: ['concat:server']
        }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');

  // Default task(s).
  grunt.registerTask('default', ['copy', 'concat', 'browserify', 'react', 'sass', 'cssmin', 'uglify']);
  grunt.registerTask('dev', ['copy:main', 'concat', 'browserify', 'react', 'sass', 'cssmin', 'uglify']);
};
