import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { ErrorComponent } from './components/error/error.component';
import { RouteGuardService } from './service/guards/route-guard.service';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LecturerDashboardComponent } from './components/lecturer-dashboard/lecturer-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

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
        path:'register',
        component:RegisterComponent
    },
    {
        path: '', component: LayoutComponent,
        children: [
            { 
                path: 'student-dashboard/:username', 
                component: StudentDashboardComponent, 
                canActivate: [RouteGuardService] 
            },
            {
                path: 'lecturer-dashboard/:username', 
                component: LecturerDashboardComponent, 
                canActivate: [RouteGuardService]
            },
            {
                path: 'admin-dashboard/:username', 
                component: AdminDashboardComponent, 
                canActivate: [RouteGuardService]
            }
        ]
    },
    {
        path:'**',
        component:ErrorComponent
    },

];
