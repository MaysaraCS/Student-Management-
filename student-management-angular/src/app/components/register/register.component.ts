import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { SignupRequest } from '../../models/signup-request';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStorageService } from '../../service/storage/auth-storage.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,NgIf,RouterLink,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  request: SignupRequest = new SignupRequest;

  msg?: string;

  constructor(private authService:AuthService, private storage: AuthStorageService){}


  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    studentID: new FormControl('', [Validators.required]),
    mobileno: new FormControl('', [Validators.required]),
    faculty: new FormControl('', [Validators.required])
  })
  
  onSubmit(){
    this.storage.logoutStorage();

    const formValue =  this.signupForm.value;

    this.request.name = formValue.name;
    this.request.username = formValue.username;
    this.request.password = formValue.password;
    this.request.studentID = formValue.studentID;
    this.request.mobileno = formValue.mobileno;
    this.request.faculty = formValue.faculty;

    if(this.signupForm.valid){
      console.log("form is valid");
      //call api  
      this.authService.register(this.request).subscribe({
        next: (res) =>{
          console.log(res.response);

          this.msg = res.response;
        },error:(err) =>{
          console.log("Eroor Recived",err);
        }
      })
    }else{
      console.log("On submit failed.");
    }
  }
  ngOnInit(): void {
      
  }
}
