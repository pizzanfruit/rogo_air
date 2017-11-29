import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./modules/login/login.component";
import { SignUpComponent } from "./modules/sign-up/sign-up.component";
import { TabsComponent } from "./modules/tabs/tabs.component";
import { LocationsComponent } from "./modules/locations/locations.component";
import { SharedAccessComponent } from "./modules/shared-access/shared-access.component";
import { LocationTabsComponent } from "./modules/location-tabs/location-tabs.component";
import { LocationSettingsComponent } from "./modules/location-settings/location-settings.component";
import { DevicesComponent } from "./modules/devices/devices.component";
import { DeviceComponent } from "./modules/device/device.component";
import { SettingsComponent } from "./modules/settings/settings.component";

import { AuthGuard } from "./services/auth-guard.service";

const routing: Routes = [
  {
    path: "tabs",
    canActivate: [AuthGuard],
    component: TabsComponent,
    children: [
      { path: "", redirectTo: "locations", pathMatch: "full" },
      { path: "locations", component: LocationsComponent },
      {
        path: "locations/:id",
        component: LocationTabsComponent,
        canActivateChild: [AuthGuard],
        children: [
          { path: "", redirectTo: "devices", pathMatch: "full" },
          {
            path: "devices",
            component: DevicesComponent,
            children: [{ path: ":id", component: DeviceComponent }]
          },
          { path: "settings", component: LocationSettingsComponent },
          { path: "shared-access", component: SharedAccessComponent }
        ]
      },
      { path: "settings", component: SettingsComponent }
    ]
  },
  { path: "signup", component: SignUpComponent },
  { path: "login", component: LoginComponent },
  { path: "**", redirectTo: "tabs", pathMatch: "full" }
];

export const appRoutes = RouterModule.forRoot(routing, { useHash: true });
