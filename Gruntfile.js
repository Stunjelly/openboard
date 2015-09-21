/*jslint node: true */
'use strict';

var pkg = require('./package.json');
var path = require('path');

//Using exclusion patterns slows down Grunt significantly
//instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
//this method is used to create a set of inclusive patterns for all subdirectories
//skipping node_modules, lib, _dist, and any .dirs
//This enables users to create any directory structure they desire.
var createFolderGlobs = function (fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules', 'lib', '_dist', 'temp'];
  var fs = require('fs');
  return fs.readdirSync(path.join(process.cwd(), ''))
    .map(function (file) {
      if (ignore.indexOf(file) !== -1 ||
        file.indexOf('.') === 0 || !fs.lstatSync(file).isDirectory()) {
        return null;
      } else {
        return fileTypePatterns.map(function (pattern) {
          return file + '/**/' + pattern;
        });
      }
    })
    .filter(function (patterns) {
      return patterns;
    })
    .concat(fileTypePatterns);
};

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001,
          base: 'public',
          open: true
        }
      }
    },
    watch: {
      main: {
        options: {
          livereload: true,
          livereloadOnError: false,
          spawn: false
        },
        files: [createFolderGlobs(['public/*.js', 'public/*.less', 'public/*.html']), '!public/_SpecRunner.html', '!public/.grunt'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },
    jshint: {
      main: {
        options: {
          reporter: require('jshint-stylish'),
          jshintrc: '.jshintrc'
        },
        src: createFolderGlobs('public/*.js')
      }
    },
    clean: {
      before: {
        src: ['public/_dist', 'public/temp']
      },
      after: {
        src: ['public/temp']
      }
    },
    less: {
      production: {
        options: {},
        files: {
          'public/temp/app.css': 'public/app.less'
        }
      }
    },
    ngtemplates: {
      main: {
        options: {
          module: pkg.name,
          htmlmin: '<%= htmlmin.main.options %>'
        },
        src: [createFolderGlobs('public/*.html'), '!public/index.html', '!public/_SpecRunner.html'],
        dest: 'public/temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [
          {
            cwd: 'public/',
            src: ['img/**'],
            dest: 'public/_dist/'
          },
          {
            cwd: 'public/',
            src: ['lib/font-awesome/fonts/**'],
            dest: 'public/_dist/',
            filter: 'isFile',
            expand: true
          },
          {
            cwd: 'public/',
            src: ['lib/bootstrap/fonts/**'],
            dest: 'public/_dist/',
            filter: 'isFile',
            expand: true
          }
          //{src: ['lib/angular-ui-utils/ui-utils-ieshiv.min.js'], dest: '_dist/'},
          //{src: ['lib/select2/*.png','lib/select2/*.gif'], dest:'_dist/css/',flatten:true,expand:true},
          //{src: ['lib/angular-mocks/angular-mocks.js'], dest: '_dist/'}
        ]
      }
    },
    dom_munger: {
      read: {
        options: {
          read: [
            {selector: 'script[data-concat!="false"]', attribute: 'src', writeto: 'appjs'},
            {selector: 'link[rel="stylesheet"][data-concat!="false"]', attribute: 'href', writeto: 'appcss'}
          ]
        },
        src: 'public/index.html'
      },
      update: {
        options: {
          remove: ['script[data-remove!="false"]', 'link[data-remove!="false"]'],
          append: [
            {selector: 'body', html: '<script src="app.full.min.js"></script>'},
            {selector: 'head', html: '<link rel="stylesheet" href="app.full.min.css">'}
          ]
        },
        src: 'public/index.html',
        dest: 'public/_dist/index.html'
      }
    },
    cssmin: {
      main: {
        src: ['public/temp/app.css', '<%= dom_munger.data.appcss %>'],
        dest: 'public/_dist/app.full.min.css'
      }
    },
    concat: {
      main: {
        src: ['<%= dom_munger.data.appjs %>', '<%= ngtemplates.main.dest %>'],
        dest: 'public/temp/app.full.js'
      }
    },
    ngAnnotate: {
      main: {
        src: 'public/temp/app.full.js',
        dest: 'public/temp/app.full.js'
      }
    },
    uglify: {
      main: {
        src: 'public/temp/app.full.js',
        dest: 'public/_dist/app.full.min.js'
      }
    },
    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'public/_dist/index.html': 'public/_dist/index.html'
        }
      }
    },
    //Imagemin has issues on Windows.
    //To enable imagemin:
    // - "npm install grunt-contrib-imagemin"
    // - Comment in this section
    // - Add the "imagemin" task after the "htmlmin" task in the build task alias
    // imagemin: {
    //   main:{
    //     files: [{
    //       expand: true, cwd:'_dist/',
    //       src:['**/{*.png,*.jpg}'],
    //       dest: '_dist/'
    //     }]
    //   }
    // },
    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [  //this files data is also updated in the watch handler, if updated change there too
          '<%= dom_munger.data.appjs %>',
          'public/lib/angular-mocks/angular-mocks.js',
          createFolderGlobs('public/*-spec.js')
        ],
        logLevel: 'ERROR',
        reporters: ['mocha'],
        autoWatch: false, //watching is handled by grunt-contrib-watch
        singleRun: true
      },
      all_tests: {
        browsers: ['PhantomJS', 'Chrome', 'Firefox']
      },
      during_watch: {
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'clean:before', 'less', 'dom_munger', 'prefix_munger', 'ngtemplates', 'cssmin', 'concat', 'ngAnnotate', 'uglify', 'copy', 'htmlmin', 'clean:after']);
  grunt.registerTask('serve', ['dom_munger:read', 'jshint', 'connect', 'watch']);
  grunt.registerTask('test', ['dom_munger:read', 'prefix_munger', 'karma:all_tests']);

  grunt.registerTask('prefix_munger', 'Prefix with public!', function () {
    var paths = grunt.config('dom_munger.data.appjs');
    var newPaths = [];
    for (path in paths) {
      newPaths.push('public/' + paths[path]);
    }
    grunt.config('dom_munger.data.appjs', newPaths);
  });

  grunt.event.on('watch', function (action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    var tasksToRun = [];

    if (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      tasksToRun.push('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
        spec = filepath.substring(0, filepath.length - 3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        var files = [].concat(grunt.config('dom_munger.data.appjs'));
        files.push('public/lib/angular-mocks/angular-mocks.js');
        files.push(spec);
        grunt.config('karma.options.files', files);
        tasksToRun.push('karma:during_watch');
      }
    }

    //if index.html changed, we need to reread the <script> tags so our next run of karma
    //will have the correct environment
    if (filepath === 'public/index.html') {
      tasksToRun.push('dom_munger:read');
    }

    grunt.config('watch.main.tasks', tasksToRun);

  });
};
