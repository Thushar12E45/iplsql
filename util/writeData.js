const fs = require('fs');

function writeData(path, result) {
  const STRING_RESULT = JSON.stringify(result);

  fs.writeFile(path, STRING_RESULT, function (err) {
    if (err) throw err;
    console.log('file writing complete');
  });
}
module.exports = writeData;
