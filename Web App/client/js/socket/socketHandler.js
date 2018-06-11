$(function () {
   var socket = io();

   socket.on('updateFeedback', function(msgObj){
      createFeedbackMessage(' updated!', 'update', msgObj, 15000);
      cacheObj = {};
      $('.visualization').trigger('time', ['updateFeedback']);
    });

    socket.on('uploadFeedback', function(msgObj){
       createFeedbackMessage(' uploaded!', 'add', msgObj, 15000);
     });

     socket.on('deleteFeedback', function(msgObj){
        createFeedbackMessage(' deleted from the database!', 'bin', msgObj, 15000);
      });

    socket.on('saveDefinitionsFeedback', function(msgObj){
       createFeedbackMessage(' changes updated!', 'success', msgObj, 15000);
     });

    socket.on('emailFeedback', function(msgObj){
      if (msgObj.type == 'Error')
        createFeedbackMessage('Unable to send email to ', 'error', msgObj, 15000);
      else if (msgObj.type == 'Success')
        createFeedbackMessage('Email sent to ', 'success', msgObj, 15000);
     });

   socket.on('mobileCodeFeedback', function(msgObj){
     createFeedbackMessage(' : ' + msgObj.code, 'success', msgObj, 60000);
    });
  });
