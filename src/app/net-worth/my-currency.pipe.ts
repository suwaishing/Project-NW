import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {
  private K_SEP: string;
  constructor() {
    this.K_SEP=",";
  }
  transform(value: number): string {
    let m_val = value.toString();
    m_val
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, this.K_SEP);
    return m_val;
  }
}
