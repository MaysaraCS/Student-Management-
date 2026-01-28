import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { LecturerLoginRequest } from '../../models/lecturer-login-request';

@Component({
  selector: 'app-lecturer-login',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './lecturer-login.component.html',
  styleUrl: './lecturer-login.component.css'
})
export class LecturerLoginComponent implements OnInit {

  lecturerUsernames: string[] = [];
  isLoadingUsernames: boolean = true;

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
    this.loadLecturerUsernames();
  }

  loadLecturerUsernames(): void {
    this.authService.getLecturerUsernames().subscribe({
      next: (res) => {
        this.lecturerUsernames = res.usernames;
        this.isLoadingUsernames = false;
        console.log('Lecturer usernames loaded:', this.lecturerUsernames);
      },
      error: (err) => {
        console.log("Error loading usernames", err);
        this.errorMessage = 'Failed to load lecturer usernames';
        this.isLoadingUsernames = false;
      }
    });
  }

  handleLogin(): void {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Please select a username and enter password';
      return;
    }

    const formValue = this.loginForm.value;

    const request: LecturerLoginRequest = {
      username: formValue.username,
      password: formValue.password
    };

    this.authService.lecturerLogin(request).subscribe({
      next: (res) => {
        console.log('Lecturer login successful:', res);

        // Store authentication data
        this.storage.loginStorage(res.token, res.username, res.role);

        // Show success message
        alert('Login successful!');

        // Navigate to lecturer dashboard
        this.router.navigate(['/lecturer-dashboard', res.username]);
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