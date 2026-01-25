import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HardcodedAuthenticationService {

  constructor() { }

  authenticate(email:string, password:string){
    if(email==="maysaracs1001@gamil.com" && password === "test"){
      sessionStorage.setItem('authenticaterUser', email);
      return true;
    }
    return false;
  }
  isUserLoggedIn() {
    let user = sessionStorage.getItem('authenticaterUser')
    return !(user === null)
  }

  logout(){
    sessionStorage.removeItem('authenticaterUser')
  }
}
