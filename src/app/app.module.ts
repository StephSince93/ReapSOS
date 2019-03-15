import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable, Injector  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { SignaturePadModule } from 'angular2-signaturepad';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';
import { SelectSearchableModule } from 'ionic-select-searchable';//deprecated
//import { IonicSelectableModule } from 'ionic-selectable';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { Pro } from '@ionic/pro';
import { EmailComposer } from '@ionic-native/email-composer';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { FieldTicketPage } from '../pages/field-ticket/field-ticket';
import { MiscPage } from '../pages/misc/misc';
import { EquipmentPage } from '../pages/equipment/equipment';
import { LaborPage } from '../pages/labor/labor';
import { AddPhotoPage } from '../pages/add-photo/add-photo';
import { FieldTicketReviewPage } from '../pages/field-ticket-review/field-ticket-review';
import { SubMenuPage } from '../pages/sub-menu/sub-menu';
import { SuccessPage } from '../pages/success/success';
import { SupportPage } from '../pages/support/support';
import { ReapService } from '../services/reap-service';
import { StemApiProvider } from '../providers/stem-api/stem-api';
import { ManageCrewPage } from '../pages/manage-crew/manage-crew';
import { OfflineDataPage } from '../pages/offline-data/offline-data';
import { AddExtraEquipmentPage } from '../pages/add-extra-equipment/add-extra-equipment';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
Pro.init('9df6dd99', {
  appVersion: '1.0.0'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MenuPage,
    FieldTicketPage,
    MiscPage,
    EquipmentPage,
    LaborPage,
    AddPhotoPage,
    SubMenuPage,
    FieldTicketReviewPage,
    SuccessPage,
    SupportPage,
    ManageCrewPage,
    OfflineDataPage,
    AddExtraEquipmentPage,
    TermsOfServicePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SignaturePadModule,
    SelectSearchableModule,//deprecated
    //IonicSelectableModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MenuPage,
    FieldTicketPage,
    MiscPage,
    EquipmentPage,
    LaborPage,
    AddPhotoPage,
    SubMenuPage,
    FieldTicketReviewPage,
    SuccessPage,
    SupportPage,
    ManageCrewPage,
    OfflineDataPage,
    AddExtraEquipmentPage,
    TermsOfServicePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    IonicErrorHandler,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    StemApiProvider,
    ReapService,
    Device,
    AppVersion,
    Network,
    File,
    Camera,
    EmailComposer
  ]
})
export class AppModule {}
