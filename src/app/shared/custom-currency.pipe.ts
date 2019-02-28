import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  
  transform(
    value: number,
    currencyCode: string = 'VND',
    display: string ='code',
    digitsInfo: string="1.0-0",
    locale: string = 'fr',
  ): string | null {
    return formatCurrency(
      value,
      locale,
      currencyCode,
      digitsInfo,
    );

  }
}
