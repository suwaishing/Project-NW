import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[Space3Digits]'
})
export class Space3DigitsDirective {

  @HostListener('input', ['$event'])keypress(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
