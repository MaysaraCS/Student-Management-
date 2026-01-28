import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { StudentSignupRequest } from '../../models/student-signup-request';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, FormsModule],
  templateUrl: './student-register.component.html',
  styleUrl: './student-register.component.css'
})
export class StudentRegisterComponent implements OnInit {

  request: StudentSignupRequest = {
    name: '',
    username: '',
    password: '',
    studentID: '',
    mobileno: '',
    faculty: ''
  };

  msg?: string;
  isError: boolean = false;

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    studentID: new FormControl('', [Validators.required]),
    mobileno: new FormControl('', [Validators.required]),
    faculty: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService, 
    private storage: AuthStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storage.logoutStorage();
  }

  onSubmit(): void {
    if (!this.signupForm.valid) {
      console.log("Form is invalid");
      return;
    }

    const formValue = this.signupForm.value;

    this.request.name = formValue.name;
    this.request.username = formValue.username;
    this.request.password = formValue.password;
    this.request.studentID = formValue.studentID;
    this.request.mobileno = formValue.mobileno;
    this.request.faculty = formValue.faculty;

    this.authService.studentRegister(this.request).subscribe({
      next: (res) => {
        console.log('Registration successful:', res.response);
        this.msg = res.response;
        this.isError = false;
        
        // Show success message
        alert('Registration successful! You can now login.');
        
        // Navigate to student login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/student-login']);
        }, 2000);
      },
      error: (err) => {
        console.log("Error received", err);
        this.msg = err.error?.response || 'Registration failed. Please try again.';
        this.isError = true;
        alert(this.msg);
      }
    });
  }

  navigateToStudentLogin(): void {
    this.router.navigate(['/student-login']);
  }

  navigateToLanding(): void {
    this.router.navigate(['/landing']);
  }
}