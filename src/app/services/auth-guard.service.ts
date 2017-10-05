import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string): boolean {
        let split = url.split("/");
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.authService.redirectUrl = url;
        // Store the attempted URL for redirecting
        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    }
}