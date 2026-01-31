import { Component, OnInit } from '@angular/core';
import { SubjectDetail } from '../../../models/student.model';
import { Router } from '@angular/router';
import { StudentService } from '../../../service/student.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, NgIf],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit{

  studentName: string = '';
  studentId: string = '';
  faculty: string = '';
  subjects: SubjectDetail[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private studentService: StudentService,
    private router: Router){}
  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getMyCourses().subscribe({
      next: (data) => {
        this.studentName = data.studentName;
        this.studentId = data.studentId;
        this.faculty = data.faculty;
        this.subjects = data.subjects;
        this.isLoading = false;
        console.log('My courses loaded:', data);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses: ' + (err.error?.error || err.message);
        this.isLoading = false;
        console.error('Error loading courses:', err);
      }
    });
  }

  goBack(): void {
    const username = sessionStorage.getItem('auth-username');
    if (username) {
      this.router.navigate(['/student-dashboard', username]);
    } else {
      this.router.navigate(['/landing']);
    }
  }

  getLecturerCount(subject: SubjectDetail): number {
    return subject.lecturers ? subject.lecturers.length : 0;
  }

  getLecturerNames(subject: SubjectDetail): string {
    if (!subject.lecturers || subject.lecturers.length === 0) {
      return 'No lecturers assigned';
    }
    return subject.lecturers.map(l => l.name).join(', ');
  }

}
