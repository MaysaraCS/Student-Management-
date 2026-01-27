import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor() { }

  private TOKEN_KEY = 'auth-key';

  loginStorage(token:string){
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }
  
  logoutStorage() {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getTokenStorage(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedInStorage(): boolean {
    return !!this.getTokenStorage();
  }

}
