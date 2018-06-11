import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Injectable()
export class MobileConnectionProvider {
  data = '';

  constructor(private file:File, public http: Http, private alertCtrl: AlertController) {
  }

  //get server ip and port from input
  checkServer(title, message, mobileUniqueID) {
    if (this.data) return Promise.resolve(this.data);
    return new Promise(resolve => {
      console.log('checkServer');
      console.log('message:' + message + ' title ' + title);
      if(message == 'Unable to connect'){ //if user input wrong doesn't need to check the file for servers again
        this.requireCredentials(title, message)
        .then(data => {
          if(data != null){
            console.log('requireCredentials ' + JSON.stringify(data));
             resolve(data);
          }
        });
      }else{
        this.fileAddressesConnect()//check the followMyStepsServerAddress file for previous servers
        .then(data => {
          if(data != null && data[0] == 'Success'){//if exists
             resolve(data);
          }else{//if doesn't exists
            this.requireCredentials(title, message)
            .then(data => {
              if(data != null){
                console.log('requireCredentials2 ' + JSON.stringify(data));
                 resolve(data);
              }
            });
          }
        });
      }
    });
  }

  fileAddressesConnect(){
    if (this.data) return Promise.resolve(this.data);
    return new Promise(resolve => {
      console.log('this.file.dataDirectory');
      console.log(this.file.dataDirectory);
      this.file.readAsText(this.file.dataDirectory, 'followMyStepsServerAddress.txt')//get the addresses
      .then(
        data => {
          console.log('data');
          console.log(data);
          if(data.split('\n').length == 0){//if the file doesn't have addresses
            console.log('data');
            resolve('Empty File');
            return;
          }

          var dataArray = data.split('\n');
          var dataSize  = data.split('\n').length;
          this.verifyServersAddresses(dataArray, 0, dataSize).then(//otherwise check if can connect to any available address
            data => { console.log('verifyServersAddresses');console.log(data);resolve(data);  });
      },
      err =>{ console.log(JSON.stringify(err));// if error reading file
        this.file.checkFile(this.file.dataDirectory, 'followMyStepsServerAddress.txt').then(//check if the file exists
          data => { console.log('Unable to read file');//if exists and doesn't allow to read, call cresdentials
            this.requireCredentials('Server IP and Port', 'Check server IP and Port').then(data=>{resolve(data);});
          },
          err => { console.log('File do not Exist');//if file doesn't exist
            this.file.createFile(this.file.dataDirectory, 'followMyStepsServerAddress.txt', true) //create a new file
              .then(
                data => { console.log('File followMyStepsServerAddress.txt Created');
                  this.requireCredentials('Server IP and Port', 'Check server IP and Port').then(data=>{resolve(data);});//call the input credentials
                },
                err => {console.log(err); resolve('Unable to Create File')});//otherwise it was unable to create the file
          });
      });
    });
  }

  verifyServersAddresses(data, index, size){
    if (this.data) return Promise.resolve(this.data);
    return new Promise(resolve => {
      if (index >= size)//if the file doesn't have a valid address
        resolve('Unavailable Addresses');
      var ip   = data[index].split(':')[0];
      var port = data[index].split(':')[1];
      var serverUrl = 'http://'+ip+':'+port+'/mobile/';

      this.http.get(serverUrl+'connection/'+null)//mobileUniqueID use to build ios apps
      //this.http.get('mobile/'+'connection/'+null)//use to build on ionic serve
        .subscribe(
          data => {//if connects the current address, resolve promise
            resolve(['Success', ip, port]);
          },
          err =>{//if can't connect the current address, check the next one
            this.verifyServersAddresses(data, index+1, size).then(
              data => {
                resolve(data);
              });
          });
        });
      }

  requireCredentials(title, message){
    if (this.data) return Promise.resolve(this.data);
    return new Promise(resolve => {
    let alert = this.alertCtrl.create({
       title: title,
       message: message,
       inputs: [
          {
            name: 'IP',
            placeholder: 'IP ex: 192.168.0.2'
          },
          {
            name: 'Port',
            placeholder: 'Port ex: 3000'
          }
        ],buttons: [
         {
           text: 'Enter',
           handler: data => {
             this.checkServerAddress(data)
             .then(data => {
               if(data != null){
                  resolve(data);
               }
             });
           }
         }
       ]
     });
     alert.present();
   });
  }


  //check if input ip and port exist
  checkServerAddress(dataInput){
    if (this.data) return Promise.resolve(this.data);
    return new Promise(resolve => {

      this.http.get('http://'+dataInput.IP+':'+dataInput.Port+'/mobile')//use to build ios apps
      //this.http.get('mobile/')//use to build on ionic serve
        .subscribe(
          data => {
            this.file.writeExistingFile(this.file.dataDirectory, 'followMyStepsServerAddress.txt', '\n'+dataInput.IP+':'+dataInput.Port);
            resolve(['Success', dataInput.IP, dataInput.Port]);
          },
          err => {
            console.log('Error on checkServerAddress' + err);
            resolve(['Error']);
          }
        );
    });
  }

  //get code from input
  connect(serverUrl, title, message, mobileUniqueID) {
    if (this.data) return Promise.resolve(this.data);
    return new Promise(resolve => {
      console.log(serverUrl);
      this.http.get(serverUrl+'connection/'+mobileUniqueID)//use to build ios apps
      //this.http.get('mobile/'+'connection/'+mobileUniqueID)//use to build on ionic serve
        .subscribe(
          data => {
            console.log(data);
            if (data['_body'] == "Reached Max Mobiles connections") {
              let alert = this.alertCtrl.create({
                title: 'Unable to Connect!',
                subTitle: 'Reached the maximum number of mobile devices connections!',
                buttons: ['OK']
              });
              alert.present();
            }else if (data['_body'] == "Insert Code") {
              let alert = this.alertCtrl.create({
                 title: title,
                 message: message,
                 inputs: [
                    {
                      name: 'Code',
                      placeholder: 'Ex: EasF0f'
                    },
                  ],buttons: [
                   {
                     text: 'Enter',
                     handler: data => {
                       this.validateCode(serverUrl, data, mobileUniqueID)
                       .then(data => {
                         if(data != null){
                           if (data)
                            resolve('Correct');
                          else
                            resolve('Wrong');
                         }
                       });
                     }
                   }
                 ]
               });
               alert.present();
            }else if(data['_body'] == 'Already Connected'){
              resolve('Correct');
            }
          },
           err => {console.log("Error:"); console.log(err);console.log("error");}
        )
    });
  }

  //validate code introduced by the user
  validateCode(serverUrl, code, mobileUniqueID) {
    if (code.Code == '') code.Code = '-';
    if (this.data) return Promise.resolve(this.data);

    return new Promise(resolve => {
      this.http.get(serverUrl+'validateCode/' + code.Code + '/'+ mobileUniqueID)//use to build ios apps
      //this.http.get('mobile/'+'validateCode/' + code.Code + '/'+ mobileUniqueID)//use to build on ionic serve
        .subscribe(
          data => {
            if(data['_body'] == 'Wrong Code'){
              resolve(false);
            }else if(data['_body'] == 'Correct'){
              resolve(true);
            }
        });
      });
    }
}
