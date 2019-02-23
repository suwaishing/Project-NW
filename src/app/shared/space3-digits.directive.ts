import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[Space3Digits]'
})
export class Space3DigitsDirective {

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // let numbers = [];
    // for (let i = 0; i < trimmed.length; i += 3) {
    //   numbers.push(trimmed.substr(i, 3));
    // }
    // input.value = numbers.join(' ');

  }
}
