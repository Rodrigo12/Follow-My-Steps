module.exports = {
  getFileName:getFileName,
  getFileExtention: getFileExtention,
  getTableByFileExtension: getTableByFileExtension,
  isImage:isImage,
  getExtensionsByType:getExtensionsByType,
  getFileExtentionByName:getFileExtentionByName
}

function getFileName(filePath){
  var fileDirectories       = filePath.split('/');
  var fileDirectoriesLength = fileDirectories.length;

  return fileDirectories[fileDirectoriesLength - 1];
}

function getFileExtention(filePath){
  //console.log('getFileExtention: ' + filePath);
  var fileDirectories       = filePath.split('/');
  var fileDirectoriesLength = fileDirectories.length;
  var file                  = fileDirectories[fileDirectoriesLength - 1];
  var extensionArray        = file.split('.');
  var extension             = file.split('.')[extensionArray.length - 1];

  return extension;
}

function getFileExtentionByName(fileName){
  return fileName.split('.')[1];
}

function getTableByFileExtension(fileExtension){
  if (fileExtension.match(/.*(xlsx|csv)$/i))
    return 'general';
  else if(fileExtension.match(/.*(life)$/i))
    return 'life';
  else if(fileExtension.match(/.*(gpx)$/i))
    return 'gpx';
  else if (fileExtension.match(/.*(jpg)$|.*(png)$|.*(gif)$|.*(jpeg)$/i))
    return 'photos';
}

function isImage(filePath){
  var fileExtension = getFileExtention(filePath);
  if(fileExtension.match(/.*(jpg|jpeg|png|gif)$/i))
    return true;
  return false;
}

function getExtensionsByType(fileType){
  if (fileType == 'CSV')
    return ['csv', 'CSV'];
  else if (fileType == 'GPS')
    return ['gpx', 'GPX'];
  else if (fileType == 'LIFE')
      return ['life', 'LIFE'];
  else if (fileType == 'Excel')
    return ['xlsx', 'XLSX'];
  else if (fileType == 'Photos')
    return ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
  else
    return ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'gpx', 'GPX', 'xlsx', 'XLSX', 'csv', 'CSV', 'life', 'LIFE'];
}
