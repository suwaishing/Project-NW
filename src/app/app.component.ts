import { Component } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent{
  
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics){
    this.svgHide();
    angulartics2GoogleAnalytics.startTracking();
  }

  svgHide(){
    setTimeout(()=>$('.svg-div').addClass('svg-hidden'),2500)
  }
}
