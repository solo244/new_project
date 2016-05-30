module.exports = function(grunt) {

  // Change these local settings
  var project_name = "new_project"; // Name of the project - for notifications
  var localhost = "http://localhost/new_project/build/"; // Define if your using a server

  // Optional FTP settings
  var server_key = "serverA"; // Defined in your .ftppass file
  var ftp_host = "ftp.somedomain.com"; // Host location
  var upload_location = "/httpdocs/folder"; // Destination folder for ftp
  var root_project_name = "/new_project"; // Local folder containing the project. Prefix with an "/"!
  var server = "/folder"; // Online subfolder containing the project. Prefix with an "/"!

  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: project_name,
        success: false,
        duration: 2
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

    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'build/css/*.css',
            'build/**/*.html'
          ]
        },
        options: {
          watchTask: true,
          proxy: localhost
          /*
            OR run the static server it ships with:
            server: {
              baseDir: "./"
            }
          */
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

    copy: {
      main: {
        images: [{
          expand: true,
          cwd: 'dev/images/',
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: 'build/images'
        }]
      },
      docs: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**/*.html'],
          dest: 'dist/'
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
              pattern: '<link rel="stylesheet" type="text/css" href="' + root_project_name + '/build/css/style.css">',
              replacement: '<link rel="stylesheet" type="text/css" href="' + server + '/css/style.css">'
            },
            {
              pattern: '<script src="' + root_project_name + '/build/js/main.js"></script>',
              replacement: '<script src="' + server + '/js/main.js"></script>'
            }
          ]
        }
      }
    },

    replace: {
      another_example: {
        src: ['dist/**/*.html'],
        overwrite: true,
        replacements: [{
          from: 'href="' + root_project_name + '/build',
          to: 'href="' + server
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
    },

    'ftp-deploy': {
      dist: {
        auth: {
          host: ftp_host,
          port: 21,
          authKey: server_key
        },
        src: 'dist',
        dest: upload_location,
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
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ftp-deploy');

  grunt.task.run('notify_hooks');

  grunt.registerTask('default', ['concat', 'sass', 'jade', 'copy:main', 'browserSync', 'watch']);
  grunt.registerTask('dist', ['concat', 'uglify', 'sass', 'postcss', 'cssmin', 'jade', 'copy', 'imagemin']);
  grunt.registerTask('ftp', ['concat', 'uglify', 'sass', 'postcss', 'cssmin', 'jade', 'copy', 'imagemin', 'string-replace', 'replace', 'ftp-deploy']);
};
