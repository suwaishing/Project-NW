import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor() { }


  ngOnInit() {
    $('#pagepiling').pagepiling({
      verticalCentered: false,
      css3: false,
      sectionsColor: ['white', '#E8E8E8', '#f2f2f2'],
      onLeave: function (index, nextIndex, direction) {
  
          //fading out the txt of the leaving section
          $('.section').eq(index - 1).find('h1, p').fadeOut(700, 'easeInQuart');
  
          //fading in the text of the destination (in case it was fadedOut)
          $('.section').eq(nextIndex - 1).find('h1, p').fadeIn(700, 'easeInQuart');
  
  
          //reaching our last section? The one with our normal site?
          if (nextIndex == 3) {
              $('#arrow').hide();
  
              //fading out navigation bullets
              $('#pp-nav').fadeOut();

          }
  
          //leaving our last section? The one with our normal site?
          if (index == 3) {
              $('#arrow').show();
  
              //fadding in navigation bullets
              $('#pp-nav').fadeIn();
  
              $('#section3 .content').animate({
                  top: '100%'
              }, 700, 'easeInQuart');
          }
      },
  });
  
    $('#arrow').click(function () {
        $.fn.pagepiling.moveSectionDown();
    });
  }
 

}
