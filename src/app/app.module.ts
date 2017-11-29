import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { appRoutes } from './app.routing';

import { AppComponent } from './app.component';
import { TabsComponent } from './modules/tabs/tabs.component'
import { LoginComponent } from './modules/login/login.component'
import { LocationsComponent } from './modules/locations/locations.component'
import { SharedAccessComponent } from './modules/shared-access/shared-access.component'
import { LocationTabsComponent } from './modules/location-tabs/location-tabs.component'
import { LocationSettingsComponent } from './modules/location-settings/location-settings.component'
import { DevicesComponent } from './modules/devices/devices.component'
import { DeviceComponent } from './modules/device/device.component'
import { SettingsComponent } from './modules/settings/settings.component'

import { LoginService } from './services/login.service'
import { SignUpService } from './services/sign-up.service'
import { LocationsService } from './services/locations.service'
import { SharedAccessService } from './services/shared-access.service'
import { DeviceService } from './services/device.service'
import { DevicesService } from './services/devices.service'
import { AuthGuard } from './services/auth-guard.service'
import { AuthService } from './services/auth.service'

import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "@angular/material";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { UiSwitchModule } from 'ngx-ui-switch/src';
import { CookieModule } from 'ngx-cookie';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';
import { SignUpComponent } from './modules/sign-up/sign-up.component';

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
    SignUpComponent,
    TabsComponent,
    LocationsComponent,
    SharedAccessComponent,
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
    ChartModule,
    CookieModule.forRoot()
  ],
  providers: [AuthGuard, AuthService, LoginService, SignUpService, LocationsService, DeviceService, DevicesService, SharedAccessService, {
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
