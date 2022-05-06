var fs = require('fs');

// readFileSync
console.log('A');
var result = fs.readFileSync('data/sample.txt', 'utf8');
console.log(result);
console.log('C');