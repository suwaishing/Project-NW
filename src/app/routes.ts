import { Routes } from '@angular/router'
import { SalaryComponent } from './salary/salary.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { ResultComponent } from './net-worth/result.component';

export const appRoutes: Routes = [
    
    { path: '', redirectTo: '/salary', pathMatch: "full"},
    { path: 'net-worth/form', component: NetWorthComponent},
    { path: 'net-worth/result', component: ResultComponent},
    { path: 'salary', component: SalaryComponent}
]