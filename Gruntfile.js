module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            build: {
                cwd: "public",
                src: ["**"],
                dest: "build/public",
                expand: true,
                options: {
                    process: function (content, sourcepath) {
                        content = content.replace('<base href="http://localhost:5050/">',
                            '<base href="http://swifty.indus.uberspace.de/htmlviewer/">');
                        content = content.replace("<script src='bower_components/jquery/dist/jquery.min.js'></script>",
                            "<script src='bower/jquery.min.js'></script>");
                        content = content.replace("<script src='bower_components/bootstrap/dist/js/bootstrap.min.js'></script>",
                            "<script src='bower/bootstrap.js'></script>");
                        content = content.replace('<link rel="stylesheet" href="/bower_components/bootstrap/dist/css/bootstrap.min.css">',
                            '<link rel="stylesheet" href="bower/bootstrap.css">');
                        content = content.replace("<script src='baseurlquery.js'></script>",
                            '');
                        return content;
                    }
                }
            },
            buildserver: {
                cwd: ".",
                src: ["app.js", "package.json"],
                dest: "build/",
                options: {
                    process: function (content, sourcepath) {
                        content = content.replace('app.listen(5050);',
                            'app.listen(61001);');
                        return content;
                    }
                }
            }
        },
        clean: {
            build: {
                src: ["build/public"]
            },
            css: {
                src: ["build/public/**/*.css", "!build/public/index.css"]
            },
            js: {
                src: ["build/public/**/*.js", "!build/public/index.js"]
            }
        },
        cssmin: {
            build: {
                files: {
                    "build/public/index.css": ["build/public/**/*.css"]
                }
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    "build/public/index.js": ["build/public/**/*.js"]
                }
            }
        },
        bowercopy: {
            options: {
                srcPrefix: "bower_components/"
            },
            scripts: {
                options: {
                    destPrefix: "build/public/bower"
                },
                files: {
                    "jquery.min.js": "jquery/dist/jquery.min.js",
                    "bootstrap.js": "bootstrap/dist/js/bootstrap.min.js",
                    "bootstrap.css": "bootstrap/dist/css/bootstrap.min.css"
                }
            }
        },
        shell:{
            copyfiles:{
                options:{
                    stderr:false
                },
                command: "scp -r build/* swifty@indus.uberspace.de:/home/swifty/nodejs/Html5TwitchViewer/"
            },
            testcmd:{
                options:{
                    stderr:false
                },
                command: 'ssh  -f swifty@indus.uberspace.de "svc -h ~/service/htmlviewer" '
            }

        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-bowercopy");
    grunt.loadNpmTasks("grunt-shell");

    grunt.registerTask("build", "loool", ["clean:build", "copy", "cssmin", "clean:css", "uglify", "clean:js", "bowercopy","shell"]);

}