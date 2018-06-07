module.exports = {
  isImageFile:isImageFile,
  numberOfImages:numberOfImages,
  getBase64Image:getBase64Image,
  getImageMetadata:getImageMetadata,
  orientImage:orientImage,
  checkImageOrientation:checkImageOrientation,
  simpleGetBase64Image:simpleGetBase64Image
}

var base64Img = require('base64-img'),
    conversion = require('./conversion.js'),
    db = require('../dbCalls.js'),
    dbInfo = require('../dbInfo.js'),
    objFile = require('./object.js'),
    postHandler = require('../requests/postHandler.js'),
    fileHandler = require('../file/fileHandler.js'),
    rotator = require('exif-image-auto-rotation'),
    exifImage = require('exif').ExifImage,
    resultsHandler = require('../requests/resultsHandler.js');


//Returns true if the file is img
function isImageFile(fileName){
  if (fileName==null)
    return false;

  if(fileName.match(/.(jpg|jpeg|png|gif)$/i))
    return true;
  return false;
}


function numberOfImages(rows){
  //console.log(rows);
  var numberOfImages = 0;
  for (var index = 0; index < rows.length; index++) {
    //console.log(rows[index]);
    //console.log(rows[index].filename);
    if (isImageFile(rows[index].filename)) {
      numberOfImages++;
    }
  }
  return numberOfImages;
}


//Recursive function that encodes images to base64 with the filepath
function getBase64Image(res, result, index, size, imagesData, imagesName, imagesPath, callback){
  if (result.rows.length <= index ){
    res.send('NO MORE PHOTOS');
    return;
  }

  var imageParamsArray = res.req.params.params.split(',');
  //if is running for the first time and if it is to update a visualization
  if (index == 0 && imageParamsArray.length == 2){
    result.rows = resultsHandler.getImagesUpdateResults(res.req.params, result.rows);  //get set of images
    size        = result.rows.length; //redefine size, otherwise it will return 'no more photos'
  }

  var fileSource = result.rows[index].source;                                   //get image path

  base64Img.base64(fileSource, function(err, data) {                            //encode image by image path
    if(err) console.log("Error in base 64 encoder: "+err);                      //report if error
    if(index!=0) {imagesData += "/|/"; imagesName += "/|/"; imagesPath += "/|/";}                    //if not the first image separate data with '/|/'
    imagesData += data;                                                         //Concatenate image data with previous ones
    imagesName += result.rows[index].filename;                                  //Concatenate image name with previous ones
    imagesPath += result.rows[index].source;
    if(index < size-1){                                                         //if isn't the last increment index and recursively call this function
      index += 1;
      //console.log('getBase64Image index= ' + index);
      getBase64Image(res, result, index, size, imagesData, imagesName, imagesPath, callback);
    }else{
      if (callback != null){
        callback([imagesName, imagesData, imagesPath]);
      }else{
        res.send([imagesName, imagesData, imagesPath]);                                       //if is the last image return to the client side
      }
    }
  });
}

//
function simpleGetBase64Image(res, filesSource, index, size, imageData, callback){
  if (index == size) {
    if (callback != null){
      callback(imageData);
    }else{
      res.send(imageData);
    }
    return;
  }
  base64Img.base64(filesSource[index], function(err, data) {
    if(err) console.log("Error in base 64 encoder: "+err);
    imageData += data + '/|/';
    simpleGetBase64Image(res, filesSource, index+1, size, imageData, callback);
  });
}

//Function that updates the images metadata
function getImageMetadata(client,imagePath){
  try {
    new exifImage({ image : imagePath }, function (error, exifData) {
        if (error)
          console.log('Error: '+error.message);
        else{
          try{
            var lat = exifData.gps.GPSLatitude;
            var lng = exifData.gps.GPSLongitude;
            lat = conversion.convertDMSToDD(lat[0], lat[1], lat[2], exifData.gps.GPSLatitudeRef);
            lng = conversion.convertDMSToDD(lng[0], lng[1], lng[2], exifData.gps.GPSLongitudeRef);
            var timestamp = exifData.exif.CreateDate.split(' ')[0];
            var time      = exifData.exif.CreateDate.split(' ')[1];
            db.updateColumns(client, 'photos', "timestamp='"+timestamp+"', time='"+time+"' , latitude='"+lat+"', longitude='"+lng+"'", "source='"+imagePath+"'");
            //after extract exif info, update street, city and country of the photo
            var databaseData = [imagePath, fileHandler.getFileName(imagePath), timestamp, '-', '-', '-', time, lat, lng, '-' ];
            postHandler.cityCountry(null, null, databaseData[1], 'photos', dbInfo.photosTableColumns, 0, [databaseData], time);
          }catch(error){
            db.updateColumns(client, 'photos', "timestamp='"+timestamp+"', time='"+time+"'", "source='"+imagePath+"'");
          }
        }
    });
  } catch (error) { console.log('Error: ' + error.message); }
}

//
function checkImageOrientation(imagePath){
  try {
    new exifImage({ image : imagePath }, function (error, exifData) {
      //console.log(exifData);
        if (error)
          console.log('Error performing exif: ' + error.message);
        else{
          try{
            orientImage(filePath);
          }catch(error){
            console.log('Check image orientation error: ' + error);
          }
        }
    });
  } catch (error) { console.log('Error reading image exif: ' + error.message); }
}

//
function orientImage(fileSource){
  autoRotate(fileSource, function() {
    //console.log('Rotation Complete');
  });
}
