import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { StudentLoginRequest } from '../../models/student-login-request';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css'
})
export class StudentLoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  errorMessage?: string;

  constructor(
    private authService: AuthService, 
    private storage: AuthStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storage.logoutStorage();
  }

  handleLogin(): void {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    const formValue = this.loginForm.value;
    
    const request: StudentLoginRequest = {
      username: formValue.username,
      password: formValue.password
    };

    this.authService.studentLogin(request).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        
        // Store authentication data
        this.storage.loginStorage(res.token, res.username, res.role);

        // Show success message
        alert('Login successful!');

        // Navigate to student dashboard
        this.router.navigate(['/student-dashboard', res.username]);
      },
      error: (err) => {
        console.log("Error received", err);
        this.errorMessage = err.error?.message || 'Invalid username or password';
        alert(this.errorMessage);
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/student-register']);
  }

  navigateToLanding(): void {
    this.router.navigate(['/landing']);
  }
}