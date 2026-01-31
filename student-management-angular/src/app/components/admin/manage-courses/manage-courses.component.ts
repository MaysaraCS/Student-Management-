import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from '../../../models/subject.model';
import { SubjectService } from '../../../service/subject.service';

/**
 * MANAGE COURSES COMPONENT WITH CREATE FUNCTIONALITY
 * 
 * DISPLAY LOGIC EXPLANATION:
 * 
 * 1. Subject with Lecturer Names:
 *    - Backend returns SubjectResponse with lecturerCount and studentCount
 *    - These counts come from the Many-to-Many relationships
 *    - Backend code: subject.getLecturers().size() and subject.getStudents().size()
 * 
 * 2. How the counting works:
 *    - Each Subject has Set<Lecturer> lecturers and Set<Student> students
 *    - When we fetch subjects, JPA loads these relationships
 *    - The service counts the size of these sets
 *    - Returns the count in the DTO
 */
@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css'
})
export class ManageCoursesComponent implements OnInit {

  subjects: Subject[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // UI State
  showCreateForm: boolean = false;
  
  // Reactive Form for creating course
  createForm: FormGroup;

  constructor(
    private subjectService: SubjectService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // Initialize create form with validation
    this.createForm = this.formBuilder.group({
      subjectName: ['', [Validators.required, Validators.maxLength(100)]],
      subjectCode: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  /**
   * Load all subjects with counts
   * 
   * IMPORTANT: The backend automatically includes:
   * - lecturerCount: Number of lecturers teaching this subject
   * - studentCount: Number of students enrolled in this subject
   * 
   * These come from the SubjectService.convertToResponse() method
   */
  loadSubjects(): void {
    this.isLoading = true;
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => {
        this.subjects = data;
        this.isLoading = false;
        console.log('Subjects loaded with counts:', this.subjects);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load subjects: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  // ==================== CREATE COURSE OPERATIONS ====================

  /**
   * Open create course form
   */
  openCreateForm(): void {
    this.showCreateForm = true;
    this.createForm.reset();
    this.clearMessages();
  }

  /**
   * Create new course/subject
   * POST /api/subjects
   */
  createCourse(): void {
    if (this.createForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    const formValue = this.createForm.value;

    const request = {
      subjectName: formValue.subjectName,
      subjectCode: formValue.subjectCode
    };

    this.subjectService.createSubject(request).subscribe({
      next: (response) => {
        this.successMessage = `Course "${response.subjectName}" created successfully!`;
        this.showCreateForm = false;
        this.createForm.reset();
        this.loadSubjects(); // Reload list to show new course
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Failed to create course';
        this.isLoading = false;
      }
    });
  }

  /**
   * Cancel create operation
   */
  cancelCreate(): void {
    this.showCreateForm = false;
    this.createForm.reset();
    this.clearMessages();
  }

  // ==================== HELPER METHODS ====================

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Navigate back to admin dashboard
   */
  goBack(): void {
    this.router.navigate(['/admin-dashboard', 'admin']);
  }

  /**
   * Get status badge color based on assignment
   */
  getStatusClass(subject: Subject): string {
    if (subject.lecturerCount === 0) return 'status-inactive';
    if (subject.studentCount === 0) return 'status-warning';
    return 'status-active';
  }

  getStatusText(subject: Subject): string {
    if (subject.lecturerCount === 0) return 'No Lecturers';
    if (subject.studentCount === 0) return 'No Students';
    return 'Active';
  }
}