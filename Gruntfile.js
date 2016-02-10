module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'js/libs/jquery-2.1.4.min.js',
          'js/libs/jquery-ui-1.10.4.min.js',
          'js/libs/bootstrap.min.js',
          'js/template/*.js'
        ],
        dest: 'js/build/production.js',
      }
    },

    uglify: {
      build: {
        src: 'js/build/production.js',
        dest: 'js/build/production.min.js'
      }
    },

    sass: {
      dist: {
        files: {
          'css/build/main.css': 'css/template/main.scss'
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'css/build/main.min.css': ['css/build/main.css']
        }
      }
    },

    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "index.html": ["content/index.jade"]
        }
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['js/template/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
            spawn: false,
        },
      },
      css: {
        files: [
          'css/template/*.scss',
        ],
        tasks: ['sass', 'cssmin'],
        options: {
            spawn: false,
        }
      },
      jade: {
        files: ['content/*.jade', 'content/template/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify', 'sass', 'cssmin', 'jade', 'watch']);

};
