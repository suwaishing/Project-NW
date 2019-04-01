import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-translate',
  templateUrl: 'translate.component.html',
})
export class TranslateComponent{

  constructor(public translate: TranslateService) { 
    translate.addLangs(['en', 'vi', 'jp', 'cn']);
    translate.setDefaultLang('vi');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/vi|en|jp|cn/) ? browserLang : 'vi');
  }

}
