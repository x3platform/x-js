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
    ts: {
      commonjs: {
        src: ['x.ts'],
        options: {
          module: 'commonjs',
          target: 'es5',
          lib: ["dom", "es5", "es2015"],
          removeComments: true,
          sourceMap: false,
          declaration: false,
          noEmitOnError: true,
          alwaysStrict: false,
          failOnTypeErrors: false,
          fast: 'never'
        }
      },
      amd: {
        src: ['x.ts'],
        out: 'dist/test/x.js',
        options: {
          module: 'amd',
          target: 'es5',
          lib: ["dom", "es5", "es2015"],
          removeComments: true,
          sourceMap: false,
          // declaration: false,
          noEmitOnError: false,
          alwaysStrict: false,
          failOnTypeErrors: false,
          fast: 'never'
        }
      },
      docs: {
        src: ['x.ts'],
        options: {
          module: 'commonjs',
          target: 'ES2015',
          sourceMap: false,
          declaration: false,
          noEmitOnError: true,
          failOnTypeErrors: false,
          fast: 'never'
        }
      }
    },
    typescript: {
      commonjs: {
        src: ['x.ts'],
        options: {
          module: 'commonjs', //or commonjs
          target: 'ES2015',
          lib: ["ES5", "ES2015", "DOM"],
          removeComments: true,
          sourcemap: false,
          declaration: false,
          noEmitOnError: true,
          alwaysStrict: false,
          references: []
        }
      },
      amd: {
        src: ['x.ts'],
        dest: 'dist/test/x.js',
        options: {
          module: 'amd', //or commonjs
          target: 'es5',
          lib: ["es5", "es2015.promise"],
          removeComments: true,
          sourcemap: false,
          declaration: false,
          noEmitOnError: true,
          alwaysStrict: false
        }
      },
      docs: {
        src: ['x.ts'],
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5',
          sourcemap: false,
          declaration: false,
          noEmitOnError: true
        }
      },
      // UMD 没什么效果
      umd: {
        src: ['x.ts', 'src/color.ts'],
        dest: 'dist/umd/x.js',
        options: {
          module: 'system', //or commonjs
          target: 'es5',
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
          'dist/x.js': ['dist/test/x.js']
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
        src: ['*.js', 'base/*.js', 'collections/*.js'],
        dest: 'lib/'
      },
      // 发布到 test 目录
      test:
      {
        expand: true,
        cwd: 'test/',
        src: ['base/*.js', 'collections/*.js', '*.js'],
        dest: 'dist/test/spec',
        options: {
          process: function (content, srcpath) {
            return content.replace('var assert = require(\'assert\');', '')
              .replace('var should = require(\'should\');', '')
              .replace('var x = require(\'../../index.js\');', '')
              .replace('var x = require(\'../index.js\');', '')
              .replace(/\n\n\n\n/g, '')
              .replace(/\r\n\r\n\r\n\r\n/g, '');
          }
        }
      },
      // 发布到 lib 目录
      docs:
      {
        expand: true,
        cwd: 'src/',
        src: '*.js',
        dest: 'docs/src/'
      }
    },

    mocha_istanbul: {
      coverage: {
        src: [
          'test/base/*.js',
          'test/*.js',
          'test/*/*.js'], // a folder works nicely
        options: {
          timeout: 10000,
          coverageFolder: 'coverage',
          mochaOptions: ['--harmony', "--slow", "10"], // any extra options
          // istanbulOptions: ['--harmony', '--handle-sigint']
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
        force: true
      },

      default: {
        // LCOV coverage file (can be string, glob or array)
        src: 'coverage/lcov.info',
        options: {
          // Any options for just this target
        }
      },
    },

    // karma runner
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      client: {
        mocha: {
          // change Karma's debug.html to the mocha web reporter 
          reporter: 'html'

          // require specific files after Mocha is initialized 
          // require: [require.resolve('bdd-lazy-var/bdd_lazy_var_global')],

          // custom ui, defined in required file above 
          // ui: 'bdd-lazy-var/global',
        }
      }
    },

    // 生成文档
    jsdoc:
    {
      dist:
      {
        src: ['README.md', 'docs/src/*.js'],
        options:
        {
          // 输出文件夹位置
          destination: 'docs',
          // 模板位置
          // template: 'build/jsdoc/templates/default/',
          template: "node_modules/ink-docstrap/template",
          configure: "docs.conf.json",
          // 是否在文档中输出私有成员
          private: false
        }
      }
    },
    clean: {
      docs: ['docs/src/']
    },
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-jsdoc');
  // grunt.loadNpmTasks('grunt-file-beautify');

  // 测试任务
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-karma');


  // 注意看，每一个任务列表格式是：“任务名：启用的任务配置”。通过这样的形式，我们可以指定MultiTasks运行时使用的配置，
  // 否则默认情况下，MultiTasks会依次使用每个配置去执行一遍任务。
  // grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);

  // 生产环境(默认)
  grunt.registerTask('production', [
    'ts:commonjs',
    'ts:amd',
    // 'cleanup',
    'uglify',
    'copy:lib',
    'copy:test',
    'mocha_istanbul:coverage',
    'coveralls'
  ]);

  // 开发环境
  grunt.registerTask('development', [
    // 'typescript:umd',
    'ts:commonjs',
    // 'typescript:amd',
    // 'cleanup',
    'uglify',
    'copy:index',
    'copy:lib',
    'copy:test',
    'mocha_istanbul:coverage'
  ]);

  grunt.registerTask('default', ['development']);
  grunt.registerTask('publish', ['production']);

  // 代码格式验证
  // grunt.registerTask('lint', ['jshint']);

  // 生成文档
  grunt.registerTask('docs', [
    'ts:docs',
    'copy:docs',
    'jsdoc',
    'clean:docs'
  ]);

  // 测试
  grunt.registerTask('test', ['copy:test', 'mocha_istanbul:coverage']);
};
