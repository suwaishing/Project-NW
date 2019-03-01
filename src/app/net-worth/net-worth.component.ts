import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.css']
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
  
  
  showResult:boolean =false;
  constructor(private router: Router) { }

  createFormControls() {
    this.cashOnHand = new FormControl('');
    this.cashInBank = new FormControl('');
    this.house = new FormControl('');
    this.otherRealEstate = new FormControl('');
    this.stock = new FormControl('');
    this.bond = new FormControl('');
    this.otherInvestment = new FormControl('');
    this.vehicle = new FormControl('');
    this.jewelry = new FormControl('');
    this.personalProperty = new FormControl('');
    this.mortgage = new FormControl('');
    this.loan = new FormControl('');
    this.creditCard = new FormControl('');
    this.studentLoans = new FormControl('');
    this.otherDebt = new FormControl('');
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
      })
    });
  }
 
  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  stringToFloat(arg): number {
    arg = arg.toString().replace(/,/g, '')
    let result = parseFloat(arg)
    if (isNaN(result)) {
      result = 0
    }
    return result
  }

  logKeyValuePairs(groupValue){
    /* Object.keys(group.controls).forEach((key:any) => {
      const abstractControl = group.get(key);
      
      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractControl)
        
      } else{
        let numVal= this.stringToFloat(abstractControl.value)
        if (isNaN(numVal)) {
          numVal = 0
        }
        this.formData.push(numVal)
      }
    }); */
  }
  calNetWorth(netWorth) {
    netWorth.cashAndEquivalent.cashOnHand = this.stringToFloat(netWorth.cashAndEquivalent.cashOnHand)
    netWorth.cashAndEquivalent.cashInBank = this.stringToFloat(netWorth.cashAndEquivalent.cashInBank)
    

    netWorth.realEstate.house = this.stringToFloat(netWorth.realEstate.house)
    netWorth.realEstate.otherRealEstate = this.stringToFloat(netWorth.realEstate.otherRealEstate)
    
    netWorth.investment.stock = this.stringToFloat(netWorth.investment.stock)
    netWorth.investment.bond = this.stringToFloat(netWorth.investment.bond)
    netWorth.investment.otherInvestment = this.stringToFloat(netWorth.investment.otherInvestment)
    
    netWorth.personalAssets.vehicle = this.stringToFloat(netWorth.personalAssets.vehicle)
    netWorth.personalAssets.jewelry = this.stringToFloat(netWorth.personalAssets.jewelry)
    netWorth.personalAssets.personalProperty = this.stringToFloat(netWorth.personalAssets.personalProperty)
    
    netWorth.Liability.mortgage = this.stringToFloat(netWorth.Liability.mortgage)
    netWorth.Liability.loan = this.stringToFloat(netWorth.Liability.loan)
    netWorth.Liability.creditCard = this.stringToFloat(netWorth.Liability.creditCard)
    netWorth.Liability.studentLoans = this.stringToFloat(netWorth.Liability.studentLoans)
    netWorth.Liability.otherDebt = this.stringToFloat(netWorth.Liability.otherDebt)

  }
  onSubmit(netWorth) {
    this.showResult = true;
    this.calNetWorth(netWorth)
  }
}
