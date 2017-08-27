import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/login.component'
import { TabsComponent } from './modules/tabs/tabs.component'
import { LocationsComponent } from './modules/locations/locations.component'
import { LocationComponent } from './modules/location/location.component'
import { LocationTabsComponent } from './modules/location-tabs/location-tabs.component'
import { LocationSettingsComponent } from './modules/location-settings/location-settings.component'
import { DevicesComponent } from './modules/devices/devices.component'
import { DeviceComponent } from './modules/device/device.component'
import { SettingsComponent } from './modules/settings/settings.component'


const routing: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'tabs', component: TabsComponent,
    children: [
      { path: '', redirectTo: 'locations', pathMatch: 'full' },
      { path: 'locations', component: LocationsComponent },
      {
        path: 'locations/:id', component: LocationTabsComponent,
        children: [
          { path: '', redirectTo: 'devices', pathMatch: 'full' },
          { path: 'devices', component: DevicesComponent },
          { path: 'devices/:id', component: DeviceComponent },
          { path: 'settings', component: LocationSettingsComponent }
        ]
      },
      { path: 'settings', component: SettingsComponent },
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

export const appRoutes = RouterModule.forRoot(routing, { useHash: true })