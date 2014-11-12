module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8090,
          base: '.'
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:8090'
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'sass/',
          src: ['*.scss'],
          dest: 'css/',
          ext: '.css'
        }]
      }
    },

    watch: {
      all: {
        files: ['*.html', 'css/**/*.css', 'js/**/*.js'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: 'sass/**/*.scss',
        tasks: ['sass:dist'],
        options: {
          livereload: true
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'index.html'
        }
      }
    },

    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: '*.css',
          dest: 'dist/css/'
        }]
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/main.js': ['js/main.js'],
          'dist/js/router.js': ['js/router.js'],
          'dist/js/chop.min.js': ['js/chop.min.js'],
          'dist/js/javascript.js': ['js/javascript.js'],
          'dist/js/codemirror.js': ['js/codemirror.js']
        }
      }
    },

    'ftp-deploy': {
      dist: {
        auth: {
          host: 'feifeihang.info',
          port: 21,
          authKey: 'key'
        },
        src: 'dist/',
        dest: '/public_html/dial/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ftp-deploy');

  grunt.registerTask('serve', ['connect', 'open', 'watch']);
  grunt.registerTask('build', ['htmlmin', 'sass', 'cssmin', 'uglify']);
  grunt.registerTask('deploy', ['ftp-deploy']);

};
