import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SalaryComponent } from './salary/salary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Space3DigitsDirective } from './shared/space3-digits.directive';
import { NetWorthComponent } from './net-worth/net-worth.component';

@NgModule({
  declarations: [
    AppComponent,
    SalaryComponent,
    Space3DigitsDirective,
    AppComponent,
    NetWorthComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
