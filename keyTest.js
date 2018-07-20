var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'api.key');

var data = fs.readFileSync(filePath, {encoding: 'utf-8'}, function (err, data) {
  
});

console.log(data);
