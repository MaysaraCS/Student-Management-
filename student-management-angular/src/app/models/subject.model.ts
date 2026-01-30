/**
 * ANGULAR CONCEPT: Interface
 * Subject model represents a course/subject in the system
 */

export interface Subject {
  id: number;                    // Database ID
  subjectName: string;           // Name of subject (e.g., "Data Structures")
  subjectCode: string;           // Unique code (e.g., "CS101")
  lecturerCount?: number;        // Number of lecturers teaching this (optional)
  studentCount?: number;         // Number of students enrolled (optional)
}

/**
 * DTO for creating/updating subjects
 */
export interface SubjectRequest {
  subjectName: string;
  subjectCode: string;
}