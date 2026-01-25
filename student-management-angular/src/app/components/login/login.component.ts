import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HardcodedAuthenticationService } from '../../service/hardcoded-authentication.service';

@Component({
  selector: 'app-login',
  imports: [ FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  email = 'maysaracs1001@gamil.com'
  password = ''
  errorMessage = 'Invalid Credentials'
  invalidLogin = false

  constructor(private router : Router,
    private hardcodedAuthenticationService:HardcodedAuthenticationService
  ){}

  ngOnInit(): void {
      
  }
  handleLogin(){
    console.log(this.email);
    if(this.hardcodedAuthenticationService.authenticate(this.email, this.password)) {
      // Set flag to indicate just logged in
      sessionStorage.setItem('justLoggedIn', 'true');
      //Redirect to Welcome Page
      this.router.navigate(['student-dashboard', this.email])
      this.invalidLogin = false
    }else{
      this.invalidLogin = true
    }
  }
}
