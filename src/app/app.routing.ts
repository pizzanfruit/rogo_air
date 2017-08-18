import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/login.component'

const routing: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

export const appRoutes = RouterModule.forRoot(routing, { useHash: true })