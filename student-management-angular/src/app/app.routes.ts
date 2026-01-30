import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { ErrorComponent } from './components/error/error.component';
import { RouteGuardService } from './service/guards/route-guard.service';
import { LayoutComponent } from './components/layout/layout.component';
import { LecturerDashboardComponent } from './components/lecturer-dashboard/lecturer-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { Role } from './models/roles.enum';
import { LandingComponent } from './components/landing/landing.component';
import { StudentRegisterComponent } from './components/student-register/student-register.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { LecturerLoginComponent } from './components/lecturer-login/lecturer-login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { ManageStudentsComponent } from './components/admin/manage-students/manage-students.component';
import { ManageLecturersComponent } from './components/admin/manage-lecturers/manage-lecturers.component';
import { ManageCoursesComponent } from './components/admin/manage-courses/manage-courses.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/landing',
        pathMatch: 'full'
    },
    {
        path: 'landing',
        component: LandingComponent
    },
    {
        path: 'student-register',
        component: StudentRegisterComponent
    },
    {
        path: 'student-login',
        component: StudentLoginComponent
    },
    {
        path: 'lecturer-login',
        component: LecturerLoginComponent
    },
    {
        path: 'admin-login',
        component: AdminLoginComponent
    },
    {
        path: '', 
        component: LayoutComponent,
        children: [
            { 
                path: 'student-dashboard/:username', 
                component: StudentDashboardComponent, 
                canActivate: [RouteGuardService],
                data: { roles: [Role.STUDENT] }
            },
            {
                path: 'lecturer-dashboard/:username', 
                component: LecturerDashboardComponent, 
                canActivate: [RouteGuardService],
                data: { roles: [Role.LECTURER] }
            },
            {
                path: 'admin-dashboard/:username', 
                component: AdminDashboardComponent, 
                canActivate: [RouteGuardService],
                data: { roles: [Role.ADMIN] }
            },
            {
                path: 'admin/manage-students',
                component: ManageStudentsComponent,
                canActivate: [RouteGuardService],
                data: { roles: [Role.ADMIN] }
            },
            {
                path: 'admin/manage-lecturers',
                component: ManageLecturersComponent,
                canActivate: [RouteGuardService],
                data: { roles: [Role.ADMIN] }
            },
            {
                path: 'admin/manage-courses',
                component: ManageCoursesComponent,
                canActivate: [RouteGuardService],
                data: { roles: [Role.ADMIN] }
            }
        ]
    },
    {
        path: '**',
        component: ErrorComponent
    }
];