import { Component, Input, OnChanges, ElementRef, HostListener, ViewChild } from '@angular/core';
import { INet, INetResult } from './net-worth.model';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import * as html2canvas from 'html2canvas';
import { bool } from 'prop-types';
import { isNavigationCancelingError } from '@angular/router/src/shared';

let dataSource01 = {
  chart: {
    enableMultiSlicing: "0",
    showlegend: "1",
    doughnutRadius:"80",
    legendposition: "right",
    baseFont:"Noto Sans SC",
    valueFont:"Noto Sans SC",
    legendItemFont: "Noto Sans SC",
    legendItemFontSize: "14",
    legendIconScale: '1.9',
    showZeroPlaneValue: "0",
    showPercentInTooltip: "1",
    chartLeftMargin: "0",
    chartTopMargin: "0",
    chartBottomMargin: "0",
    chartRightMargin:"10",
    defaultCenterLabel: "",
    showTooltip: "0",
    centerLabel: "$label: $percentValue",
    centerLabelBold: "1",
    centerLabelColor: "52575D",
    theme: "fusion",
  },
  data: [
    {
      label: "Apache",
      displayValue:'abc',
      value: 10,
    },
    {
      label: "Microsoft",
      displayValue:'abc',
      value: 10,
    },
  ]
};

let dataSource02 = {
  chart: {
    enableMultiSlicing: "0",
    doughnutRadius:"80",
    showlegend: "1",
    legendposition: "right",
    baseFont:"Noto Sans SC",
    valueFont:"Noto Sans SC",
    legendItemFont: "Noto Sans SC",
    legendItemFontSize: "14",
    legendIconScale: '1.9',
    showZeroPlaneValue: "0",
    showPercentInTooltip: "1",
    chartLeftMargin: "0",
    chartTopMargin: "0",
    chartBottomMargin: "0",
    chartRightMargin:"10",
    theme: "fusion",
    defaultCenterLabel: "",
    showTooltip: "0",
    centerLabel: "$label: $percentValue",
    centerLabelBold: "1",
    centerLabelColor: "52575D",
    paletteColors:"ad1457,d81b60,ec407a,f06292,f8bbd0"
  },
  data: [
    {
      label: "Apache",
      displayValue:'abc',
      value: 10,
    },
    {
      label: "Microsoft",
      displayValue:'abc',
      value: 10,
    },
  ]
};


@Component({
  selector: 'net-worth-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']

})

export class ResultComponent implements OnChanges {
  @Input() data: INet;
  @Input() currency:string;
  name:string="NET WORTH";
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
  netWorthValue: string
  CurrentYear:number = new Date().getFullYear()
  yearLabels= Array(10).fill(0).map((e,i)=>(i+this.CurrentYear).toString())
  currentLang:string;
  innerWidth = window.innerWidth;

  chartConfiqMobile(){
    dataSource01.chart.legendposition="bottom";
    dataSource01.chart.legendIconScale="1";
    dataSource01.chart.doughnutRadius="60";
    dataSource01.chart.chartRightMargin="0";
    dataSource01.chart.chartBottomMargin="10";
    
    dataSource02.chart.legendposition="bottom";
    dataSource02.chart.legendIconScale="1";
    dataSource02.chart.doughnutRadius="60";
    dataSource02.chart.chartRightMargin="0";
    dataSource02.chart.chartBottomMargin="10";
  }

