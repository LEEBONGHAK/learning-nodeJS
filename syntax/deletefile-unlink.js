var fs = require('fs');

var args = process.argv;
var filename = args[2];

fs.unlink(`data/${filename}`, (err) => {});