var fs = require('fs');
var args = process.argv;

var pre_title = args[2];
var new_title = args[3];

fs.rename(`data/${pre_title}`, `data/${new_title}`, (err) => {});