import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { appRoutes } from './app.routing';

import { AppComponent } from './app.component';
import { TabsComponent } from './modules/tabs/tabs.component'
import { LoginComponent } from './modules/login/login.component'
import { LocationsComponent } from './modules/locations/locations.component'
import { LocationComponent } from './modules/location/location.component'
import { DevicesComponent } from './modules/devices/devices.component'
import { DeviceComponent } from './modules/device/device.component'
import { SettingsComponent } from './modules/settings/settings.component'

import { LoginService } from './services/login.service'
import { LocationsService } from './services/locations.service'
import { LocationService } from './services/location.service'
import { DeviceService } from './services/device.service'

import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "@angular/material";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MdDatepickerModule, MdNativeDateModule } from '@angular/material';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TabsComponent,
    LocationsComponent,
    LocationComponent,
    DevicesComponent,
    DeviceComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    appRoutes,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCB3ib4Ez0nEJG61uopvQeFwSdrOYKa28o'
    }),
    BrowserAnimationsModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [LoginService, LocationsService, DeviceService, LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
