/**
 * ANGULAR CONCEPT: Component
 * ManageStudentsComponent handles all CRUD operations for students
 * 
 * Key Concepts Used:
 * - Component (main building block)
 * - Services (for API calls)
 * - Reactive Forms (for create/edit)
 * - Data Binding (displaying data)
 * - Event Handling (click, submit events)
 * - Observables (async data from API)
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Student, StudentCreateRequest, StudentUpdateRequest } from '../../../models/student.model';
import { Subject } from '../../../models/subject.model';
import { StudentService } from '../../../service/student.service';
import { SubjectService } from '../../../service/subject.service';

/**
 * ANGULAR CONCEPT: @Component Decorator
 * Defines metadata for the component
 */
@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.css'
})
export class ManageStudentsComponent implements OnInit {

  // ==================== DATA PROPERTIES ====================
  
  students: Student[] = [];              // Array to store all students
  availableSubjects: Subject[] = [];     // Array of all subjects for assignment
  selectedStudent: Student | null = null; // Currently selected student for edit/assign
  
  // ==================== UI STATE PROPERTIES ====================
  
  isLoading: boolean = false;            // Show loading spinner
  showCreateForm: boolean = false;       // Toggle create form visibility
  showEditForm: boolean = false;         // Toggle edit form visibility
  showAssignForm: boolean = false;       // Toggle assign subjects form visibility
  errorMessage: string = '';             // Error messages to display
  successMessage: string = '';           // Success messages to display

  // ==================== REACTIVE FORMS ====================
  
  /**
   * ANGULAR CONCEPT: Reactive Forms (FormGroup)
   * Forms are created programmatically with validation
   * This is more powerful than template-driven forms
   */
  createForm: FormGroup;
  editForm: FormGroup;
  
  /**
   * Selected subject IDs for assignment
   * Max 5 subjects per student
   */
  selectedSubjectIds: number[] = [];

