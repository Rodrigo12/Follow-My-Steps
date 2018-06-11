module.exports = {
  sendSocketMessage:sendSocketMessage
}

var express    = require('express'),
    path       = require('path'),
    bodyParser = require('body-parser'),
    cons       = require('consolidate'),
    dust       = require('dustjs-helpers'),
    pg         = require('pg'),
    finder     = require('fs-finder'),
    app        = express(),
    http       = require('http').Server(app),
    open       = require('opn'),
    io         = require('socket.io')(http);

//files
var db                 = require('./server/dbCalls.js'),
    dbInfo             = require('./server/dbInfo.js'),
    getHandlerMobile   = require('./server/mobile/mobile.js'),
    getHandler         = require('./server/requests/getHandler.js'),
    deleteHandler      = require('./server/requests/deleteHandler.js'),
    fileUpdateHandler  = require('./server/file/fileUpdateHandler.js'),
    fileUploadHandler  = require('./server/file/fileUploadHandler.js'),
    postHandler        = require('./server/requests/postHandler.js'),
    definitionsHandler = require('./server/requests/definitionsHandler.js'),
    emailHandler       = require('./server/requests/emailHandler.js');

// Assign Dust Engine to .dust Files
app.engine('dust', cons.dust);

// Set Defult Extension .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/client/views');

// Set Public Folder (Serve static files)
app.use('/static',express.static(path.join(__dirname, 'client')));

// Body Parser Middleware (software that acts as a bridge between the database and applications)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Respond when a GET request is made to the Homepage
app.get('/static', function(req, res){
  res.render('layout');
});

app.get('/map/:dates/:dataType/:params', function(req, res){
  getHandler.getMapHandler(req.params, res);
});

app.get('/data/:dates/:dataType/:params', function(req, res){
  getHandler.getHandler(req.params, res);
});

app.post('/pluginData', function(req, res){
  // postHandler.postPluginHandler(req, res);
  fileUploadHandler.uploadFile(req, res);
});

//CREATED FOR DEFINITIONS TABLE
app.post('/definitions', function(req, res){
  definitionsHandler.saveDefinitions(req, res);
});

//CREATED FOR DEFINITIONS TABLE
app.get('/definitions/:dates/:dataType/:params', function(req, res){
  definitionsHandler.getDefinitions(req.params, res);
});

//CREATED FOR UPDATE TIMER
app.post('/updateFiles', function(req, res){
  fileUpdateHandler.updateOptions(req);
  res.redirect('/static');
});

//Delete Items
app.delete('/deleteFiles', function(req, res){
  deleteHandler.deleteFiles(req, res);
});

// Server
http.listen(3000, function(){
  console.log('Server Started on Port 3000');

  open('http://localhost:3000/static/');  //open follow my steps with default browse

  fileUpdateHandler.startInterval();

  //Create the datebase and the user
  pg.connect(dbInfo.initialConnect, function(err, client, done) { // connect to postgres db
    if (err)  console.log('Error while connecting: ' + err);
      db.createUserIfNotExists(client, "followmystepsadmin", "123456");
      //db.createDatabaseIfNotExists(client, "followmystepsdb", "followmystepsadmin", "");
      db.createDatabaseIfNotExists(client, "followmystepsdb", "followmystepsadmin", createPostgisDBExtension);
      done();
    });

    //Connect to postgis to create the extension
    //Called as callback in order to run after the database followmystepsdb is created
    function createPostgisDBExtension(){
      pg.connect(dbInfo.connect, function(err, client, done) { // connect to postgres db
        if (err)  console.log('Error while connecting: ' + err);
          db.createDatabaseExtension(client, "followmystepsdb", "postgis");
          done();
      });
    }
});

////////////SOCKET////////////
io.on('connection', function (socket) {
  console.log('User Connected');
});

function sendSocketMessage(feedbackType, msgObj){
  setTimeout(function(){
       io.sockets.emit(feedbackType, msgObj);
    }, 3000);
}


////////////MOBILE///////////////
app.get('/mobile', function(req, res){
  console.log('mobile');
  res.send('success');
});

app.get('/mobile/validateCode/:code/:mobileUniqueID', function(req, res){
  console.log('!!!!!!!!!!!!!!!/mobile/validateCode/:code!!!!!!!!!!!!!!!');
  console.log(req.params);
  var isCorrect = getHandlerMobile.validateCode(req.params);
  if (isCorrect){
    getHandlerMobile.addConnectedMobile(req.params.mobileUniqueID);
    res.send('Correct');
  }else
    res.send('Wrong Code');
});

app.get('/mobile/:dataType/:params', function(req, res){
  console.log('!!!!!!!!!!!!!!!/mobile/:dataType/:params!!!!!!!!!!!!!!!');
  if (req.params.dataType == 'connection') {
    console.log('mobile/connection');
    console.log(req.params);
    if(getHandlerMobile.userConnected(req.params.params)){//phone is in mobilesConnected
      console.log('Already Connected');
      res.send('Already Connected');
    }else{
      if (getHandlerMobile.canConnect()) {
          getHandlerMobile.generateCode(res, true);
      }else {
        res.send('Reached Max Mobiles connections');
      }
    }

  }else {
    getHandlerMobile.getHandlerMobile(res, req.params);
  }
});

app.get('/mobile/cards/:lat/:lng/:tag/:distance', function(req, res){
  console.log('!!!!!!!!!!!!!!!/mobile/cards/:lat/:lng/:tag/:distance!!!!!!!!!!!!!!!');
  getHandlerMobile.getCardsHandlerMobile(res, req.params);
});

app.get('/mobile/cards/timestamp/:timestamp', function(req, res){
  console.log('!!!!!!!!!!!!!!!/mobile/cards/timestamp/:timestamp!!!!!!!!!!!!!!!');
  getHandlerMobile.getCardsHandlerMobileLife(res, req.params);
});

app.get('/mobile/cards/photos/:timestamp/:params', function(req, res){
  console.log('!!!!!!!!!!!!!!!/mobile/cards/photos/:timestamp/:params!!!!!!!!!!!!!!!');
  getHandlerMobile.getCardsHandlerMobilePhotos(res, req.params);
});
