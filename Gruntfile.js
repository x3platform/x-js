// 包装函数
module.exports = function (grunt) {
  // 任务配置
  grunt.initConfig({
    // 获取配置信息
    pkg: grunt.file.readJSON('package.json'),

    // 语法规则验证
    jshint:
    {
      options:
      {
        // 大括号包裹
        curly: true,
        // 对于简单类型，使用===和!==，而不是==和!=
        eqeqeq: false,
        // 对于首字母大写的函数（声明的类），强制使用new
        newcap: false,
        // 禁用arguments.caller和arguments.callee
        noarg: false,
        // 对于属性使用aaa.bbb而不是aaa['bbb']
        sub: false,
        // 查找所有未定义变量
        undef: false,
        // 查找类似与if(a = 0)这样的代码
        boss: true,
        // 指定运行环境为node.js
        node: true
      },
      // files to lint
      all: ['src/core/x.js']
    },

    typescript: {
      commonjs: {
        src: ['x.ts'],
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5',
          removeComments: true,
          sourcemap: false,
          declaration: false,
          noEmitOnError: true
        }
      },
      amd: {
        src: ['x.ts'],
        dest: 'dist/x.js',
        options: {
          module: 'amd', //or commonjs
          target: 'es5',
          removeComments: true,
          sourcemap: false,
          declaration: false,
          noEmitOnError: true
        }
      }
    },

    // 清理调试信息
    cleanup:
    {
      'amd':
      {
        tags: ['#region', '#endregion', 'x.debug.log'],
        dest: "dist/x.js"
      }
    },

    // 压缩文件
    uglify:
    {
      options:
      {
        banner: '// -*- ecoding=utf-8 -*-\n// Name\t\t:<%= pkg.name %> \n// Version\t:<%= pkg.version %> \n// Author\t:<%= pkg.author %> \n// Date\t\t:<%= grunt.template.today("yyyy-mm-dd") %>\n'
      },
      'dist':
      {
        files:
        {
          'dist/x.min.js': ['dist/x.js']
        }
      }
    },

    // 复制
    copy:
    {
      // 发布到 lib 目录
      index:
      {
        src: 'x.js',
        dest: 'index.js',
        options: {
          process: function (content, srcpath) {
            return content.replace(/\/src\//g, "/lib/");
          }
        }
      },

      // 发布到 lib 目录
      lib:
      {
        expand: true,
        cwd: 'src/',
        src: '*.js',
        dest: 'lib/'
      }
    },

    mochacli: {
      options: {
        // require: ['should'],
        // nyan
        reporter: 'spec',
        bail: true
      },
      all: ['test/*.js']
    },

    mocha_istanbul: {
      coverage: {
        src: 'test', // a folder works nicely
        options: {
          // mask: '*.spec.js'
        }
      },
      coverageSpecial: {
        src: ['testSpecial/*/*.js', 'testUnique/*/*.js'], // specifying file patterns works as well
        options: {
          coverageFolder: 'coverageSpecial',
          mask: '*.spec.js',
          mochaOptions: ['--harmony', '--async-only'], // any extra options
          istanbulOptions: ['--harmony', '--handle-sigint']
        }
      },
      coveralls: {
        src: ['test'], // multiple folders also works
        options: {
          coverage: true, // this will make the grunt.event.on('coverage') event listener to be triggered
          check: {
            lines: 75,
            statements: 75
          },
          root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
          reportFormats: ['cobertura', 'lcovonly']
        }
      }
    },

    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    },
    coveralls: {
      // Options relevant to all targets
      options: {
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      },

      default: {
        // LCOV coverage file (can be string, glob or array)
        src: 'coverage/lcov.info',
        options: {
          // Any options for just this target
        }
      },
    },

    // 生成文档
    jsdoc:
    {
      dist:
      {
        src: ['README.md', 'src/*.ts'],
        options:
        {
          // 输出文件夹位置
          destination: 'docs',
          // 模板位置
          template: 'build/jsdoc/templates/default/',
          // 是否在文档中输出私有成员
          private: false
        }
      }
    }
  });

  // Load grunt tasks from NPM packages
  require("load-grunt-tasks")(grunt);

  // 加载自定义任务
  grunt.loadTasks("build/grunt-typescript/tasks");

  // 任务加载
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-jsdoc');
  // grunt.loadNpmTasks('grunt-file-beautify');

  // test
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-coveralls');


  // 注意看，每一个任务列表格式是：“任务名：启用的任务配置”。通过这样的形式，我们可以指定MultiTasks运行时使用的配置，
  // 否则默认情况下，MultiTasks会依次使用每个配置去执行一遍任务。
  // grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);

  // 生产环境(默认)
  grunt.registerTask('default', [
    'typescript',
    // 'cleanup',
    'uglify',
    'copy',
    // 'mochacli',
    'mocha_istanbul:coverage'
    // 'coveralls'
    //'jsdoc'
  ]);

  // 开发环境
  grunt.registerTask('development', [
    'typescript',
    'cleanup',
    'uglify',
    'copy',
    'mochacli'
  ]);

  // 正式环境
  grunt.registerTask('development', [
    'concat:dist',
    'build',
    'copy:original',
    'cleanup',
    'uglify:dist-core',
    'uglify:dist-template',
    'uglify:dist-ui-core',
    'uglify:dist-workflow',
    'less',
    'cssmin',
    'copy:dist'
  ]);

  // 代码格式验证
  grunt.registerTask('lint', ['jshint']);

  // 生成文档
  grunt.registerTask('doc', ['jsdoc']);

  // 测试
  grunt.registerTask('test', ['mochacli']);
};
