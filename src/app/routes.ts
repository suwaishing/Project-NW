import { Routes } from '@angular/router'
import { SalaryComponent } from './salary/salary.component';
import { NetWorthComponent } from './net-worth/net-worth.component';

export const appRoutes: Routes = [
    
    { path: '', redirectTo: '/salary', pathMatch: "full"},
    { path: 'net-worth', component: NetWorthComponent},
    { path: 'salary', component: SalaryComponent}
]