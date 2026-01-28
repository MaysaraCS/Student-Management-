import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  
  constructor(private router: Router) {}

  navigateToStudentRegister(): void {
    this.router.navigate(['/student-register']);
  }

  navigateToLecturerLogin(): void {
    this.router.navigate(['/lecturer-login']);
  }

  navigateToAdminLogin(): void {
    this.router.navigate(['/admin-login']);
  }
}