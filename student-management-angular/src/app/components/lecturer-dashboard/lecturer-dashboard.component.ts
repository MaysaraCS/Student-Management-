import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lecturer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecturer-dashboard.component.html',
  styleUrl: './lecturer-dashboard.component.css'
})
export class LecturerDashboardComponent implements OnInit {

  username: string = '';
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private storage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    console.log('Lecturer Dashboard loaded for:', this.username);
  }

  logout(): void {
    this.storage.logoutStorage();
    this.router.navigate(['/landing']);
  }
}