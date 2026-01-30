/**
 * ANGULAR CONCEPT: Component
 * Components control a portion of the screen (a view)
 * They consist of:
 * - TypeScript class (logic)
 * - HTML template (view)
 * - CSS styles (appearance)
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { CommonModule } from '@angular/common';

/**
 * ANGULAR CONCEPT: @Component decorator
 * Defines metadata for the component
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  username: string = '';
  
  /**
   * ANGULAR CONCEPT: Constructor with Dependency Injection
   * Angular automatically provides these services when component is created
   */
  constructor(
    private route: ActivatedRoute,      // Access route parameters
    private router: Router,              // Navigate to different routes
    private storage: AuthStorageService  // Access auth storage
  ) {}

  /**
   * ANGULAR CONCEPT: Lifecycle Hook
   * ngOnInit runs once when component initializes
   * Perfect place for loading initial data
   */
  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    console.log('Admin Dashboard loaded for:', this.username);
  }

  /**
   * NAVIGATION METHODS
   * These methods navigate to different management pages
   */
  
  navigateToManageStudents(): void {
    // ANGULAR CONCEPT: Router Navigation
    // Navigate to student management page
    this.router.navigate(['/admin/manage-students']);
  }

  navigateToManageLecturers(): void {
    this.router.navigate(['/admin/manage-lecturers']);
  }

  navigateToManageCourses(): void {
    this.router.navigate(['/admin/manage-courses']);
  }

  /**
   * Logout and clear session
   */
  logout(): void {
    this.storage.logoutStorage();
    this.router.navigate(['/landing']);
  }
}