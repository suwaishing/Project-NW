import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { INet, INetResult } from './net-worth.model';

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
export class ResultComponent implements OnChanges {
  @Input() data: INet;
  dataResult: INetResult={};
  pieChartLabels = ['Tiền và tương đương tiền','Bất động sản', 'Đầu tư', 'Tài sản cá nhân'];
  pieChartData : number [];
  
  stringToFloat(arg): number {
    if (arg==null) {
      arg=0
    } 
    arg = arg.toString().replace(/,/g, '')
    let result = parseFloat(arg)
    if (isNaN(result)) {
      result = 0
    }
    return result
  }
  
  calNetWorth(netWorth) {
    netWorth.cashAndEquivalent.cashOnHand = this.stringToFloat(netWorth.cashAndEquivalent.cashOnHand)
    netWorth.cashAndEquivalent.cashInBank = this.stringToFloat(netWorth.cashAndEquivalent.cashInBank)
    this.dataResult._cashAndEquivalent=netWorth.cashAndEquivalent.cashOnHand+netWorth.cashAndEquivalent.cashInBank

    netWorth.realEstate.house = this.stringToFloat(netWorth.realEstate.house)
    netWorth.realEstate.otherRealEstate = this.stringToFloat(netWorth.realEstate.otherRealEstate)
    this.dataResult._realEstate=netWorth.realEstate.house+netWorth.realEstate.otherRealEstate
   
    netWorth.investment.stock = this.stringToFloat(netWorth.investment.stock)
    netWorth.investment.bond = this.stringToFloat(netWorth.investment.bond)
    netWorth.investment.otherInvestment = this.stringToFloat(netWorth.investment.otherInvestment)
    this.dataResult._investment = netWorth.investment.stock + netWorth.investment.bond + netWorth.investment.otherInvestment
    
    netWorth.personalAssets.vehicle = this.stringToFloat(netWorth.personalAssets.vehicle)
    netWorth.personalAssets.jewelry = this.stringToFloat(netWorth.personalAssets.jewelry)
    netWorth.personalAssets.personalProperty = this.stringToFloat(netWorth.personalAssets.personalProperty)
    this.dataResult._personalAssets = netWorth.personalAssets.vehicle + netWorth.personalAssets.jewelry + netWorth.personalAssets.personalProperty
     
    netWorth.Liability.mortgage = this.stringToFloat(netWorth.Liability.mortgage)
    netWorth.Liability.loan = this.stringToFloat(netWorth.Liability.loan)
    netWorth.Liability.creditCard = this.stringToFloat(netWorth.Liability.creditCard)
    netWorth.Liability.studentLoans = this.stringToFloat(netWorth.Liability.studentLoans)
    netWorth.Liability.otherDebt = this.stringToFloat(netWorth.Liability.otherDebt)
    this.dataResult._Liability = netWorth.Liability.mortgage + netWorth.Liability.loan + netWorth.Liability.creditCard + netWorth.Liability.studentLoans + netWorth.Liability.otherDebt

    this.dataResult.ans = this.dataResult._cashAndEquivalent + this.dataResult._realEstate + this.dataResult._investment + this.dataResult._personalAssets - this.dataResult._Liability

  }
  ngOnChanges() {
    this.calNetWorth(this.data)
    this.pieChartData=[
      /* this.dataResult._cashAndEquivalent,
      this.dataResult._realEstate,
      this.dataResult._investment,
      this.dataResult._personalAssets */
      100,500,200,700
    ]
      
  }
  
}