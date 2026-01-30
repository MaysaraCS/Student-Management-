/**
 * ANGULAR CONCEPT: Interface
 * Interfaces define the shape/structure of our data objects
 * This ensures type safety in TypeScript
 */

import { Subject } from "./subject.model";

export interface Student {
  id: number;                    // Database primary key (auto-generated)
  name: string;                  // Full name of student
  username: string;              // Login username
  studentId: string;             // Student ID (e.g., STU001)
  faculty: string;               // Faculty/Department
  mobileNo?: string;             // Optional phone number
  enrollmentDate?: string;       // Date when student enrolled
  subjects: Subject[];           // Array of assigned subjects (Relationship)
}

/**
 * DTO for creating new student
 * (Data Transfer Object - what we send to backend)
 */
export interface StudentCreateRequest {
  name: string;
  username: string;
  password: string;
  studentID: string;             // Backend uses camelCase with capitals
  mobileno: string;
  faculty: string;
}

/**
 * DTO for updating student
 * Password not required for updates
 */
export interface StudentUpdateRequest {
  name: string;
  username: string;
  studentID: string;
  mobileno: string;
  faculty: string;
}