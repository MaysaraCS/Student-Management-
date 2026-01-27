import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStorageService } from '../storage/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{
  
  constructor(private authStorageService:AuthStorageService,
    private router:Router
  ) { }

  //synchronous checks
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.authStorageService.getTokenStorage())
      return true;

    this.router.navigate(['login']);
    return false;
  }
}
