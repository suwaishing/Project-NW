import { Routes } from '@angular/router'
import { SalaryComponent } from './salary/salary.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
<<<<<<< HEAD
import { AnnualSalaryComponent } from './annual-salary/annual-salary.component';

=======
import { WelcomeComponent } from './welcome/welcome.component';
>>>>>>> ae21852943d819fbe2fcde61092150009a1f2069

export const appRoutes: Routes = [
    
    { path: '', redirectTo: '/welcome', pathMatch: "full"},
    { path: 'net-worth', component: NetWorthComponent},
<<<<<<< HEAD
    { path: 'salary', component: SalaryComponent},
    { path: 'annual', component: AnnualSalaryComponent}
=======
    { path: 'welcome', component: WelcomeComponent},
    { path: 'salary', component: SalaryComponent}
>>>>>>> ae21852943d819fbe2fcde61092150009a1f2069
]