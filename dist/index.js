"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var childProcess = require("child_process");
var path = require("path");
function tokei(paths, exclude) {
    if (!Array.isArray(paths))
        paths = [paths];
    if (!Array.isArray(exclude))
        exclude = [exclude];
    var executableName = os.platform() === 'win32' ? 'win32.exe' : os.platform();
    var child = childProcess.spawn(path.resolve(__dirname, "../binaries/" + executableName), paths.concat(['--output', 'json', '--exclude'], exclude));
    var output = '';
    child.stdout.on('data', function (data) {
        output += data;
    });
    var error = '';
    child.stderr.on('data', function (data) {
        error += data;
    });
    return new Promise(function (resolve, reject) {
        child.on('exit', function (code) {
            if (code !== 0) {
                console.log(error);
            }
            try {
                var parsed = JSON.parse(output);
                return resolve(parsed);
            }
            catch (e) {
                return reject(e);
            }
        });
        child.on('error', function (err) {
            return reject(err);
        });
    });
}
exports.default = tokei;
