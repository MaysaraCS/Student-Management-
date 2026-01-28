import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStorageService } from '../storage/auth-storage.service';
import { Role } from '../../models/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  
  constructor(
    private authStorageService: AuthStorageService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is logged in
    if (!this.authStorageService.isLoggedInStorage()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get expected roles from route data
    const expectedRoles = route.data['roles'] as Role[] | undefined;

    // If no roles specified, just check authentication
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Check if user has required role
    if (this.authStorageService.hasAnyRole(expectedRoles)) {
      return true;
    }

    // User doesn't have required role, redirect to appropriate dashboard
    this.redirectToUserDashboard();
    return false;
  }

  /**
   * Redirect user to their role-specific dashboard
   */
  private redirectToUserDashboard(): void {
    const role = this.authStorageService.getRoleStorage();
    const username = this.authStorageService.getUsernameStorage();

    if (!role || !username) {
      this.router.navigate(['/login']);
      return;
    }

    switch (role) {
      case Role.ADMIN:
        this.router.navigate(['/admin-dashboard', username]);
        break;
      case Role.LECTURER:
        this.router.navigate(['/lecturer-dashboard', username]);
        break;
      case Role.STUDENT:
        this.router.navigate(['/student-dashboard', username]);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}