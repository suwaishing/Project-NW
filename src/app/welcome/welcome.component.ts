import { Component, OnInit, ViewChild, AfterViewInit, HostListener, ElementRef } from '@angular/core';
// import "pagepiling.js";

declare var $: any;


@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {


  loadAPI: Promise<any>;

  public loadScript() {        

    var dynamicScripts = ["assets/js/TweenMax.min.js","assets/js/three.min.js","assets/js/background.js"];

    for (var i=0;i<dynamicScripts.length;i++){
      let node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    }
  }
  
  inited:boolean;

  constructor() {
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });
  }


  // pagePilling() {
    
  //   $('#pagepiling').pagepiling({
  //     verticalCentered: false,
  //     css3: false,
  //     onLeave: function (index, nextIndex, direction) {
  //         //fading out the txt of the leaving section
  //         $('.section').eq(index - 1).find('h1, p').fadeOut(700, 'easeInQuart');
  //         //fading in the text of the destination (in case it was fadedOut)
  //         $('.section').eq(nextIndex - 1).find('h1, p').fadeIn(700, 'easeInQuart');

  
  //         //reaching our last section? The one with our normal site?
  //         if (nextIndex == 3) {
  //             $('#arrow').hide();
  
  //             //fading out navigation bullets
  //             $('#pp-nav').fadeOut();

  //         }
  
  //         //leaving our last section? The one with our normal site?
  //         if (index == 3) {
  //             $('#arrow').show();
  
  //             //fadding in navigation bullets
  //             $('#pp-nav').fadeIn();
  
  //             $('#section3 .content').animate({
  //                 top: '100%'
  //             }, 700, 'easeInQuart');
  //         }
  //     },
  //   });
    
  //   $('#arrow').click(function () {
  //       $.fn.pagepiling.moveSectionDown();
  //   });
  // }

  

  // mouseParallax ( id, left, top, mouseX, mouseY, speed ) {
  //   var obj = document.getElementById ( id );

  //   let containerWidth = window.innerWidth;
  //   let containerHeight = window.innerHeight;

  //   obj.style.left = left - ( ( ( mouseX - ( parseInt( (obj.offsetWidth).toString() ) / 2 + left ) ) / containerWidth ) * speed ) + 'px';
  //   obj.style.top = top - ( ( ( mouseY - ( parseInt( (obj.offsetHeight).toString() ) / 2 + top ) ) / containerHeight ) * speed ) + 'px';
  // }


  // sdnLeft
  // sdnTop
  // ssLeft
  // ssTop
  // stLeft
  // stTop
  // sxLeft
  // sxTop

  // ngAfterViewInit() {
  //   this.sdnLeft = document.getElementById ( 'shapedoughnut' ).offsetLeft;
  //   this.sdnTop = document.getElementById ( 'shapedoughnut' ).offsetTop,

  //   this.ssLeft = document.getElementById ( 'shapesquare' ).offsetLeft,
  //   this.ssTop = document.getElementById ( 'shapesquare' ).offsetTop,

  //   this.stLeft = document.getElementById ( 'shapetriangle' ).offsetLeft,
  //   this.stTop = document.getElementById ( 'shapetriangle' ).offsetTop,

  //   this.sxLeft = document.getElementById ( 'shapex' ).offsetLeft,
  //   this.sxTop = document.getElementById ( 'shapex' ).offsetTop;
  // }

  // @HostListener('document:mousemove', ['$event'])
  // onmousemove(e:MouseEvent){
  //   var x = e.clientX ,
  //     y = e.clientY ;

  //     this.mouseParallax ( 'shapedoughnut', this.sdnLeft, this.sdnTop, x, y, 20 );
  //     this.mouseParallax ( 'shapesquare', this.ssLeft, this.ssTop, x, y, 30 );
  //     this.mouseParallax ( 'shapetriangle', this.stLeft, this.stTop, x, y, 45 );
  //     this.mouseParallax ( 'shapex', this.sxLeft, this.sxTop, x, y, 65 );
  // }

  ngOnInit() {
    // this.pagePilling();
  }


}
