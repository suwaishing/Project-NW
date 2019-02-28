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
  ans: number;
  _cashAndEquivalent: number;
  _realEstate: number;
  _investment: number;
  _personalAssets: number;
  _Liability: number;
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
  onSubmit(netWorth) {
    var data = JSON.stringify(netWorth);
    data = JSON.parse(data);
    
    
    /* netWorth.cashAndEquivalent.cashOnHand = netWorth.cashAndEquivalent.cashOnHand.replace(/,/g, '')
    netWorth.cashAndEquivalent.cashInBank = netWorth.cashAndEquivalent.cashInBank.replace(/,/g, '')
    netWorth.cashAndEquivalent.cashOnHand = parseFloat(netWorth.cashAndEquivalent.cashOnHand);
    netWorth.cashAndEquivalent.cashInBank = parseFloat(netWorth.cashAndEquivalent.cashInBank); */
    this._cashAndEquivalent = netWorth.cashAndEquivalent.cashOnHand+ netWorth.cashAndEquivalent.cashInBank;

    /* netWorth.realEstate.house = netWorth.realEstate.house.replace(/,/g, '')
    netWorth.realEstate.otherRealEstate = netWorth.realEstate.otherRealEstate.replace(/,/g, '')
    netWorth.realEstate.house = parseFloat(netWorth.realEstate.house);
    netWorth.realEstate.otherRealEstate = parseFloat(netWorth.realEstate.otherRealEstate); */
    this._realEstate = netWorth.realEstate.house+netWorth.realEstate.otherRealEstate;

    /* netWorth.investment.stock = netWorth.investment.house.replace(/,/g, '')
    netWorth.investment.bond = netWorth.investment.house.replace(/,/g, '')
    netWorth.investment.otherInvestment = netWorth.investment.otherRealEstate.replace(/,/g, '')
    netWorth.investment.stock = parseFloat(netWorth.investment.house);
    netWorth.investment.bond = parseFloat(netWorth.investment.house);
    netWorth.investment.otherInvestment = parseFloat(netWorth.investment.otherRealEstate); */
    this._investment = netWorth.investment.house+netWorth.investment.otherRealEstate;
  }
}
