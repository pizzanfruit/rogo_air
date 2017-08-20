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
import { LoginService } from './services/login.service'
import { LocationsService } from './services/locations.service'
import { LocationService } from './services/location.service'
import { DeviceService } from './services/device.service'

import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "@angular/material";
import { MdDatepickerModule, MdNativeDateModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TabsComponent,
    LocationsComponent,
    LocationComponent,
    DevicesComponent,
    DeviceComponent
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
    MaterialModule
  ],
  providers: [LoginService, LocationsService, DeviceService, LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