  /**
   * ANGULAR CONCEPT: Constructor with Dependency Injection
   * Angular automatically provides these services
   */
  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    /**
     * ANGULAR CONCEPT: FormBuilder
     * Simplifies creating reactive forms with validation
     */
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      studentID: ['', Validators.required],
      mobileno: ['', Validators.required],
      faculty: ['', Validators.required]
    });

    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      studentID: ['', Validators.required],
      mobileno: ['', Validators.required],
      faculty: ['', Validators.required]
    });
  }

  /**
   * ANGULAR CONCEPT: Lifecycle Hook - ngOnInit
   * Runs once when component initializes
   * Perfect for loading initial data
   */
  ngOnInit(): void {
    this.loadStudents();
    this.loadSubjects();
  }

  // ==================== DATA LOADING METHODS ====================

  /**
   * Load all students from API
   * 
   * ANGULAR CONCEPT: Observable & Subscribe
   * Observables handle async data streams
   * We subscribe to get the data when it arrives
   */
  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.isLoading = false;
        console.log('Students loaded:', this.students.length);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load students: ' + err.message;
        this.isLoading = false;
        console.error('Error loading students:', err);
      }
    });
  }

  /**
   * Load all available subjects for assignment
   */
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => {
        this.availableSubjects = data;
        console.log('Subjects loaded:', this.availableSubjects.length);
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
      }
    });
  }

  // ==================== CREATE OPERATIONS ====================

  /**
   * Show create student form
   */
  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showAssignForm = false;
    this.createForm.reset();
    this.clearMessages();
  }

  /**
   * Create new student
   * 
   * IMPORTANT: Database IDs are auto-generated
   * When you delete a student, their ID is permanently removed
   * New students get the next available ID from the sequence
   */
  createStudent(): void {
    if (this.createForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    const formValue = this.createForm.value;

    const request: StudentCreateRequest = {
      name: formValue.name,
      username: formValue.username,
      password: formValue.password,
      studentID: formValue.studentID,
      mobileno: formValue.mobileno,
      faculty: formValue.faculty
    };

    this.studentService.createStudent(request).subscribe({
      next: (response) => {
        this.successMessage = 'Student created successfully!';
        this.showCreateForm = false;
        this.createForm.reset();
        this.loadStudents(); // Reload list to show new student
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to create student';
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

  // ==================== UPDATE OPERATIONS ====================

  /**
   * Open edit form for selected student
   * 
   * ANGULAR CONCEPT: Data Binding
   * We populate the form with existing student data
   */
  openEditForm(student: Student): void {
    this.selectedStudent = student;
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showAssignForm = false;
    this.clearMessages();

    // Populate form with student data
    this.editForm.patchValue({
      name: student.name,
      username: student.username,
      studentID: student.studentId,
      mobileno: student.mobileNo || '',
      faculty: student.faculty
    });
  }

  /**
   * Update student information
   */
  updateStudent(): void {
    if (this.editForm.invalid || !this.selectedStudent) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    const formValue = this.editForm.value;

    const request: StudentUpdateRequest = {
      name: formValue.name,
      username: formValue.username,
      studentID: formValue.studentID,
      mobileno: formValue.mobileno,
      faculty: formValue.faculty
    };

    this.studentService.updateStudent(this.selectedStudent.id, request).subscribe({
      next: (response) => {
        this.successMessage = 'Student updated successfully!';
        this.showEditForm = false;
        this.selectedStudent = null;
        this.loadStudents(); // Reload to show updates
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to update student';
        this.isLoading = false;
      }
    });
  }

  /**
   * Cancel edit operation
   */
  cancelEdit(): void {
    this.showEditForm = false;
    this.selectedStudent = null;
    this.editForm.reset();
    this.clearMessages();
  }

  // ==================== DELETE OPERATIONS ====================

  /**
   * Delete student with confirmation
   * 
   * NOTE: When a student is deleted, their database ID is gone forever
   * PostgreSQL sequences continue from where they left off
   * This is normal database behavior
   */
  deleteStudent(student: Student): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete ${student.name}?\n` +
      `Student ID: ${student.studentId}\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    this.isLoading = true;

    this.studentService.deleteStudent(student.id).subscribe({
      next: (response) => {
        this.successMessage = `Student ${student.name} deleted successfully`;
        this.loadStudents(); // Reload list
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to delete student';
        this.isLoading = false;
      }
    });
  }

  // ==================== SUBJECT ASSIGNMENT ====================

  /**
   * Open assign subjects form
   */
  openAssignForm(student: Student): void {
    this.selectedStudent = student;
    this.showAssignForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.clearMessages();

    // Pre-select student's current subjects
    this.selectedSubjectIds = student.subjects.map(s => s.id);
  }

  /**
   * Toggle subject selection
   * Max 5 subjects allowed per student
   */
  toggleSubjectSelection(subjectId: number): void {
    const index = this.selectedSubjectIds.indexOf(subjectId);

    if (index > -1) {
      // Remove subject
      this.selectedSubjectIds.splice(index, 1);
    } else {
      // Add subject (check max limit)
      if (this.selectedSubjectIds.length >= 5) {
        this.errorMessage = 'Students can only be assigned up to 5 subjects';
        return;
      }
      this.selectedSubjectIds.push(subjectId);
    }

    this.errorMessage = ''; // Clear error when valid selection
  }

  /**
   * Check if subject is selected
   */
  isSubjectSelected(subjectId: number): boolean {
    return this.selectedSubjectIds.includes(subjectId);
  }

  /**
   * Assign selected subjects to student
   */
  assignSubjects(): void {
    if (!this.selectedStudent) {
      return;
    }

    if (this.selectedSubjectIds.length === 0) {
      this.errorMessage = 'Please select at least one subject';
      return;
    }

    this.isLoading = true;

    this.studentService.assignSubjects(
      this.selectedStudent.id,
      this.selectedSubjectIds
    ).subscribe({
      next: (response) => {
        this.successMessage = `Subjects assigned successfully to ${this.selectedStudent!.name}`;
        this.showAssignForm = false;
        this.selectedStudent = null;
        this.selectedSubjectIds = [];
        this.loadStudents(); // Reload to show updated subjects
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to assign subjects';
        this.isLoading = false;
      }
    });
  }

  /**
   * Cancel assign operation
   */
  cancelAssign(): void {
    this.showAssignForm = false;
    this.selectedStudent = null;
    this.selectedSubjectIds = [];
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
   * Get subject count for a student (for display)
   */
  getSubjectCount(student: Student): number {
    return student.subjects ? student.subjects.length : 0;
  }

  /**
   * Get subject names as comma-separated string
   */
  getSubjectNames(student: Student): string {
    if (!student.subjects || student.subjects.length === 0) {
      return 'No subjects assigned';
    }
    return student.subjects.map(s => s.subjectCode).join(', ');
  }
}