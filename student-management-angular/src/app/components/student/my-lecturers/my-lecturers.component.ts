import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LecturerDetail } from '../../../models/student.model';
import { StudentService } from '../../../service/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-lecturers',
  imports: [CommonModule],
  templateUrl: './my-lecturers.component.html',
  styleUrl: './my-lecturers.component.css'
})
export class MyLecturersComponent implements OnInit{

  studentName: string = '';
  lecturers: LecturerDetail[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  constructor(private studentService: StudentService,
    private router: Router){}
  ngOnInit(): void {
    this.loadMyLecturers();
  }
  loadMyLecturers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getMyLecturers().subscribe({
      next: (data) => {
        this.studentName = data.studentName;
        this.lecturers = data.lecturers;
        this.isLoading = false;
        console.log('My lecturers loaded:', data);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load lecturers: ' + (err.error?.error || err.message);
        this.isLoading = false;
        console.error('Error loading lecturers:', err);
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

  getSubjectCount(lecturer: LecturerDetail): number {
    return lecturer.subjects ? lecturer.subjects.length : 0;
  }

  getSubjectNames(lecturer: LecturerDetail): string {
    if (!lecturer.subjects || lecturer.subjects.length === 0) {
      return 'No common subjects';
    }
    return lecturer.subjects.join(', ');
  }

  getSubjectBadgeClass(lecturer: LecturerDetail): string {
    const count = this.getSubjectCount(lecturer);
    if (count === 0) return 'subject-badge-none';
    if (count === 1) return 'subject-badge-low';
    if (count === 2) return 'subject-badge-medium';
    return 'subject-badge-high';
  }

}
