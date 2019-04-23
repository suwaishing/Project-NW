import { Component, OnInit } from '@angular/core';
declare var $:any;



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor() { }
  menuOpened:boolean=false;
  menuClosed:boolean=true;
  menuClicked:boolean=false;
  
  openMenu(){
    this.menuClicked=true;
    this.menuOpened=!this.menuOpened;
    this.menuClosed=!this.menuClosed;
    let text= this.menuOpened? "hidden" : "auto";
    $("body").css("overflow-y",text);
  
  }
  closeMenu(){
    this.menuOpened=true;
    this.menuClosed=false;
    $("body").css("overflow-y","auto");
  }

  ngOnInit() {
  }

}
