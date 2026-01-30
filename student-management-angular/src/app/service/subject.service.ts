/**
 * ANGULAR CONCEPT: Service
 * Manages subject/course operations
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api_URL } from '../app.constants';
import { Subject, SubjectRequest } from '../models/subject.model';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private baseUrl = `${Api_URL}/subjects`;

  constructor(private http: HttpClient) { }

  /**
   * Get all subjects
   * 
   * Returns subjects with:
   * - id, subjectName, subjectCode
   * - lecturerCount: How many lecturers teach this
   * - studentCount: How many students enrolled
   * 
   * COUNTER LOGIC EXPLANATION:
   * The backend counts relationships:
   * - lecturerCount = subject.getLecturers().size()
   * - studentCount = subject.getStudents().size()
   * 
   * This is done in the SubjectService.convertToResponse() method
   */
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.baseUrl);
  }

  /**
   * Get subject by ID
   */
  getSubjectById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new subject
   */
  createSubject(request: SubjectRequest): Observable<Subject> {
    return this.http.post<Subject>(this.baseUrl, request);
  }

  /**
   * Update subject
   */
  updateSubject(id: number, request: SubjectRequest): Observable<Subject> {
    return this.http.put<Subject>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * Delete subject
   * 
   * IMPORTANT: Can only delete if not assigned to any students/lecturers
   * Backend will throw error if subject is in use
   */
  deleteSubject(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Search subjects by name
   */
  searchSubjects(name: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.baseUrl}/search?name=${name}`);
  }
}