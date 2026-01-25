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
  email = ''
  constructor( private route: ActivatedRoute, private router:Router){}

  ngOnInit(): void {
      this.email = this.route.snapshot.params['email'];
      // Only auto-navigate to student-dashboard if just logged in
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      sessionStorage.removeItem('justLoggedIn');
      setTimeout(() => {
        this.router.navigate(['student-dashboard',this.email]);
      }, 1000); // 1 second delay
    }
  }
}
