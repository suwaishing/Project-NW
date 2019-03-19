import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor() { }
  slideConfig = {
    "slidesToShow": 1,
    //"slidesToScroll": 1,
    "dots": true,
    "vertical": true,
    "verticalSwiping": true,
    "arrows": false,
    "speed": 800,
    "infinite": false,
    "cssEase": 'ease-in-out'
  };
  @ViewChild('slickModal') slickModal;
  slickInit(e) {
    this.mouseWheel()
  }

  mouseWheel() {
    $(window).on('wheel', (event) => {
      event.preventDefault()
      const delta = event.originalEvent.deltaY
      if (delta < 0) {
        this.slickModal.slickPrev()
      }
      else {
        this.slickModal.slickNext()
      }
    })
  }
  ngOnInit() {
  }

}
