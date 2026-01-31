import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStorageService } from '../../../service/storage/auth-storage.service';

@Component({
  selector: 'app-lecturer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecturer-dashboard.component.html',
  styleUrl: './lecturer-dashboard.component.css'
})
export class LecturerDashboardComponent implements OnInit {

  username: string = '';
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private storage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    console.log('Lecturer Dashboard loaded for:', this.username);
  }

  /**
   * Navigate to My Classes page
   * Shows subjects assigned to this lecturer
   */
  navigateToMyClasses(): void {
    this.router.navigate(['/lecturer/my-classes']);
  }

  /**
   * Navigate to My Students page
   * Shows students enrolled in lecturer's subjects
   */
  navigateToMyStudents(): void {
    this.router.navigate(['/lecturer/my-students']);
  }

  /**
   * Logout and return to landing page
   */
  logout(): void {
    this.storage.logoutStorage();
    this.router.navigate(['/landing']);
  }
}