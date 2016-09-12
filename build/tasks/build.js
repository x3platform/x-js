/**
* 自定义的 Grunt 任务
*/
module.exports = function(grunt)
{
    "use strict";

    var chalk = require('chalk');

    var fs = require("fs"),
		config = { wrap: { beginFile: "build/tasks/build-intro", endFile: "build/tasks/build-outro"} };

    grunt.registerMultiTask("build", "封装对象信息", function()
    {
        var done = this.async(),
				filePath = this.data.dest,
				wrapBegin = grunt.file.read(config.wrap.beginFile),
				wrapEnd = grunt.file.read(config.wrap.endFile),
				content = grunt.file.read(filePath);

        wrapBegin = wrapBegin.replace('@NAME', grunt.config("pkg.name"))
				.replace('@VERSION', grunt.config("pkg.version"))
				.replace('@AUTHOR', grunt.config("pkg.author"))
				.replace('@DATE', grunt.template.today("yyyy-mm-dd"));

        if (typeof this.data.browserExports == 'undefined')
        {
            this.data.browserExports = this.data.exports;
        }

        wrapEnd = wrapEnd.replace(/@EXPORTS/g, this.data.exports).replace('@BROWSER_EXPORTS', this.data.browserExports);

        var buffer = content.split('\n');

        for (var i = 0; i < buffer.length; i++)
        {
            // 移除编码标识 和 调试信息
            if (buffer[i].indexOf('// -*- ecoding=utf-8 -*-') == 0)
            {
                buffer[i] = '';
            }
            else
            {
                buffer[i] = '    ' + buffer[i];
            }
        }

        content = buffer.join('\n');

        grunt.log.writeln("File: " + chalk.cyan(filePath));

        content = wrapBegin + '\n' + content + '\n' + wrapEnd;

        // 输出封装后的文件
        grunt.file.write(filePath, content);
        // 输出日志信息
        grunt.log.writeln("File " + chalk.cyan(filePath) + " created.");

        done();
    });

    grunt.registerMultiTask("cleanup", "清理开发信息", function()
    {
        var done = this.async(),
				filePath = this.data.dest,
                tags = this.data.tags,
				content = grunt.file.read(filePath);

        var buffer = content.split('\n');

        for (var i = 0; i < buffer.length; i++)
        {
            for (var j = 0; j < tags.length; j++)
            {
                if (buffer[i].indexOf(tags[j]) > 0)
                {
                    buffer[i] = '';
                }
            }
        }

        content = buffer.join('\n').replace(/(\n){2,}/g, '');

        grunt.log.writeln("File: " + chalk.cyan(filePath));

        // 输出封装后的文件
        grunt.file.write(filePath, content);
        // 输出日志信息
        grunt.log.writeln("File " + chalk.cyan(filePath) + " created.");

        done();
    });
};