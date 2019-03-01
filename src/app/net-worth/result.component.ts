import { Component, Input, OnInit } from '@angular/core';
import { INet } from './net-worth.model';

@Component({
  selector: 'net-worth-result',
  templateUrl: './result.component.html',
  styles: [`
    .layout-width{
      width: 100%;
      max-width: 786px;
      margin: 0 auto;
    }
  `]
})
export class ResultComponent {
  @Input() data: INet;
  _cashAndEquivalent: number;
  _realEstate: number;
  _investment: number;
  _personalAssets: number;
  _Liability: number;
  ans: number;
  
  
    this._cashAndEquivalent = this.data.cashAndEquivalent.cashOnHand + this.data.cashAndEquivalent.cashInBank
    this._realEstate = this.data.realEstate.house + this.data.realEstate.otherRealEstate
    this._investment = this.data.investment.stock + this.data.investment.bond + this.data.investment.otherInvestment
    this._personalAssets = this.data.personalAssets.vehicle + this.data.personalAssets.jewelry + this.data.personalAssets.personalProperty
    this._Liability = this.data.Liability.mortgage + this.data.Liability.loan + this.data.Liability.creditCard + this.data.Liability.studentLoans + this.data.Liability.otherDebt
    this.ans = this._cashAndEquivalent + this._realEstate + this._investment + this._personalAssets - this._Liability

}