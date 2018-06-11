import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ModalPage } from '../pages/home/settings';
import { MapProvider } from '../providers/map/map';


import { HttpModule } from '@angular/http';
import { MobileConnectionProvider } from '../providers/mobile-connection/mobile-connection';
import { CardsProvider } from '../providers/cards/cards';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ModalPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MapProvider,
    MobileConnectionProvider,
    CardsProvider
  ]
})
export class AppModule {}
