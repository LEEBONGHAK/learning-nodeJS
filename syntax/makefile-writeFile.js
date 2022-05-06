var fs = require('fs');

var args = process.argv;
var title = args[2];
var description = args[3];

fs.writeFile(`data/${title}.txt`, description, 'utf8', (err) => {});