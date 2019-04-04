import { Routes } from '@angular/router'
import { SalaryComponent } from './salary/salary.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const appRoutes: Routes = [

    { path: '', component: WelcomeComponent },
    { path: 'net-worth', component: NetWorthComponent },
    { path: 'salary', component: SalaryComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: '**', component: PageNotFoundComponent }
]