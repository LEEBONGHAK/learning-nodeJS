var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, (err, filelist) => {
    console.log(filelist);
});