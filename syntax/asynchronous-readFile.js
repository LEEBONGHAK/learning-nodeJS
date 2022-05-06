var fs = require('fs');

// readFile
console.log('A');
fs.readFile('data/sample.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('C');