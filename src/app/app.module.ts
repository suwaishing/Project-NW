import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SalaryComponent } from './salary/salary.component';
import { NavComponent } from './nav/nav.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { ResultComponent } from './net-worth/result.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TranslateComponent } from './shared/translate.component';
import { appRoutes } from './routes';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { RouterModule } from '@angular/router';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Angulartics2Module } from 'angulartics2';
import { FusionChartsModule } from 'angular-fusioncharts';
import { ShareButtonModule } from '@ngx-share/button';

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';


FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    NetWorthComponent,
    ResultComponent,
    SalaryComponent,
    NavComponent,
    WelcomeComponent,
    TranslateComponent,
    PageNotFoundComponent
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
    FusionChartsModule,
    ScrollToModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    Angulartics2Module.forRoot(),
    ShareButtonModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
