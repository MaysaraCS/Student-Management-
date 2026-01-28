import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { AdminLoginRequest } from '../../models/admin-login-request';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errorMessage?: string;
  readonly ADMIN_EMAIL = 'maysaracs1001@gmail.com';

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
      this.errorMessage = 'Please enter valid email and password';
      return;
    }

    const formValue = this.loginForm.value;

    // Validate admin email
    if (formValue.email !== this.ADMIN_EMAIL) {
      this.errorMessage = `Unauthorized! Only ${this.ADMIN_EMAIL} can access admin panel`;
      alert(this.errorMessage);
      return;
    }

    const request: AdminLoginRequest = {
      email: formValue.email,
      password: formValue.password,
      oauthProvider: 'SIMPLE_AUTH'
    };

    this.authService.adminLogin(request).subscribe({
      next: (res) => {
        console.log('Admin login successful:', res);

        // Store authentication data
        this.storage.loginStorage(res.token, res.username, res.role);

        // Show success message
        alert('Admin login successful!');

        // Navigate to admin dashboard
        this.router.navigate(['/admin-dashboard', res.username]);
      },
      error: (err) => {
        console.log("Error received", err);
        this.errorMessage = err.error?.message || 'Invalid credentials';
        alert(this.errorMessage);
      }
    });
  }

  navigateToLanding(): void {
    this.router.navigate(['/landing']);
  }
}