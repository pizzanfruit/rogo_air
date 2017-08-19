import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/login.component'
import { TabsComponent } from './modules/tabs/tabs.component'
import { LocationsComponent } from './modules/locations/locations.component'
import { LocationComponent } from './modules/location/location.component'
import { DevicesComponent } from './modules/devices/devices.component'
import { DeviceComponent } from './modules/device/device.component'

const routing: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'tabs', component: TabsComponent,
    children: [
      { path: '', redirectTo: 'locations', pathMatch: 'full' },
      { path: 'locations', component: LocationsComponent },
      { path: 'locations/:id', component: LocationComponent },
      { path: 'devices', component: DevicesComponent },
      { path: 'devices/:id', component: DeviceComponent }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

export const appRoutes = RouterModule.forRoot(routing, { useHash: true })