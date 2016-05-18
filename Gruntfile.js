module.exports = function(grunt) {

  /* grunt-ftp-deploy !!!!!! */

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'dev/js/libs/*.js',
          'dev/js/main/*.js'
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
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'build/css/style.css': 'dev/css/main.scss'
            }
        }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}),
        ]
      },
      dist: {
        src: 'build/css/style.css'
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
          basedir: "dev/content/_template/",
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
        files: ['dev/js/main/*.js'],
        tasks: ['concat'],
        options: {
            spawn: false,
        },
      },
      css: {
        files: [
          'dev/css/modules/*.scss',
          'dev/css/pages/*.scss',
          'dev/css/template/*.scss',
          'dev/css/main.scss'
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

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'sass', 'jade', 'copy', 'watch']);
  grunt.registerTask('dist', ['concat', 'uglify', 'sass', 'postcss', 'cssmin', 'jade', 'htmlmin', 'copy', 'imagemin']);
};
