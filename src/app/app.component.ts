import { Component, OnInit } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics){
    angulartics2GoogleAnalytics.startTracking();
  }
  // isSvgHide=false;
  // svgHide(){
  //   setTimeout(()=>
  //     $('.svg-div').addClass('svg-hidden')
  //   ,2500);
  // }
  ngOnInit(){
    // setTimeout(()=>
    //   this.isSvgHide=true
    // ,2600);
    // this.svgHide();
  }
}
