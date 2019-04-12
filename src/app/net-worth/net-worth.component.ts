import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss']
})
export class NetWorthComponent implements OnInit {
  cleaveOptions = {
    numeral:true,
    numeralPositiveOnly: true,
    numeralThousandsGroupStyle: 'thousand'
  }
  netWorth: FormGroup;
  cashOnHand: FormControl;
  cashInBank: FormControl;
  house: FormControl;
  otherRealEstate: FormControl;
  stock: FormControl;
  bond: FormControl;
  otherInvestment: FormControl;
  vehicle: FormControl;
  jewelry: FormControl;
  personalProperty: FormControl;
  mortgage: FormControl;
  loan: FormControl;
  creditCard: FormControl;
  studentLoans: FormControl;
  otherDebt: FormControl;
  assetRatio: FormControl;
  debtRatio: FormControl;
  panelOpenState = false;
  showResult:boolean =false;
  selected;

  constructor(public translate:TranslateService) { 
    
  }
  
  createFormControls() {
    this.cashOnHand = new FormControl('100000000');
    this.cashInBank = new FormControl('100000000');
    this.house = new FormControl('100000000');
    this.otherRealEstate = new FormControl('100000000');
    this.stock = new FormControl('100000000');
    this.bond = new FormControl('100000000');
    this.otherInvestment = new FormControl('100000000');
    this.vehicle = new FormControl('100000000');
    this.jewelry = new FormControl('100000000');
    this.personalProperty = new FormControl('100000000');
    this.mortgage = new FormControl('100000000');
    this.loan = new FormControl('100000000');
    this.creditCard = new FormControl('100000000');
    this.studentLoans = new FormControl('100000000');
    this.otherDebt = new FormControl('100000000');
    this.assetRatio = new FormControl('5');
    this.debtRatio = new FormControl('2');
  }


  createForm() {
    this.netWorth = new FormGroup({
      cashAndEquivalent: new FormGroup({
        cashOnHand: this.cashOnHand,
        cashInBank: this.cashInBank
      }),
      realEstate: new FormGroup({
        house: this.house,
        otherRealEstate: this.otherRealEstate
      }),
      investment: new FormGroup({
        stock: this.stock,
        bond: this.bond,
        otherInvestment: this.otherInvestment
      }),
      personalAssets: new FormGroup({
        vehicle: this.vehicle,
        jewelry: this.jewelry,
        personalProperty: this.personalProperty
      }),
      Liability: new FormGroup({
        mortgage: this.mortgage,
        loan: this.loan,
        creditCard: this.creditCard,
        studentLoans: this.studentLoans,
        otherDebt: this.otherDebt
      }),
      growth: new FormGroup({
        assetRatio: this.assetRatio,
        debtRatio: this.debtRatio
      }),
    },);
    
  }

  nextTab(el){
    el.selectedIndex+=1;
  }
  prevTab(el){
    el.selectedIndex-=1;
  }

  getCurrentLang(){
    switch(this.translate.currentLang){
      case 'en':
        this.selected='USD';
        break;
      case 'vi':
        this.selected='VND';
        break;
      case 'jp':
        this.selected='JPY';
        break;
      case 'cn':
        this.selected='CNY';
        break;
    }
  }
 
  ngOnInit() {
    this.getCurrentLang();
    this.translate.onLangChange
      .subscribe((langChangeEvent: LangChangeEvent) => {
        this.getCurrentLang();
      })
    this.createFormControls();
    this.createForm();
  }


}
