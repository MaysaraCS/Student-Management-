/**
 * MY STUDENTS COMPONENT
 * Displays students enrolled in lecturer's subjects
 * 
 * FUNCTIONALITY:
 * - Shows all students enrolled in subjects taught by the lecturer
 * - Groups students by the common subjects they share with the lecturer
 * - Displays student details: name, student ID, faculty, enrolled subjects
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Api_URL } from '../../../app.constants';

interface StudentDetail {
  id: number;
  name: string;
  studentId: string;
  faculty: string;
  username: string;
  enrolledSubjects: string[];  // Common subjects with lecturer
}

interface MyStudentsResponse {
  lecturerName: string;
  studentCount: number;
  students: StudentDetail[];
}

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-students.component.html',
  styleUrl: './my-students.component.css'
})
export class MyStudentsComponent implements OnInit {

  lecturerName: string = '';
  students: StudentDetail[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyStudents();
  }

  /**
   * Load students enrolled in lecturer's subjects
   * GET /api/lecturer/my-students
   * 
   * This endpoint returns:
   * - Lecturer's name
   * - Count of students
   * - List of students with their enrolled subjects (that match lecturer's subjects)
   * 
   * EXAMPLE:
   * If lecturer teaches: Algorithm, Database
   * And student is enrolled in: Algorithm, Math, Database
   * Then enrolledSubjects will show: [Algorithm, Database]
   */
  loadMyStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<MyStudentsResponse>(`${Api_URL}/lecturer/my-students`).subscribe({
      next: (data) => {
        this.lecturerName = data.lecturerName;
        this.students = data.students;
        this.isLoading = false;
        console.log('My students loaded:', data);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load students: ' + (err.error?.error || err.message);
        this.isLoading = false;
        console.error('Error loading students:', err);
      }
    });
  }

  /**
   * Navigate back to lecturer dashboard
   */
  goBack(): void {
    const username = sessionStorage.getItem('auth-username');
    if (username) {
      this.router.navigate(['/lecturer-dashboard', username]);
    } else {
      this.router.navigate(['/landing']);
    }
  }

  /**
   * Get subject count for display
   */
  getSubjectCount(student: StudentDetail): number {
    return student.enrolledSubjects ? student.enrolledSubjects.length : 0;
  }

  /**
   * Get subject names as comma-separated string
   */
  getSubjectNames(student: StudentDetail): string {
    if (!student.enrolledSubjects || student.enrolledSubjects.length === 0) {
      return 'No common subjects';
    }
    return student.enrolledSubjects.join(', ');
  }

  /**
   * Get badge class based on subject count
   */
  getSubjectBadgeClass(student: StudentDetail): string {
    const count = this.getSubjectCount(student);
    if (count === 0) return 'subject-badge-none';
    if (count === 1) return 'subject-badge-low';
    if (count === 2) return 'subject-badge-medium';
    return 'subject-badge-high';
  }
}