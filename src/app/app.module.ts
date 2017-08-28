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
import { LocationTabsComponent } from './modules/location-tabs/location-tabs.component'
import { LocationSettingsComponent } from './modules/location-settings/location-settings.component'
import { DevicesComponent } from './modules/devices/devices.component'
import { DeviceComponent } from './modules/device/device.component'
import { SettingsComponent } from './modules/settings/settings.component'

import { LoginService } from './services/login.service'
import { LocationsService } from './services/locations.service'
import { LocationService } from './services/location.service'
import { DeviceService } from './services/device.service'
import { DevicesService } from './services/devices.service'
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "@angular/material";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { UiSwitchModule } from 'ngx-ui-switch/src'
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function highchartsFactory() {
  return highcharts;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TabsComponent,
    LocationsComponent,
    LocationComponent,
    LocationTabsComponent,
    LocationSettingsComponent,
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
    UiSwitchModule,
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
    }),
    ChartModule
  ],
  providers: [LoginService, LocationsService, DeviceService, DevicesService, LocationService, {
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
