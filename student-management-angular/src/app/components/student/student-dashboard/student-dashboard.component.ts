import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStorageService } from '../../../service/storage/auth-storage.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {

  username: string = '';
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private storage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    console.log('Student Dashboard loaded for:', this.username);
  }

  /**
   * Navigate to My Courses page
   */
  navigateToMyCourses(): void {
    this.router.navigate(['/student/my-courses']);
  }

  /**
   * Navigate to My Lecturers page
   */
  navigateToMyLecturers(): void {
    this.router.navigate(['/student/my-lecturers']);
  }

  logout(): void {
    this.storage.logoutStorage();
    this.router.navigate(['/landing']);
  }
}