import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  imports: [],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit{

  message = 'Some Welcome Message'
  username = ''
  constructor( private route: ActivatedRoute, private router:Router){}

  ngOnInit(): void {
      this.username = this.route.snapshot.params['username'];
      // Only auto-navigate to student-dashboard if just logged in
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      sessionStorage.removeItem('justLoggedIn');
      setTimeout(() => {
        this.router.navigate(['student-dashboard',this.username]);
      }, 1000); // 1 second delay
    }
  }
}
