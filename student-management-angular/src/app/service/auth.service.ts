import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupRequest } from '../models/signup-request';
import { Observable } from 'rxjs';
import { SignupResponse } from '../models/signup-response';
import { Api_URL } from '../app.constants';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(request:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${Api_URL}/doLogin`,request);
  }
  register(request:SignupRequest):Observable<SignupResponse>{
    return this.http.post<SignupResponse>(`${Api_URL}/doRegister`,request);
  }
  studentDashboard():Observable<any>{
    //TODO in Backend
    return this.http.get<any>(`${Api_URL}/studentDashboard`);
  }
  lecturerDashboard():Observable<any>{
    //TODO in Backend
    return this.http.get<any>(`${Api_URL}/lecturerDashboard`);
  }
  adminDashboard():Observable<any>{
    //TODO in Backend
    return this.http.get<any>(`${Api_URL}/adminDashboard`);
  }
}
