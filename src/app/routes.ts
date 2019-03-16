import { Routes } from '@angular/router'
import { SalaryComponent } from './salary/salary.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const appRoutes: Routes = [
    
    { path: '', redirectTo: '/welcome', pathMatch: "full"},
    { path: 'net-worth', component: NetWorthComponent},
    { path: 'welcome', component: WelcomeComponent},
    { path: 'salary', component: SalaryComponent}
]