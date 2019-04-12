import { Component, OnInit, Inject } from '@angular/core';




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
  }
  closeMenu(){
    this.menuOpened=true;
    this.menuClosed=false;
  }

  ngOnInit() {
  }

}
