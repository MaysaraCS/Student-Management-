/**
 * ANGULAR CONCEPT: Service
 * Handles all lecturer-related API operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api_URL } from '../app.constants';
import { Lecturer, LecturerCreateRequest, LecturerUpdateRequest } from '../models/lecturer.model';


@Injectable({
  providedIn: 'root'
})
export class LecturerService {

  private baseUrl = `${Api_URL}/admin/lecturers`;

  constructor(private http: HttpClient) { }

  /**
   * Get all lecturers with their assigned subjects
   * 
   * This endpoint returns lecturer data with:
   * - Basic info (name, department, email, etc.)
   * - subjectCount: Number of subjects assigned
   * - subjects: Array of subject objects
   */
  getAllLecturers(): Observable<Lecturer[]> {
    return this.http.get<Lecturer[]>(`${this.baseUrl}/with-subjects`);
  }

  /**
   * Get single lecturer by ID with subjects
   */
  getLecturerById(id: number): Observable<Lecturer> {
    return this.http.get<Lecturer>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new lecturer
   * 
   * Required fields:
   * - name, username, password
   * - lecturerId (unique), department, email
   */
  createLecturer(request: LecturerCreateRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl, request);
  }

  /**
   * Update lecturer details
   * 
   * Can update: name, department, email, mobileNo
   * Cannot update: username, lecturerId (these are unique identifiers)
   */
  updateLecturer(id: number, request: LecturerUpdateRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * Delete lecturer
   * All subject assignments are automatically removed
   */
  deleteLecturer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Assign subjects to lecturer (max 3 subjects)
   * 
   * BUSINESS RULE: Each lecturer can teach maximum 3 subjects
   * This is enforced by the backend
   * 
   * @param lecturerId - Which lecturer
   * @param subjectIds - Array of subject IDs (max 3)
   */
  assignSubjects(lecturerId: number, subjectIds: number[]): Observable<any> {
    const request = {
      lecturerId: lecturerId,
      subjectIds: subjectIds
    };
    return this.http.post<any>(`${Api_URL}/admin/assign/lecturer`, request);
  }

  /**
   * Remove a subject from lecturer
   */
  removeSubject(lecturerId: number, subjectId: number): Observable<any> {
    return this.http.delete<any>(
      `${Api_URL}/admin/assign/lecturer/${lecturerId}/subject/${subjectId}`
    );
  }
}