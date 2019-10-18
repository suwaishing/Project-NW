import { Component, OnInit } from '@angular/core';
import { welcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private welcomeCanvas = 'welcomeCanvas';

  constructor(private welService: welcomeService) { }

  ngOnInit() {
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.dot');
    document.addEventListener('mousemove',e=>{
      cursor.setAttribute("style","top:"+(e.pageY-22)+"px;left:"+(e.pageX-22)+"px;");
      dot.setAttribute("style","top:"+(e.pageY-4)+"px;left:"+(e.pageX-4)+"px;");
    });
    document.addEventListener('mousedown',e=>{
      cursor.classList.add("MouseDown");
      dot.classList.add("MouseUp");
      cursor.classList.remove("MouseUp");
      dot.classList.remove("MouseDown");
    });
    document.addEventListener('mouseup',e=>{
      cursor.classList.remove("MouseDown");
      dot.classList.remove("MouseUp");
      cursor.classList.add("MouseUp");
      dot.classList.add("MouseDown");
    });
    this.welService.InitThree(this.welcomeCanvas);
    this.welService.FirstInit();
  }

}
