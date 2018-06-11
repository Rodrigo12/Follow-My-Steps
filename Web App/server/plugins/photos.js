module.exports = {
  formatDecoder: photosFormatDecoder
}

//Return the photos data ready to insert on the database
function photosFormatDecoder(content){
  var photo =  JSON.parse(content); //['filename', 'description']

  var databaseData = [["ADD SOURCE", photo[0], "-", '-', '-', '-', "-", "-", "-", photo[1]]];
  return databaseData;
}
