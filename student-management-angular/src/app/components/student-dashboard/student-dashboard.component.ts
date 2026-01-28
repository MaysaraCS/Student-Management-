import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {

  username: string = '';
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private storage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    console.log('Student Dashboard loaded for:', this.username);
  }

  logout(): void {
    this.storage.logoutStorage();
    this.router.navigate(['/landing']);
  }
}