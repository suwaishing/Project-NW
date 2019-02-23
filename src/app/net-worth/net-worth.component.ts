import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.css']
})
export class NetWorthComponent implements OnInit {
  _addComma: number;

  
  get addComma() : number {
    return this._addComma;
  }
  
  set addComma(v : number) {
    this._addComma= v;
  }
  
  constructor() { }

  ngOnInit() {
  }

}
