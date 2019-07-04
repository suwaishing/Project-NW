import { Component, OnInit } from '@angular/core';
import { welcomeService } from './welcome.service';


@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit{
  private welcomeCanvas = 'welcomeCanvas';

  // loadAPI: Promise<any>;

  // public loadScript() {

  //   var dynamicScripts = [
  //     "assets/js/TweenMax.min.js",
  //     "assets/js/TimelineLite.min.js",
  //     "assets/js/three.min.js",
  //     "assets/js/cannon.js",
  //     "assets/js/GLTFLoader.js",
  //     "assets/js/OrbitControls.js",
  //     "assets/js/CannonDebugRenderer.js",
  //     "assets/js/welcome.js"
  //   ];

  //   for (var i=0;i<dynamicScripts.length;i++){
  //     let node = document.createElement('script');
  //     node.src = dynamicScripts[i];
  //     node.type = 'text/javascript';
  //     node.async = false;
  //     node.charset = 'utf-8';
  //     document.getElementsByTagName('head')[0].appendChild(node);
  //   }
  // }


  constructor(private welService: welcomeService) {
    // this.loadAPI = new Promise((resolve) => {
    //   this.loadScript();
    //   resolve(true);
    // });
  }

  ngOnInit() {
    this.welService.InitThree(this.welcomeCanvas);
    this.welService.InitStuffs();
    this.welService.animate();
  }


}
