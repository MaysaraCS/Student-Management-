import { Injectable } from '@angular/core';
import { Role } from '../../models/roles.enum';
import { User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  private TOKEN_KEY = 'auth-token';
  private USERNAME_KEY = 'auth-username';
  private ROLE_KEY = 'auth-role';

  /**
   * Save authentication data to session storage
   */
  loginStorage(token: string, username: string, role: Role): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    sessionStorage.setItem(this.USERNAME_KEY, username);
    sessionStorage.setItem(this.ROLE_KEY, role);
  }
  
  /**
   * Clear all authentication data from session storage
   */
  logoutStorage(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USERNAME_KEY);
    sessionStorage.removeItem(this.ROLE_KEY);
  }

  /**
   * Get stored token
   */
  getTokenStorage(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored username
   */
  getUsernameStorage(): string | null {
    return sessionStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Get stored role
   */
  getRoleStorage(): Role | null {
    const role = sessionStorage.getItem(this.ROLE_KEY);
    return role as Role | null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedInStorage(): boolean {
    return !!this.getTokenStorage();
  }

  /**
   * Get complete user info
   */
  getCurrentUser(): User | null {
    const token = this.getTokenStorage();
    const username = this.getUsernameStorage();
    const role = this.getRoleStorage();

    if (token && username && role) {
      return { username, role, token };
    }
    return null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: Role): boolean {
    return this.getRoleStorage() === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: Role[]): boolean {
    const userRole = this.getRoleStorage();
    return userRole ? roles.includes(userRole) : false;
  }
}