import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../../service/storage/auth-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  username: string = '';
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private storage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    console.log('Admin Dashboard loaded for:', this.username);
  }

  logout(): void {
    this.storage.logoutStorage();
    this.router.navigate(['/landing']);
  }
}