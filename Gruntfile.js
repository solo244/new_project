module.exports = function(grunt) {

  var current_project_name = "/new_project"; // Name of the project. Has to be the same name as the root local folder. Don't forget to prefix with an "/"!
  var server = "/blank"; // Name of the subfolder if any, leave blank if root of server. Don't forget to prefix with an "/"!

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: "new_project", // Change the name if needed here
        success: false,
        duration: 3
      }
    },

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

    'string-replace': {
      inline: {
        files: {
          'dist/': 'dist/**/*.html',
        },
        options: {
          replacements: [
            {
              pattern: '<link rel="stylesheet" type="text/css" href="' + current_project_name + '/build/css/style.css">',
              replacement: '<link rel="stylesheet" type="text/css" href="' + server + '/css/style.css">'
            },
            {
              pattern: '<script src="' + current_project_name + '/build/js/main.js"></script>',
              replacement: '<script src="' + server + '/js/main.js"></script>'
            }
          ]
        }
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
    },

    'ftp-deploy': {
      build: {
        auth: {
          host: 'ftp.kenvandamme.be',
          port: 21,
          authKey: 'kvd'
        },
        src: 'dist',
        dest: '/httpdocs/blank',
        exclusions: ['dist/**/.DS_Store', 'dist/**/Thumbs.db', 'dist/tmp']
      }
    }
  });

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ftp-deploy');

  grunt.task.run('notify_hooks');
  grunt.registerTask('default', ['concat', 'sass', 'jade', 'copy', 'watch']);
  grunt.registerTask('dist', ['concat', 'uglify', 'sass', 'postcss', 'cssmin', 'jade', 'htmlmin', 'copy', 'imagemin']);
  grunt.registerTask('ftp', ['concat', 'uglify', 'sass', 'postcss', 'cssmin', 'jade', 'htmlmin', 'copy', 'imagemin', 'string-replace', 'ftp-deploy']);
};
