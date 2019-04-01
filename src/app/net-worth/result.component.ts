import { Component, Input, OnChanges } from '@angular/core';
import { INet, INetResult } from './net-worth.model';
import { DecimalPipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'net-worth-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']

})

export class ResultComponent implements OnChanges {
  @Input() data: INet;
  dataResult: INetResult = {};
  assetLabels: string[]
  debtLabels: string[]
  assetData: number[]
  debtData: number[]
  growth: FormGroup
  assetRatio: FormControl
  debtRatio: FormControl
  netWorthData: [{
    data: number[],
    label: string
  }] 
  netWorthLabel: string
  CurrentYear:number = new Date().getFullYear()
  yearLabels= Array(10).fill(0).map((e,i)=>(i+this.CurrentYear).toString())
  constructor(translate: TranslateService) {
    translate.stream('NetWorth.AssetLabels').subscribe((text) => this.assetLabels=text);
    translate.stream('NetWorth.DebtLabels').subscribe((text) => this.debtLabels=text);
    translate.stream('NetWorth.BarLabel').subscribe((text) => this.netWorthLabel=text);
    
  }
  
  stringToFloat(arg): number {
    if (arg == null) {
      arg = 0
    }
    arg = arg.toString().replace(/,/g, '')
    let result = parseFloat(arg)
    if (isNaN(result)) {
      result = 0
    }
    return result
  }
  
  strObjRecursive(obj) {
    /* - Return object value to number */
	  Object.keys(obj).forEach(key => {
	    if (typeof obj[key] === 'object') obj[key] = this.strObjRecursive(obj[key]);
	    else obj[key] = this.stringToFloat(obj[key])
    });
	  return obj;
	};
  calNetWorth(netWorth) {
    netWorth = this.strObjRecursive(netWorth)
    this.dataResult._cashAndEquivalent = netWorth.cashAndEquivalent.cashOnHand + netWorth.cashAndEquivalent.cashInBank
    this.dataResult._realEstate = netWorth.realEstate.house + netWorth.realEstate.otherRealEstate
    this.dataResult._investment = netWorth.investment.stock + netWorth.investment.bond + netWorth.investment.otherInvestment
    this.dataResult._personalAssets = netWorth.personalAssets.vehicle + netWorth.personalAssets.jewelry + netWorth.personalAssets.personalProperty
    this.dataResult.totalAsset = this.dataResult._cashAndEquivalent + this.dataResult._realEstate + this.dataResult._investment + this.dataResult._personalAssets
    this.dataResult._Liability = netWorth.Liability.mortgage + netWorth.Liability.loan + netWorth.Liability.creditCard + netWorth.Liability.studentLoans + netWorth.Liability.otherDebt
    this.dataResult.ans = this.dataResult.totalAsset - this.dataResult._Liability

  }
  
  options: any = {
    responsive: true,

    legend: {
      display: true,
      position: 'right',
      labels: {
        display: true,
        padding: 20,
        fontSize: 12,

      }
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: (tooltipItem, data) => {
          let label = data.labels[tooltipItem.index];
          let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          let currencyPipe = new DecimalPipe('en');
          let formattedNumber = currencyPipe.transform(datasetLabel) + ' VND';
          return label + ': ' + formattedNumber;
        }
      }
    }
  };
  options3: any = {
    plugins: {
      labels: {
        render:()=>{return ""}
      }
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: (tooltipItem, data) => {
          //let label = data.labels[tooltipItem.index];
          let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          let currencyPipe = new DecimalPipe('en');
          let formattedNumber = currencyPipe.transform(datasetLabel) + ' VND';
          return formattedNumber;
        }
      }
    }
  }

  calAns(assRate:number,liaRate:number){
    /* - Get growth rate of assets and liabilities
       - Make array from 1 to 10 
       - Calulate net worth's growth in 10 years and return to an array*/
    let totalAsset = this.dataResult.totalAsset
    let totalDebt = this.dataResult._Liability
    let from1to10 = Array(10).fill(0).map((e,i)=>(i+1))
    let netFrom1to10 = from1to10.map(item=>Math.round(totalAsset*Math.pow(1+assRate/100,item-1)- totalDebt*Math.pow(1+liaRate/100,item-1)),2)
    return netFrom1to10
  }

  ngOnChanges() {
    this.calNetWorth(this.data)
    this.assetData = [
      this.dataResult._cashAndEquivalent,
      this.dataResult._realEstate,
      this.dataResult._investment,
      this.dataResult._personalAssets
    ]
    this.debtData = [
      this.data.Liability.mortgage,
      this.data.Liability.loan,
      this.data.Liability.creditCard,
      this.data.Liability.studentLoans,
      this.data.Liability.otherDebt
    ]
    this.netWorthData =[{
      data: this.calAns(this.data.growth.assetRatio,this.data.growth.debtRatio),
      label: this.netWorthLabel
    }]
  }

}