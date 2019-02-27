import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SalaryComponent } from './salary/salary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { Space3DigitsDirective } from './shared/space3-digits.directive';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { ResultComponent } from './net-worth/result.component';

@NgModule({
  declarations: [
    AppComponent,
    NetWorthComponent,
    ResultComponent,
    SalaryComponent,
    NavComponent,
    Space3DigitsDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NgxCleaveDirectiveModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
