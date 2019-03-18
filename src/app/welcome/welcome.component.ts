import { Component, OnInit, OnChanges, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

declare var $:any;

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor() { }
  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "dots": true,
    "vertical": true,
    "arrows" : false,
    "speed" : 1200
  };
  
 
  ngOnInit() {}
    
}
