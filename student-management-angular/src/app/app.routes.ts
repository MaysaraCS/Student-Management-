import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { ErrorComponent } from './components/error/error.component';
import { RouteGuardService } from './service/route-guard.service';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'student-dashboard/:email',
        component:StudentDashboardComponent, canActivate:[RouteGuardService]
    },
    {
        path:'**',
        component:ErrorComponent
    },

];
