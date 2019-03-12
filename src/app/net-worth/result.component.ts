import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { INet, INetResult } from './net-worth.model';
//import 'chartjs-plugin-labels';
import { DecimalPipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'net-worth-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']

})

export class ResultComponent implements OnChanges,OnInit {
  @Input() data: INet;
  dataResult: INetResult = {};
  assetLabels = ['Tiền', 'Bất động sản', 'Đầu tư', 'Tài sản cá nhân']
  debtLabels = ['Vay thế chấp', 'Vay trả góp', 'Vay tín dụng', 'Vay học phí', 'Khoản nợ khác']
  netWorthLabels = Array(10).fill(0).map((e,i)=>'Năm '+ (i+1).toString())
  assetData: number[]
  debtData: number[]
  growth: FormGroup
  assetRatio: FormControl;
  debtRatio: FormControl;
  netWorthData: [{
    data: number[],
    label: string
  }] 

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

  calNetWorth(netWorth) {
    netWorth.cashAndEquivalent.cashOnHand = this.stringToFloat(netWorth.cashAndEquivalent.cashOnHand)
    netWorth.cashAndEquivalent.cashInBank = this.stringToFloat(netWorth.cashAndEquivalent.cashInBank)
    this.dataResult._cashAndEquivalent = netWorth.cashAndEquivalent.cashOnHand + netWorth.cashAndEquivalent.cashInBank

    netWorth.realEstate.house = this.stringToFloat(netWorth.realEstate.house)
    netWorth.realEstate.otherRealEstate = this.stringToFloat(netWorth.realEstate.otherRealEstate)
    this.dataResult._realEstate = netWorth.realEstate.house + netWorth.realEstate.otherRealEstate

    netWorth.investment.stock = this.stringToFloat(netWorth.investment.stock)
    netWorth.investment.bond = this.stringToFloat(netWorth.investment.bond)
    netWorth.investment.otherInvestment = this.stringToFloat(netWorth.investment.otherInvestment)
    this.dataResult._investment = netWorth.investment.stock + netWorth.investment.bond + netWorth.investment.otherInvestment

    netWorth.personalAssets.vehicle = this.stringToFloat(netWorth.personalAssets.vehicle)
    netWorth.personalAssets.jewelry = this.stringToFloat(netWorth.personalAssets.jewelry)
    netWorth.personalAssets.personalProperty = this.stringToFloat(netWorth.personalAssets.personalProperty)
    this.dataResult._personalAssets = netWorth.personalAssets.vehicle + netWorth.personalAssets.jewelry + netWorth.personalAssets.personalProperty
    
    this.dataResult.totalAsset = this.dataResult._cashAndEquivalent + this.dataResult._realEstate + this.dataResult._investment + this.dataResult._personalAssets
    
    netWorth.Liability.mortgage = this.stringToFloat(netWorth.Liability.mortgage)
    netWorth.Liability.loan = this.stringToFloat(netWorth.Liability.loan)
    netWorth.Liability.creditCard = this.stringToFloat(netWorth.Liability.creditCard)
    netWorth.Liability.studentLoans = this.stringToFloat(netWorth.Liability.studentLoans)
    netWorth.Liability.otherDebt = this.stringToFloat(netWorth.Liability.otherDebt)
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
        render: 'value'
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
  }
  calAns(assRate:number,liaRate:number){
    let totalAsset = this.dataResult.totalAsset
    let totalDebt = this.dataResult._Liability
    let from1to10 = Array(10).fill(0).map((e,i)=>(i+1))
    let netFrom1to10 = from1to10.map(item=>Math.round(totalAsset*Math.pow(1+assRate/100,item-1)- totalDebt*Math.pow(1+liaRate/100,item-1)))
    return netFrom1to10
  }
  /* _assetRatio: number
  get assetRatio():number {
    return this._assetRatio
  }
  set assetRatio(value: number) {
    this._assetRatio =value
  } */

  _assetRatio: number =10
  _debtRatio: number =2
  netWorthArr: number[]=[]
  onSubmit(growth) {
    this._assetRatio = growth.assetRatio
    this._debtRatio = growth.debtRatio
    this.netWorthArr = this.calAns(this._assetRatio, this._debtRatio)
    
    this.netWorthData[0].data = this.netWorthArr
    console.log(this.netWorthData[0].data)
    this.netWorthData[0].label="Giá trị tài sản ròng"
  }
  
  ngOnInit() {
    this.growth = new FormGroup({
      assetRatio: new FormControl(''),
      debtRatio: new FormControl('')
    })
    
  }
  
  ngOnChanges() {
    this.calNetWorth(this.data)
    this.assetData = [
      /* this.dataResult._cashAndEquivalent,
      this.dataResult._realEstate,
      this.dataResult._investment,
      this.dataResult._personalAssets */
      15000, 25000, 100000, 50000
    ]
    this.debtData = [
      /* this.data.Liability.mortgage,
      this.data.Liability.loan,
      this.data.Liability.creditCard,
      this.data.Liability.studentLoans,
      this.data.Liability.otherDebt */
      18000, 30000, 80000, 100000, 45000
    ]
    //console.log(this.netWorthArr)
  }

}