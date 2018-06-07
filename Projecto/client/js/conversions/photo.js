function convertToPhotoObj(file, data, description){
  var timestamp = file.lastModifiedDate;
  if (description == "")
    description = "-";
  return [ file.name, description];
}
