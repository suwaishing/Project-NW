import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
declare var $:any;



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) { }
  menuOpened:boolean=false;
  menuClosed:boolean=true;
  menuClicked:boolean=false;
  openMenu(){
    this.menuClicked=true;
    this.menuOpened=!this.menuOpened;
    this.menuClosed=!this.menuClosed;
    this.toggleHtmlScrollbar();
  }
  toggleHtmlScrollbar(){
    this.document.body.classList.toggle('disabled-scroll');
  }
  ngOnInit() {
  }

}
