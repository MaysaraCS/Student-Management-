/**
 * MY CLASSES COMPONENT
 * Displays subjects assigned to the logged-in lecturer
 * 
 * ANGULAR CONCEPTS:
 * - Component lifecycle (ngOnInit)
 * - HTTP service calls
 * - Observables and subscriptions
 * - Routing and navigation
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Api_URL } from '../../../app.constants';

interface SubjectDetail {
  id: number;
  subjectName: string;
  subjectCode: string;
  lecturerCount: number;
  studentCount: number;
}

interface MyClassesResponse {
  lecturerName: string;
  department: string;
  subjectCount: number;
  subjects: SubjectDetail[];
}

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-classes.component.html',
  styleUrl: './my-classes.component.css'
})
export class MyClassesComponent implements OnInit {

  lecturerName: string = '';
  department: string = '';
  subjects: SubjectDetail[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyClasses();
  }

  /**
   * Load subjects assigned to the logged-in lecturer
   * GET /api/lecturer/my-subjects
   * 
   * This endpoint returns:
   * - Lecturer's name and department
   * - Count of assigned subjects
   * - List of subjects with lecturer/student counts
   */
  loadMyClasses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<MyClassesResponse>(`${Api_URL}/lecturer/my-subjects`).subscribe({
      next: (data) => {
        this.lecturerName = data.lecturerName;
        this.department = data.department;
        this.subjects = data.subjects;
        this.isLoading = false;
        console.log('My classes loaded:', data);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load classes: ' + (err.error?.error || err.message);
        this.isLoading = false;
        console.error('Error loading classes:', err);
      }
    });
  }

  /**
   * Navigate back to lecturer dashboard
   */
  goBack(): void {
    // Get username from session storage for navigation
    const username = sessionStorage.getItem('auth-username');
    if (username) {
      this.router.navigate(['/lecturer-dashboard', username]);
    } else {
      this.router.navigate(['/landing']);
    }
  }

  /**
   * Get status text based on student count
   */
  getStatusText(subject: SubjectDetail): string {
    if (subject.studentCount === 0) {
      return 'No students enrolled yet';
    } else if (subject.studentCount === 1) {
      return '1 student enrolled';
    } else {
      return `${subject.studentCount} students enrolled`;
    }
  }

  /**
   * Get CSS class for status badge
   */
  getStatusClass(subject: SubjectDetail): string {
    if (subject.studentCount === 0) {
      return 'status-warning';
    }
    return 'status-active';
  }
}