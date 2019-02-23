import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NetWorthComponent } from './net-worth/net-worth.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { MyCurrencyPipe } from './net-worth/my-currency.pipe';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    NetWorthComponent,
    MyCurrencyPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
