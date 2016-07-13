module.exports = function(grunt) {

  // Change these local settings
  var project_name = "new_project_grunt"; // Name of the project - for notifications
  var localhost = "http://localhost/" + project_name + "/build/"; // Define if your using a server, default = project_name
  var root_project_name = "/" + project_name; // Local folder containing the project. Prefix with an "/"! Default = project_name

  // Optional FTP settings
  var server_key = "serverA"; // Defined in your .ftppass file
  var ftp_host = "ftp.somedomain.com"; // Host location
  var upload_location = "/httpdocs/folder"; // Destination folder for ftp
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
        dest: 'build/js/main.min.js'
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
          'build/css/style.min.css': ['build/css/style.css']
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
      images: {
        files: [{
          expand: true,
          cwd: 'dev/images/',
          src: '**',
          dest: 'build/images/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: 'dev/css/_fonts/',
          src: '**',
          dest: 'build/css/fonts/'
        }]
      },
      ftp: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: '**',
          dest: 'dist/'
        }]
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'build/images/',
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: 'build/images/'
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
              pattern: '<link rel="stylesheet" type="text/css" href="' + root_project_name + '/build/css/style.min.css">',
              replacement: '<link rel="stylesheet" type="text/css" href="' + server + '/css/style.min.css">'
            },
            {
              pattern: '<script src="' + root_project_name + '/build/js/main.min.js"></script>',
              replacement: '<script src="' + server + '/js/main.min.js"></script>'
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
        tasks: ['concat', 'uglify'],
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
        tasks: ['sass', 'postcss', 'cssmin'],
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

  grunt.registerTask('default', ['concat', 'uglify', 'sass', 'postcss', 'cssmin', 'jade', 'copy:fonts', 'copy:images', 'imagemin', 'browserSync', 'watch']);
  grunt.registerTask('ftp', ['copy:ftp', 'string-replace', 'replace', 'ftp-deploy']);
};
