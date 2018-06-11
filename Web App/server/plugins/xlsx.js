module.exports = {
  formatDecoder: xlsxFormatDecoder
}

var csv = require('./csv.js');

function xlsxFormatDecoder(content){
  var databaseData = csv.formatDecoder(content);
  return databaseData;
}
