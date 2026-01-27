import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LoginRequest } from '../../models/login-request';
import { AuthStorageService } from '../../service/storage/auth-storage.service';

@Component({
  selector: 'app-login',
  imports: [ FormsModule, NgIf, RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  userForm : FormGroup =  new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  router = inject(Router);
  request : LoginRequest = new LoginRequest;

  constructor(private authService:AuthService, private storage: AuthStorageService){}

  ngOnInit(): void {
      
  }
  handleLogin(){
    this.storage.logoutStorage();
    const formValue = this.userForm.value;
    
    if(formValue.username == '' || formValue.password == ''){
      alert('Worng Credentilas');
      return;
    }
    this.request.username = formValue.username;
    this.request.password = formValue.password;

    this.authService.login(this.request).subscribe({
      next:(res) =>{
        this.storage.loginStorage(res.token);

        this.router.navigate(['/student-dashboard']);
      },
      error:(err) => {
        console.log("Eroor Recived",err);
      }
    })
  }
}
