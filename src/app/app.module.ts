import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { SalaryComponent } from './salary/salary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { ResultComponent } from './net-worth/result.component';
import { ThongTinVungService } from './salary/ThongTinVung.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import 'chartjs-plugin-labels';
import { NumScrollDirective } from './num-scroll.directive';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    NetWorthComponent,
    ResultComponent,
    SalaryComponent,
    NavComponent,
    NumScrollDirective,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    NgxCleaveDirectiveModule,
    RouterModule.forRoot(appRoutes),
    ChartsModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    ThongTinVungService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
