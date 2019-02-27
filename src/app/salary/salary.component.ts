import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  cleaveOptions = {
    numeral:true,
    numeralThousandsGroupStyle: 'thousand'
  }

  GrossNetForm = new FormGroup({
    luong: new FormControl(),
    currencyType: new FormControl(),
    luongBH: new FormControl(),
    phuThuoc: new FormControl(),
    thueBHXH: new FormControl(8),
    thueBHYT: new FormControl(1.5),
    thueBHTN: new FormControl(1),
    giamTruBanThan: new FormControl('9,000,000'),
    giamTruNguoiPhuThuoc: new FormControl('3,600,000'),
    to5: new FormControl(5),
    from5to10: new FormControl(10),
    from10to18: new FormControl(15),
    from18to32: new FormControl(20),
    from32to52: new FormControl(25),
    from52to80: new FormControl(30),
    from80: new FormControl(35),
  })

  // rateUrl = 'https://freasde.currencyconverterapi.com/api/v6/convert?q=USD_VND&compact=ultra&apiKey=d2fc37c867b1086aeefe';
  
  // testing = fetch(this.rateUrl)
  //   .then(response => response.json())
  //   .then(result => this.testing=result)
  //   .catch(() => {this.testing.USD_VND = 23000});

  // exchangeRate = this.testing.USD_VND;

  @Input() disabledUSD=true;

  luongBhTooltip():string{
    return '- Nếu công ty đóng BH ở mức thấp hơn lương thực nhận, thì nhập mức lương chính vào đây \n- Nếu công ty đóng đủ lương bảo hiểm hoặc không biết rõ thì để trống';
  }

  phuThuocTooltip():string{
    return `- Nếu có nuôi con nhỏ, cha mẹ già, bạn có thể đăng ký "người phụ thuộc" để được giảm thuế \n- Quan Trọng: người phụ thuộc phải có đăng ký mã số thuế cá nhân, kể cả con nhỏ`;
  }

  toggleUSD(){
    this.disabledUSD=!this.disabledUSD;
  }

  testing:number=0;
  netgross:boolean = false;

  netgrossfalse(){
    this.netgross=false;
    
  }

  netgrosstrue(){
    this.netgross=true;
    
  }

  

  onFormSubmit(formValues){
    formValues.luong = formValues.luong.replace(/,/g, '')
    formValues.luong = parseFloat(formValues.luong);
    formValues.luongBH = formValues.luongBH.replace(/,/g, '')
    formValues.luongBH = parseFloat(formValues.luongBH);
    this.GrossNetForm.reset();
    if(!this.netgross){
      this.testing =+ 5;
    } else {
      this.testing =+ 3;
    }
  }


  constructor() {
  }

  ngOnInit() {
    
  }

}