  constructor(public translate: TranslateService) {
    translate.stream('NetWorth.AssetLabels').subscribe((text) => this.assetLabels=text);
    translate.stream('NetWorth.DebtLabels').subscribe((text) => this.debtLabels=text);
    translate.stream('NetWorth.BarLabel').subscribe((text) => this.netWorthLabel=text);
    this.currentLang=this.translate.currentLang;
    if(this.innerWidth<1000){
      this.chartConfiqMobile()
    }
    this.translate.onLangChange
      .subscribe((langChangeEvent: LangChangeEvent) => {
        this.updateChartData()
      })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth<1000){
      this.chartConfiqMobile()
    } else {
      dataSource01.chart.legendposition="right";
      dataSource01.chart.legendIconScale="1.9";
      dataSource01.chart.doughnutRadius="80";
      dataSource01.chart.chartRightMargin="10";
      dataSource01.chart.chartBottomMargin="0";
      
      dataSource02.chart.legendposition="right";
      dataSource02.chart.legendIconScale="1.9";
      dataSource02.chart.doughnutRadius="80";
      dataSource02.chart.chartRightMargin="10";
      dataSource02.chart.chartBottomMargin="0";
    }
  }
  
  stringToFloat(arg): number {
    if (arg == null) {
      arg = 0
    }
    arg = arg.toString().replace(/,/g, '')
    let result = parseFloat(arg)
    if (isNaN(result)) {
      result = 0;
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

  transform(number: number): any {
    if (isNaN(number)) return null; // will only work value is a number
    if (number === null) return null;
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 2);
    const isNegative = number < 0; // will also work for Negetive numbers
    let isVietnamese =(this.currentLang=='vi'? true:false)
    let key = '';

    let powers = [
      {key: ' Quadrillion', value: Math.pow(10,15)},
      {key: ' Trillion', value: Math.pow(10, 12)},
      {key: ' Billion', value: Math.pow(10, 9)},
      {key: ' Million', value: Math.pow(10, 6)},
      {key: ' Thousand', value: 1000}
    ];

    /* let symbol="$";
    if(this.currency=='VND'){
      symbol="₫";
    } else if(this.currency=='JPY'){
      symbol="JP¥ ";
    } else if(this.currency=='CNY'){
      symbol="CN¥ ";
    }
 */
    switch(this.currentLang){
      case('vi'):
        powers = [
          {key: ' Triệu Tỷ', value: Math.pow(10,15)},
          {key: ' Nghìn Tỷ', value: Math.pow(10, 12)},
          {key: ' Tỷ', value: Math.pow(10, 9)},
          {key: ' Triệu', value: Math.pow(10, 6)},
          {key: ' Nghìn', value: 1000}
        ];
        break;
      case('jp'):
        powers = [
          {key: ' 京', value: Math.pow(10,16)},
          {key: ' 兆', value: Math.pow(10, 12)},
          {key: ' 億', value: Math.pow(10, 8)},
          {key: ' 百万', value: Math.pow(10, 6)},
          {key: ' 万', value: 10000}
        ];
        break;
      case('cn'):
        powers = [
          {key: ' 京', value: Math.pow(10,16)},
          {key: ' 兆', value: Math.pow(10, 12)},
          {key: ' 亿', value: Math.pow(10, 8)},
          {key: ' 百万', value: Math.pow(10, 6)},
          {key: ' 万', value: 10000}
        ];
        break;
    }

    for (let i = 0; i < powers.length; i++) {
        let reduced = abs / powers[i].value;
        reduced = Math.round(reduced * rounder) / rounder;
        if (reduced >= 1) {
            abs = reduced;
            key = powers[i].key;
            break;
        }
    }
    return (isNegative ? '-' : '') +(isVietnamese? abs+key+' '+this.currency : this.currency+' '+abs+key);
  }

  transformDisplay(number: number): any {
    if (isNaN(number)) return null; // will only work value is a number
    if (number === null) return null;
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 2);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    let powers = [
      {key: 'Q', value: Math.pow(10,15)},
      {key: 'T', value: Math.pow(10, 12)},
      {key: 'B', value: Math.pow(10, 9)},
      {key: 'M', value: Math.pow(10, 6)},
      {key: 'k', value: 1000}
    ];

    switch(this.currentLang){
      case('vi'):
        powers = [
          {key: 'Triệu Tỷ', value: Math.pow(10,15)},
          {key: 'Nghìn Tỷ', value: Math.pow(10, 12)},
          {key: 'Tỷ', value: Math.pow(10, 9)},
          {key: 'Triệu', value: Math.pow(10, 6)},
          {key: 'Nghìn', value: 1000}
        ];
        break;
      case('jp'):
        powers = [
          {key: ' 京', value: Math.pow(10,16)},
          {key: ' 兆', value: Math.pow(10, 12)},
          {key: ' 億', value: Math.pow(10, 8)},
          {key: ' 百万', value: Math.pow(10, 6)},
          {key: ' 万', value: 10000}
        ];
        break;
      case('cn'):
        powers = [
          {key: ' 京', value: Math.pow(10,16)},
          {key: ' 兆', value: Math.pow(10, 12)},
          {key: ' 亿', value: Math.pow(10, 8)},
          {key: ' 百万', value: Math.pow(10, 6)},
          {key: ' 万', value: 10000}
        ];
        break;
    }

    for (let i = 0; i < powers.length; i++) {
        let reduced = abs / powers[i].value;
        reduced = Math.round(reduced * rounder) / rounder;
        if (reduced >= 1) {
            abs = reduced;
            key = powers[i].key;
            break;
        }
    }
    return (isNegative ? '-' : '') + abs + key;
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

  dnChartWidth="100%";
  dnChartHeight=400;
  type="doughnut2d";
  dataFormat="json";
  dataSource=dataSource01;
  dataSource02=dataSource02;

  nullIf0(number){
    if(number==0)
    {
      return null;
    } else {
      return number;
    }
  }

  numberWithCommas(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  
  download(){
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = this.name+'.png';
      this.downloadLink.nativeElement.click();
    });
  }

  updateChartData(){
   // this.dataResult.totalAsset=this.transform(this.dataResult.totalAsset)
    //this.dataResult._Liability=this.transform(this.dataResult._Liability)
    dataSource01.data=[
      {
        label: this.assetLabels[0],
        value: this.nullIf0(this.dataResult._cashAndEquivalent),
        displayValue:this.assetLabels[0] + ': ' + this.transformDisplay(this.dataResult._cashAndEquivalent),
      },
      {
        label: this.assetLabels[1],
        value: this.nullIf0(this.dataResult._realEstate),
        displayValue:this.assetLabels[1] + ': ' + this.transformDisplay(this.dataResult._realEstate),
      },
      {
        label: this.assetLabels[2],
        value: this.nullIf0(this.dataResult._investment),
        displayValue:this.assetLabels[2] + ': ' + this.transformDisplay(this.dataResult._investment),
      },
      {
        label: this.assetLabels[3],
        value: this.nullIf0(this.dataResult._personalAssets),
        displayValue:this.assetLabels[3] + ': ' + this.transformDisplay(this.dataResult._personalAssets),
      }
    ]
    dataSource02.data=[
      {
        label: this.debtLabels[0],
        value: this.nullIf0(this.data.Liability.mortgage),
        displayValue:this.debtLabels[0] + ': ' + this.transformDisplay(this.data.Liability.mortgage),
      },
      {
        label: this.debtLabels[1],
        value: this.nullIf0(this.data.Liability.loan),
        displayValue:this.debtLabels[1] + ': ' + this.transformDisplay(this.data.Liability.loan),
      },
      {
        label: this.debtLabels[2],
        value: this.nullIf0(this.data.Liability.creditCard),
        displayValue:this.debtLabels[2] + ': ' + this.transformDisplay(this.data.Liability.creditCard)
      },
      {
        label: this.debtLabels[3],
        value: this.nullIf0(this.data.Liability.studentLoans),
        displayValue:this.debtLabels[3] + ': ' + this.transformDisplay(this.data.Liability.studentLoans)
      },
      {
        label: this.debtLabels[4],
        value: this.nullIf0(this.data.Liability.otherDebt),
        displayValue:this.debtLabels[4] + ': ' + this.transformDisplay(this.data.Liability.otherDebt),
      }
    ]
  }
  ngOnChanges() {
    this.calNetWorth(this.data)
    this.currentLang=this.translate.currentLang;
    this.updateChartData();
    this.netWorthValue=this.transform(this.dataResult.ans);
    // this.netWorthData =[{
    //   data: this.calAns(this.data.growth.assetRatio,this.data.growth.debtRatio),
    //   label: this.netWorthLabel
    // }]
  }

}