import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lecturer, LecturerCreateRequest, LecturerUpdateRequest } from '../../../models/lecturer.model';
import { Subject } from '../../../models/subject.model';
import { LecturerService } from '../../../service/lecturer.service';
import { SubjectService } from '../../../service/subject.service';

@Component({
  selector: 'app-manage-lecturers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-lecturers.component.html',
  styleUrl: './manage-lecturers.component.css'
})
export class ManageLecturersComponent implements OnInit {

  lecturers: Lecturer[] = [];
  availableSubjects: Subject[] = [];
  selectedLecturer: Lecturer | null = null;
  
  isLoading: boolean = false;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  showAssignForm: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  createForm: FormGroup;
  editForm: FormGroup;
  selectedSubjectIds: number[] = [];

  constructor(
    private lecturerService: LecturerService,
    private subjectService: SubjectService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      lecturerId: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['']
    });
  }

  ngOnInit(): void {
    this.loadLecturers();
    this.loadSubjects();
  }

  loadLecturers(): void {
    this.isLoading = true;
    this.lecturerService.getAllLecturers().subscribe({
      next: (data) => {
        this.lecturers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load lecturers: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (data) => {
        this.availableSubjects = data;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
      }
    });
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showAssignForm = false;
    this.createForm.reset();
    this.clearMessages();
  }

  createLecturer(): void {
    if (this.createForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    const formValue = this.createForm.value;

    const request: LecturerCreateRequest = {
      name: formValue.name,
      username: formValue.username,
      password: formValue.password,
      lecturerId: formValue.lecturerId,
      department: formValue.department,
      email: formValue.email
    };

    this.lecturerService.createLecturer(request).subscribe({
      next: (response) => {
        this.successMessage = 'Lecturer created successfully!';
        this.showCreateForm = false;
        this.createForm.reset();
        this.loadLecturers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to create lecturer';
        this.isLoading = false;
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.createForm.reset();
    this.clearMessages();
  }

  openEditForm(lecturer: Lecturer): void {
    this.selectedLecturer = lecturer;
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showAssignForm = false;
    this.clearMessages();

    this.editForm.patchValue({
      name: lecturer.name,
      department: lecturer.department,
      email: lecturer.email,
      mobileNo: lecturer.mobileNo || ''
    });
  }

  updateLecturer(): void {
    if (this.editForm.invalid || !this.selectedLecturer) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    const formValue = this.editForm.value;

    const request: LecturerUpdateRequest = {
      name: formValue.name,
      department: formValue.department,
      email: formValue.email,
      mobileNo: formValue.mobileNo
    };

    this.lecturerService.updateLecturer(this.selectedLecturer.id, request).subscribe({
      next: (response) => {
        this.successMessage = 'Lecturer updated successfully!';
        this.showEditForm = false;
        this.selectedLecturer = null;
        this.loadLecturers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to update lecturer';
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.selectedLecturer = null;
    this.editForm.reset();
    this.clearMessages();
  }

  deleteLecturer(lecturer: Lecturer): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete ${lecturer.name}?\\n` +
      `Lecturer ID: ${lecturer.lecturerId}\\n\\n` +
      `This action cannot be undone.`
    );

    if (!confirmDelete) return;

    this.isLoading = true;
    this.lecturerService.deleteLecturer(lecturer.id).subscribe({
      next: (response) => {
        this.successMessage = `Lecturer ${lecturer.name} deleted successfully`;
        this.loadLecturers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to delete lecturer';
        this.isLoading = false;
      }
    });
  }

  openAssignForm(lecturer: Lecturer): void {
    this.selectedLecturer = lecturer;
    this.showAssignForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.clearMessages();
    this.selectedSubjectIds = lecturer.subjects.map(s => s.id);
  }

  toggleSubjectSelection(subjectId: number): void {
    const index = this.selectedSubjectIds.indexOf(subjectId);

    if (index > -1) {
      this.selectedSubjectIds.splice(index, 1);
    } else {
      if (this.selectedSubjectIds.length >= 3) {
        this.errorMessage = 'Lecturers can only be assigned up to 3 subjects';
        return;
      }
      this.selectedSubjectIds.push(subjectId);
    }
    this.errorMessage = '';
  }

  isSubjectSelected(subjectId: number): boolean {
    return this.selectedSubjectIds.includes(subjectId);
  }

  assignSubjects(): void {
    if (!this.selectedLecturer) return;

    if (this.selectedSubjectIds.length === 0) {
      this.errorMessage = 'Please select at least one subject';
      return;
    }

    this.isLoading = true;
    this.lecturerService.assignSubjects(
      this.selectedLecturer.id,
      this.selectedSubjectIds
    ).subscribe({
      next: (response) => {
        this.successMessage = `Subjects assigned successfully to ${this.selectedLecturer!.name}`;
        this.showAssignForm = false;
        this.selectedLecturer = null;
        this.selectedSubjectIds = [];
        this.loadLecturers();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to assign subjects';
        this.isLoading = false;
      }
    });
  }

  cancelAssign(): void {
    this.showAssignForm = false;
    this.selectedLecturer = null;
    this.selectedSubjectIds = [];
    this.clearMessages();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard', 'admin']);
  }

  /**
   * COUNTER LOGIC EXPLANATION:
   * 
   * getSubjectCount() - Returns the number of subjects
   * HOW IT WORKS:
   * 1. Check if lecturer has subjects array
   * 2. Return the length of that array
   * 3. This is calculated from the Many-to-Many relationship
   * 
   * Backend counts it like this:
   * lecturer.getSubjects().size() in Java
   * 
   * The count is stored in the LecturerResponse DTO as 'subjectCount'
   */
  getSubjectCount(lecturer: Lecturer): number {
    return lecturer.subjects ? lecturer.subjects.length : 0;
  }

  getSubjectNames(lecturer: Lecturer): string {
    if (!lecturer.subjects || lecturer.subjects.length === 0) {
      return 'No subjects assigned';
    }
    return lecturer.subjects.map(s => s.subjectCode).join(', ');
  }
}