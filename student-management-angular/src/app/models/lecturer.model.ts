/**
 * ANGULAR CONCEPT: Interface
 * Lecturer model with subject relationships
 */

import { Subject } from './subject.model';

export interface Lecturer {
  id: number;                    // Database ID
  name: string;                  // Full name
  username: string;              // Login username
  lecturerId: string;            // Lecturer ID (e.g., LEC001)
  department: string;            // Department name
  email: string;                 // Email address
  mobileNo?: string;             // Optional phone
  subjectCount: number;          // Count of assigned subjects (for display)
  subjects: Subject[];           // Array of assigned subjects
}

/**
 * DTO for creating new lecturer
 */
export interface LecturerCreateRequest {
  name: string;
  username: string;
  password: string;
  lecturerId: string;
  department: string;
  email: string;
}

/**
 * DTO for updating lecturer
 * Can update name, username, department, email, mobile
 */
export interface LecturerUpdateRequest {
  name: string;
  department: string;
  email: string;
  mobileNo?: string;
}

/**
 * DTO for assigning subjects to lecturer
 */
export interface AssignSubjectsRequest {
  lecturerId: number;            // Which lecturer
  subjectIds: number[];          // Which subjects (max 3)
}