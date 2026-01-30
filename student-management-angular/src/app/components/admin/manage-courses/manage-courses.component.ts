import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from '../../../models/subject.model';
import { SubjectService } from '../../../service/subject.service';

/**
 * MANAGE COURSES COMPONENT
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
 * 
 * 3. To get lecturer names:
 *    - We could enhance the backend to return lecturer names
 *    - Or we could fetch all lecturers and match by subject
 *    - For now, we show counts (simpler and faster)
 */
@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css'
})
export class ManageCoursesComponent implements OnInit {

  subjects: Subject[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private subjectService: SubjectService,
    private router: Router
  ) {}

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