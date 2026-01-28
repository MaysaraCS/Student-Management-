import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api_URL } from '../app.constants';
import { SignupResponse } from '../models/signup-response';
import { StudentSignupRequest } from '../models/student-signup-request';
import { StudentLoginRequest } from '../models/student-login-request';
import { AuthResponse } from '../models/auth-response';
import { LecturerUsernamesResponse } from '../models/lecturer-usernames-response';
import { LecturerLoginRequest } from '../models/lecturer-login-request';
import { AdminLoginRequest } from '../models/admin-login-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // ==================== STUDENT ENDPOINTS ====================
  
  /**
   * Student Registration
   * POST /api/auth/student/register
   */
  studentRegister(request: StudentSignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${Api_URL}/auth/student/register`, request);
  }

  /**
   * Student Login
   * POST /api/auth/student/login
   */
  studentLogin(request: StudentLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${Api_URL}/auth/student/login`, request);
  }

  // ==================== LECTURER ENDPOINTS ====================
  
  /**
   * Get Lecturer Usernames for Dropdown
   * GET /api/auth/lecturer/usernames
   */
  getLecturerUsernames(): Observable<LecturerUsernamesResponse> {
    return this.http.get<LecturerUsernamesResponse>(`${Api_URL}/auth/lecturer/usernames`);
  }

  /**
   * Lecturer Login
   * POST /api/auth/lecturer/login
   */
  lecturerLogin(request: LecturerLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${Api_URL}/auth/lecturer/login`, request);
  }

  // ==================== ADMIN ENDPOINTS ====================
  
  /**
   * Admin Login (Simplified OAuth)
   * POST /api/auth/admin/login
   */
  adminLogin(request: AdminLoginRequest): Observable<AuthResponse> {
    // For simplified implementation, we'll send password instead of OAuth
    const payload = {
      email: request.email,
      oauthProvider: 'SIMPLE_AUTH',
      oauthToken: request.password // Using password as token for simplicity
    };
    return this.http.post<AuthResponse>(`${Api_URL}/auth/admin/login`, payload);
  }

  // ==================== DASHBOARD ENDPOINTS ====================
  
  /**
   * Student Dashboard
   * GET /api/student/dashboard
   */
  studentDashboard(): Observable<any> {
    return this.http.get<any>(`${Api_URL}/student/dashboard`);
  }

  /**
   * Lecturer Dashboard
   * GET /api/lecturer/dashboard
   */
  lecturerDashboard(): Observable<any> {
    return this.http.get<any>(`${Api_URL}/lecturer/dashboard`);
  }

  /**
   * Admin Dashboard
   * GET /api/admin/dashboard
   */
  adminDashboard(): Observable<any> {
    return this.http.get<any>(`${Api_URL}/admin/dashboard`);
  }
}