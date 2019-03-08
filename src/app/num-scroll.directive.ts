import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[scroll]'
})
export class NumScrollDirective {

  constructor(
    private el: ElementRef) { }
  @HostListener('mousewheel', ['$event']) onmousewheel(event) {
    //let focusedEl = document.activeElement;
    let focusedEl = this.el.nativeElement;

    event.preventDefault();
    var max = null;
    var min = null;
    if (focusedEl.hasAttribute('max')) {
      max = focusedEl.getAttribute('max');
    }
    if (focusedEl.hasAttribute('min')) {
      min = focusedEl.getAttribute('min');
    }
    var value = parseInt(focusedEl.value, 10);
    if (event.deltaY < 0) {
      value++;
      if (max !== null && value > max) {
        value = max;
      }
    } else {
      value--;
      if (min !== null && value < min) {
        value = min;
      }
    }
    focusedEl.value = value;
  }
  
}
