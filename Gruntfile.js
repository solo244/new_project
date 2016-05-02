module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'dev/js/libs/*.js',
          'dev/js/template/*.js'
        ],
        dest: 'build/js/main.js',
      }
    },

    uglify: {
      build: {
        src: 'build/js/main.js',
        dest: 'dist/js/main.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          noCache: true
        },
        files: {
          'build/css/style.css': 'dev/css/template/main.scss'
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
          'dist/css/style.css': ['build/css/style.css']
        }
      }
    },

    jade: {
      compile: {
        options: {
          basedir: "dev/content/",
          data: {
            debug: false
          },
          pretty: true
        },
        files: [{
          cwd: "dev/content",
          src: ["**/*.jade", "!_template/*.jade"],
          dest: "build",
          expand: true,
          ext: ".html"
        }],
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        expand: true,
        cwd: "build",
        src: "**/*.html",
        dest: "dist/"
      }
    },

    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'dev/images/',
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: 'build/images'
        }]
      },
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'build/images/',
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: 'dist/images/'
        }]
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['dev/js/template/*.js'],
        tasks: ['concat'],
        options: {
            spawn: false,
        },
      },
      css: {
        files: [
          'dev/css/template/*.scss',
        ],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      },
      jade: {
        files: ['dev/content/*.jade', 'dev/content/**/*.jade'],
        tasks: ['jade']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('build', ['concat', 'sass', 'jade', 'copy', 'watch']);
  grunt.registerTask('dist', ['uglify', 'cssmin', 'htmlmin','imagemin']);
  grunt.registerTask('full', ['concat', 'uglify', 'sass', 'cssmin', 'jade', 'htmlmin', 'copy', 'imagemin']);
};
