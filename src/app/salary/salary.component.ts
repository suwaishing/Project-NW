import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
declare var $:any;

let ldata={
  chart: {
    plotToolText:"Year $label: <br>"+"$displayValue",
    numberScaleValue: "1000,1000,1000,1000,1000",
    numberScaleUnit: "K,M,B,T,Q",
    theme: "fusion"
  },
  data: [
    {
      label: "Venezuela",
      value: 10,
      displayValue:"aaa"
    },
    {
      label: "Saudi",
      value: 10,
      displayValue:"aaa"
    }
  ]
};

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.2s')
      ]),
      transition('closed => open', [
        animate('0.2s')
      ]),
    ]),
  ]
})
export class SalaryComponent implements OnInit {
  cleaveOptions = {
    numeral:true,
    numeralPositiveOnly: true,
    numeralThousandsGroupStyle: 'thousand'
  };
  submited:boolean=false;
  luong:any;
  currencyType: any = 'VND';
  conversionRate: any = '23,200';
  luongBH:any;
  radioBaoHiem:string="lc";
  phuThuoc: number;
  inputPhuThuoc:any;
  thueBHXH: number = 8;
  thueBHYT: number = 1.5;
  thueBHTN: number = 1;
  giamTruBanThan: any = '9000000';
  giamTruNguoiPhuThuoc: any = '3,600,000';
  giamTruKhac:any;
  to5: number = 5;
  from5to10: number = 10;
  from10to18: number = 15;
  from18to32: number = 20;
  from32to52: number = 25;
  from52to80: number = 30;
  from80: number = 35;

  InputLuongCoSo: any = '1,390,000';
  vungLuong: number = 1;
  LuonghocNghe: number = 7;
  InputLuongVung1: any = '4,180,000';
  InputLuongVung2: any = '3,710,000';
  InputLuongVung3: any = '3,250,000';
  InputLuongVung4: any = '2,920,000';

  showCurrencyType:boolean=false;
  showHuongDanVung:boolean=false;

  LuongNhap:number;
  LuongKetQua:number;
  LuongNet:number;
  GrossNetBoolean:boolean;

  TienBHXH:number;
  TienBHYT:number;
  TienBHTN:number=0;
  TongBH: number;
  
  ThuNhapChiuThue: number;
  TienGiamTruBanThan:number;
  TienGiamTruNguoiPhuThuoc:number;
  TienGiamTruKhac:number;
  ThuNhapTinhThue: number;

  Tiento5:number=0;
  TienFrom5to10:number=0;
  TienFrom10to18:number=0;
  TienFrom18to32:number=0;
  TienFrom32to52:number=0;
  TienFrom52to80:number=0;
  TienFrom80:number=0;

  TongTNCN: number;
  showSoVungMin:number=0;
  showSoVungMax:number=5;
  showSoVung:number=5;

  AnnualSalary:number;
  Million: string;

  CompanyBHXH:number=17;
  CompanyBHLD:number=0.5;
  CompanyBHTN:number=1;
  CompanyBHYT:number=3;

  ValueCompanyBHXH:number;
  ValueCompanyBHLD:number;
  ValueCompanyBHTN:number;
  ValueCompanyBHYT:number;
  
  @ViewChild("vungKeyWord") nameField: ElementRef;

  showHuongDanVungjq(){
    $('#showHuongDanVungjq').slideToggle(400);
    setTimeout(()=>this.nameField.nativeElement.focus(),600)
  }
  showCurrencyjq(){
    $('#showCurrencyjq').slideToggle(300);
  }
  
  showNextSoVung(){
    this.showSoVungMin+=this.showSoVung;
    this.showSoVungMax+=this.showSoVung;
    if(this.showSoVungMax>this.filteredThongTinVung.length){
      this.showSoVungMax=this.filteredThongTinVung.length;
    }
  }

  checkSoVungMin():boolean{
    if(this.showSoVungMin < this.showSoVung){
      return false;
    } else {
      return true;
    }
  }
  checkSoVungMax(){
    if(this.showSoVungMax < this.filteredThongTinVung.length){
      return true;
    } else  {
      return false;
    }
  }

  showPreviousSoVung(){
    this.showSoVungMin-=this.showSoVung;
    if(this.showSoVungMax == this.filteredThongTinVung.length){
      this.showSoVungMax-=3;
    } else {
      this.showSoVungMax-=this.showSoVung;
    }

  }

  showSoVungChange(){
    this.showSoVungMin=0;
    this.showSoVungMax=this.showSoVung;
  }

  stringtoFloat(value:any):number{
    value = value.toString().replace(/,/g, '');
    let result = parseFloat(value)
    return result;
  }

  tinhBaoHiem(TienDongBHValue){
    this.InputLuongCoSo = this.stringtoFloat(this.InputLuongCoSo);

    this.TienBHXH = TienDongBHValue * this.thueBHXH / 100;
    let ToidaBHXH = (this.InputLuongCoSo * 20) * this.thueBHXH / 100;
    if(this.TienBHXH >= ToidaBHXH){
      this.TienBHXH = ToidaBHXH
    }
    this.TienBHYT = TienDongBHValue * this.thueBHYT / 100;
    let ToidaBHYT = (this.InputLuongCoSo * 20) * this.thueBHYT / 100;
    if(this.TienBHYT >= ToidaBHYT){
      this.TienBHYT = ToidaBHYT
    }
    this.TienBHTN = TienDongBHValue * this.thueBHTN / 100;
    let ToiDaBHTN
    if(this.vungLuong==1){
      this.InputLuongVung1 = this.stringtoFloat(this.InputLuongVung1);
      ToiDaBHTN = (this.InputLuongVung1*20) * this.thueBHTN / 100;
    }
    if(this.vungLuong==2){
      this.InputLuongVung2 = this.stringtoFloat(this.InputLuongVung2);
      ToiDaBHTN = (this.InputLuongVung2*20) * this.thueBHTN / 100;
    }
    if(this.vungLuong==3){
      this.InputLuongVung3 = this.stringtoFloat(this.InputLuongVung3);
      ToiDaBHTN = (this.InputLuongVung3*20) * this.thueBHTN / 100;
    }
    if(this.vungLuong==4){
      this.InputLuongVung4 = this.stringtoFloat(this.InputLuongVung4);
      ToiDaBHTN = (this.InputLuongVung4*20) * this.thueBHTN / 100;
    }
    if(this.TienBHTN >= ToiDaBHTN){
      this.TienBHTN = ToiDaBHTN
    }
    this.TongBH = this.TienBHXH + this.TienBHYT + this.TienBHTN;
  }

  

  tinhBaoHiemNet(TienDongBHValue){
    this.InputLuongCoSo = this.stringtoFloat(this.InputLuongCoSo);
    
    let ToidaBH = (this.InputLuongCoSo * 20);
    let ToidaBHTN;
    if(this.vungLuong==1){
      this.InputLuongVung1 = this.stringtoFloat(this.InputLuongVung1);
      ToidaBHTN = (this.InputLuongVung1*20);
    }
    if(this.vungLuong==2){
      this.InputLuongVung2 = this.stringtoFloat(this.InputLuongVung2);
      ToidaBHTN = (this.InputLuongVung2*20);
    }
    if(this.vungLuong==3){
      this.InputLuongVung3 = this.stringtoFloat(this.InputLuongVung3);
      ToidaBHTN = (this.InputLuongVung3*20);
    }
    if(this.vungLuong==4){
      this.InputLuongVung4 = this.stringtoFloat(this.InputLuongVung4);
      ToidaBHTN = (this.InputLuongVung4*20);
    }

    //MAGIC STUFF
    let TempTienBHXH = TienDongBHValue / (1-((this.thueBHXH+this.thueBHYT+this.thueBHTN)/100));

    if(TempTienBHXH >= ToidaBH && TempTienBHXH < ToidaBHTN)
    {
      this.TienBHXH=ToidaBH*this.thueBHXH/100;
      this.TienBHYT=ToidaBH*this.thueBHYT/100;
      TempTienBHXH = (TienDongBHValue + this.TienBHXH + this.TienBHYT)/(1-(this.thueBHTN/100));
      this.TienBHTN = TempTienBHXH * (this.thueBHTN/100);
    } else if(TempTienBHXH >= ToidaBHTN) {
      this.TienBHXH=ToidaBH*this.thueBHXH/100;
      this.TienBHYT=ToidaBH*this.thueBHYT/100;
      this.TienBHTN=ToidaBHTN*this.thueBHTN/100;
    } else {
      this.TienBHXH = TempTienBHXH * (this.thueBHXH/100);
      this.TienBHYT = TempTienBHXH * (this.thueBHYT/100);
      this.TienBHTN = TempTienBHXH * (this.thueBHTN/100);
    }
    this.TongBH = this.TienBHXH + this.TienBHYT + this.TienBHTN;
  }


  tinhThueTNCN(TTCNValue){
    //Tinh ThuNhapCaNhan
    this.Tiento5 = 0;
    this.TienFrom5to10 = 0;
    this.TienFrom10to18 = 0;
    this.TienFrom18to32 = 0;
    this.TienFrom32to52 = 0;
    this.TienFrom52to80 = 0;
    this.TienFrom80 = 0;

    if (TTCNValue <= 5000000 && TTCNValue > 1) {
      this.Tiento5 = TTCNValue * this.to5 / 100;
    }
    if (TTCNValue <= 10000000 && TTCNValue > 5000000) {
      this.Tiento5 = 250000;
      this.TienFrom5to10 = (TTCNValue - 5000000) * this.from5to10 / 100;
    }
    if (TTCNValue <= 18000000 && TTCNValue > 10000000) {
      this.Tiento5 = 250000;
      this.TienFrom5to10 = 500000;
      this.TienFrom10to18 = (TTCNValue - 10000000) * this.from10to18 / 100;
    }
    if (TTCNValue <= 32000000 && TTCNValue > 18000000) {
      this.Tiento5 = 250000;
      this.TienFrom5to10 = 500000;
      this.TienFrom10to18 = 1200000;
      this.TienFrom18to32 = (TTCNValue - 18000000) * this.from18to32 / 100;
    }
    if (TTCNValue <= 52000000 && TTCNValue > 32000000) {
      this.Tiento5 = 250000;
      this.TienFrom5to10 = 500000;
      this.TienFrom10to18 = 1200000;
      this.TienFrom18to32 = 2800000;
      this.TienFrom32to52 = (TTCNValue - 32000000) * this.from32to52 / 100;
    }
    if (TTCNValue <= 80000000 && TTCNValue > 52000000) {
      this.Tiento5 = 250000;
      this.TienFrom5to10 = 500000;
      this.TienFrom10to18 = 1200000;
      this.TienFrom18to32 = 2800000;
      this.TienFrom32to52 = 5000000;
      this.TienFrom52to80 = (TTCNValue - 52000000) * this.from52to80 / 100;
    }
    if (TTCNValue > 80000000) {
      this.Tiento5 = 250000;
      this.TienFrom5to10 = 500000;
      this.TienFrom10to18 = 1200000;
      this.TienFrom18to32 = 2800000;
      this.TienFrom32to52 = 5000000;
      this.TienFrom52to80 = 8400000;
      this.TienFrom80 = (TTCNValue - 80000000) * this.from80 / 100;
    }
    this.TongTNCN = this.Tiento5 + this.TienFrom5to10 + this.TienFrom10to18 + this.TienFrom18to32
      + this.TienFrom32to52 + this.TienFrom52to80 + this.TienFrom80;
  }

  grosstonet(){
    this.submited=true;
    this.luong = this.stringtoFloat(this.luong);
    this.luongBH = this.stringtoFloat(this.luongBH);
    this.conversionRate = this.stringtoFloat(this.conversionRate);
    this.LuongNhap=this.luong;
    let TienDongBH:number = this.luongBH;
    if(this.currencyType=='USD'){
      this.LuongNhap *= this.conversionRate;
      TienDongBH *= this.conversionRate;
    }
    if(!TienDongBH){
      TienDongBH=this.LuongNhap;
    }

    this.tinhBaoHiem(TienDongBH);

    //Tinh TNTT
    this.ThuNhapChiuThue = this.LuongNhap - this.TongBH;
    this.giamTruBanThan = this.stringtoFloat(this.giamTruBanThan)
    this.TienGiamTruBanThan = this.giamTruBanThan
    this.giamTruNguoiPhuThuoc = this.stringtoFloat(this.giamTruNguoiPhuThuoc)
    this.phuThuoc = this.stringtoFloat(this.inputPhuThuoc);
    if(!this.phuThuoc){this.phuThuoc=0;}
    this.TienGiamTruNguoiPhuThuoc = this.phuThuoc * this.giamTruNguoiPhuThuoc
    this.TienGiamTruKhac = this.stringtoFloat(this.giamTruKhac);
    if(!this.TienGiamTruKhac){this.TienGiamTruKhac=0;}
    this.ThuNhapTinhThue = this.ThuNhapChiuThue - this.giamTruBanThan - this.TienGiamTruNguoiPhuThuoc - this.TienGiamTruKhac;
    if(this.ThuNhapTinhThue < 0){
      this.ThuNhapTinhThue = 0;
    }

    this.tinhThueTNCN(this.ThuNhapTinhThue);
    
    this.LuongKetQua=this.LuongNhap - this.TongBH - this.TongTNCN;
    this.LuongNet=this.LuongKetQua;
    this.GrossNetBoolean=true;
    this.thereismore()
  }

  nettogross(){
    this.submited=true;
    this.luong = this.stringtoFloat(this.luong);
    this.luongBH = this.stringtoFloat(this.luongBH);
    this.conversionRate = this.stringtoFloat(this.conversionRate);
    this.LuongNhap=this.luong;
    let TienDongBH:number = this.luongBH;
    if(this.currencyType=='USD'){
      this.LuongNhap *= this.conversionRate;
      TienDongBH *= this.conversionRate;
    }

    //Tinh TNTT
    this.giamTruBanThan = this.stringtoFloat(this.giamTruBanThan)
    this.TienGiamTruBanThan = this.giamTruBanThan
    this.giamTruNguoiPhuThuoc = this.stringtoFloat(this.giamTruNguoiPhuThuoc)
    this.phuThuoc = this.stringtoFloat(this.inputPhuThuoc);
    if(!this.phuThuoc){this.phuThuoc=0;}
    this.TienGiamTruNguoiPhuThuoc = this.phuThuoc * this.giamTruNguoiPhuThuoc
    this.TienGiamTruKhac = this.stringtoFloat(this.giamTruKhac);
    if(!this.TienGiamTruKhac){this.TienGiamTruKhac=0;}
    let LuongQuyDoi:number;

    LuongQuyDoi = this.LuongNhap - this.giamTruBanThan - this.TienGiamTruNguoiPhuThuoc - this.TienGiamTruKhac;
    if(LuongQuyDoi < 0){
      LuongQuyDoi = 0;
    }

    //Tinh Căn Cứ Quy Đổi
    if(LuongQuyDoi <= 4750000){
      this.ThuNhapTinhThue = LuongQuyDoi / 0.95;
    }
    if(LuongQuyDoi > 4750000 && LuongQuyDoi <= 9250000){
      this.ThuNhapTinhThue = (LuongQuyDoi - 250000) / 0.9;
    }
    if(LuongQuyDoi > 9250000 && LuongQuyDoi <= 16050000){
      this.ThuNhapTinhThue = (LuongQuyDoi - 750000) / 0.85;
    }
    if(LuongQuyDoi > 16050000 && LuongQuyDoi <= 27250000){
      this.ThuNhapTinhThue = (LuongQuyDoi - 1650000) / 0.8;
    }
    if(LuongQuyDoi > 27250000 && LuongQuyDoi <= 42250000){
      this.ThuNhapTinhThue = (LuongQuyDoi - 3250000) / 0.75;
    }
    if(LuongQuyDoi > 42250000 && LuongQuyDoi <= 61850000){
      this.ThuNhapTinhThue = (LuongQuyDoi - 5850000) / 0.7;
    }
    if(LuongQuyDoi > 61850000){
      this.ThuNhapTinhThue = (LuongQuyDoi - 9850000) / 0.65;
    }

    this.tinhThueTNCN(this.ThuNhapTinhThue);
    this.ThuNhapChiuThue = this.LuongNhap + this.TongTNCN;
    this.ThuNhapTinhThue = LuongQuyDoi + this.TongTNCN;

    if(!TienDongBH){
      TienDongBH=this.LuongNhap+this.TongTNCN;
      this.tinhBaoHiemNet(TienDongBH);
    } else {
      this.tinhBaoHiem(TienDongBH);
    }

    this.LuongKetQua=this.LuongNhap + this.TongBH + this.TongTNCN;
    this.LuongNet=this.LuongNhap;
    this.GrossNetBoolean=false;
    this.thereismore()
  }

  /* getCurrentExchangeRate(){
    let rateUrl = 'https://free.currencyconverterapi.com/api/v6/convert?q=USD_VND&compact=ultra&apiKey=d2fc37c867b1086aeefe';
    let testing = fetch(rateUrl)
      .then(response => response.json())
      .then(result => testing=result)
    this.conversionRate = testing.USD_VND;
  } */

  disabledUSD=true;

  luongBhTooltip():string{
    return `- Nếu công ty đóng BH ở mức thấp hơn tổng lương, thì nhập mức lương chính vào đây \n- Liên hệ bộ phận nhân sự để biết rõ mức lương đóng bảo hiểm \n- Để trống nếu không biết rõ`;
  }

  phuThuocTooltip():string{
    return `- Nếu có nuôi con nhỏ, cha mẹ già, bạn có thể đăng ký "người phụ thuộc" để được giảm thuế \n- Quan Trọng: người phụ thuộc phải có đăng ký mã số thuế cá nhân, kể cả con nhỏ`;
  }

  toggleUSD(){
    this.disabledUSD=!this.disabledUSD;
  }

  constructor(private _scrollToService: ScrollToService, 
      public translate: TranslateService) {
    this.filteredThongTinVung=this.DanhSachVung;
    this._Inflation=3.54;
    
    
  }

  ScrollToSideNav(){
    const config: ScrollToConfigOptions = {
      target: 'editThueid',
      duration: 600,
    };
    this._scrollToService.scrollTo(config);
  }

  filteredThongTinVung:any[];

  public _filterKeyWord:string;
  get filterKeyWord(): string{
    return this._filterKeyWord;
  }
  set filterKeyWord(value:string){
    this._filterKeyWord = value;
    this.filteredThongTinVung = this.filterKeyWord ? this.filterVung(this.filterKeyWord) : this.DanhSachVung;
    this.showSoVungMin=0;
    this.showSoVungMax=this.showSoVung;
    if(this.showSoVungMax>this.filteredThongTinVung.length){
      this.showSoVungMax=this.filteredThongTinVung.length
    }
  }

  change_alias(alias):any{
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
  }

  filterVung(filterBy: string):any[] {
    filterBy = this.change_alias(filterBy);
    
    return this.DanhSachVung.filter((vung) => 
      this.change_alias(vung.TinhThanhPho).indexOf(filterBy) !== -1 )
  }

  vung1(){
    this.vungLuong=1;
    $('#showHuongDanVungjq').slideToggle(400);
  }
  vung2(){
    this.vungLuong=2;
    $('#showHuongDanVungjq').slideToggle(400);
  }
  vung3(){
    this.vungLuong=3;
    $('#showHuongDanVungjq').slideToggle(400);
  }
  vung4(){
    this.vungLuong=4;
    $('#showHuongDanVungjq').slideToggle(400);
  }

  // BAR
  
  lwidth = "100%";
  lheight = "100% ";
  ltype = "column2d";
  dataFormat = "json";
  dataSource = ldata;
  CurrentYear:number = new Date().getFullYear();
  currentLang: string;
  /***************************************************************************
   
    - Display y axis suffix in different languages
    - Custom tooltips text when hover chart

  ****************************************************************************/
  transNumScale(){
    let scale={
      value:"1000,1000,1000,1000,1000",
      unit:"K,M,B,T,Q",
      tooltips: "Year $label: <br>"+"$displayValue"
    }
    switch (this.currentLang) {
      case ('vi'):
        scale={
          value:"1000,1000,1000,1000,1000",
          unit:" Nghìn, Triệu, Tỷ, Ngìn Tỷ, Triệu Tỷ",
          tooltips: "Năm $label: <br>"+"$displayValue"
        }
        break;
      case ('jp'):
        scale={
          value:"10000,100,100,10000,10000",
          unit:"万,百万,億,兆,京",
          tooltips: "$label 年: <br>"+"$displayValue"
        }
        break;
      case ('cn'):
        scale={
          value:"10000,100,100,10000,10000",
          unit:"万,百万,亿,兆,京",
          tooltips: "$label 年: <br>"+"$displayValue"
        }
        break; 
      default:
        break;
    }
    return scale
  }
  /***************************************************************************
   
    - Display custom value when hover chart

  ****************************************************************************/
  transformDisplay(number: number): any {
    let abs = number;
    const rounder = Math.pow(10, 2);
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
    return abs + key;
  }

  updateChartData(){
    ldata.chart.numberScaleValue= this.transNumScale().value;
    ldata.chart.numberScaleUnit= this.transNumScale().unit;
    ldata.chart.plotToolText= this.transNumScale().tooltips;
    ldata.data=[
      {
        label: this.CurrentYear.toString(),
        value: Math.round(this.AnnualSalary),
        displayValue: this.transformDisplay(Math.round(this.AnnualSalary))
      },
      {
        label: (this.CurrentYear+1).toString(),
        value: Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,1))),
        displayValue: this.transformDisplay(Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,1))))
      
      },
      {
        label: (this.CurrentYear+2).toString(),
        value: Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,2))),
        displayValue: this.transformDisplay(Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,2))))
      },
      {
        label: (this.CurrentYear+3).toString(),
        value: Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,3))),
        displayValue: this.transformDisplay(Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,3))))
      },
      {
        label: (this.CurrentYear+4).toString(),
        value: Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,4))),
        displayValue: this.transformDisplay(Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,3))))
      }
    ]
  }
  ngOnInit() {
    this.currentLang=this.translate.currentLang
    this.translate.onLangChange
      .subscribe((langChangeEvent: LangChangeEvent) => {
        
        this.currentLang=this.translate.currentLang,
        this.thereismore()
      })
  }

  thereismore(){
    this.AnnualSalary=this.LuongNet*12;
    //this.translate.get(['Million']).subscribe(text=>{this.Million=text.Million})
    this.updateChartData();
    this.Netfor5Year();
  }

  _Inflation:number;
  get Inflation():number{
    return this._Inflation;
  }
  set Inflation(value: number){
    this._Inflation = value;
    this.updateChartData()
    this.Netfor5Year();
  }
/*   calAns(){
    let from1to5 = Array(5).fill(0).map((e,i)=>(i+1))
    let SalaryFrom1to5 = from1to5.map(item=>Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,item-1))/10000)/100);
    return SalaryFrom1to5
  } */

  //Calculate monthly Net salary over 5 years with Inflation's adjustment
  Netfor5YearValuedata: number[]
  Netfor5YearValuelabel: string[]
  
  Netfor5Year(){
    this.Netfor5YearValuedata = this.calAns02(),
    this.Netfor5YearValuelabel = Array(5).fill(0).map((e,i)=>(i+this.CurrentYear).toString())
  }
  
  
  calAns02(){
    let from1to5 = Array(5).fill(0).map((e,i)=>(i+1))
    let SalaryFrom1to5 = from1to5.map(item => Math.round(this.AnnualSalary*(Math.pow(1+(this.Inflation)/100,item-1)))/12);
    return SalaryFrom1to5
  }

  DanhSachVung: any[] = [
    {
      TinhThanhPho: 'Hà Nội',
      Vung: {
        I: `- Các quận: Ba Đình, Bắc Từ Liêm, Cầu Giấy, Đống Đa, Hà Đông, Hai Bà Trưng, Hoàn Kiếm, Hoàng Mai, Long Biên, Nam Từ Liêm, Tây Hồ, Thanh Xuân \n- Các huyện: Gia Lâm, Đông Anh, Sóc Sơn, Thanh Trì, Thường Tín, Hoài Đức, Thạch Thất, Quốc Oai, Thanh Oai, Mê Linh, Chương Mỹ \n- Thị xã Sơn Tây`,
        II: `- Các huyện: Ba Vì, Đan Phượng, Phú Xuyên, Phúc Thọ , Ứng Hòa, Mỹ Đức`,
        III: ``,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Hồ Chí Minh',
      Vung: {
        I: `- Quận 1, Quận 2, Quận 3, Quận 4, Quận 5, Quận 6, Quận 7, Quận 8, Quận 9, Quận 10, Quận 11, Quận 12, Bình Thạnh, Tân Phú, Tân Bình, Bình Tân, Phú Nhuận, Gò Vấp, Thủ Đức\n- Các huyện Củ Chi, Hóc Môn, Bình Chánh, Nhà Bè`,
        II: '- Huyện Cần Giờ',
        III: ``,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Hải Phòng',
      Vung: {
        I: `- Các quận: Dương Kinh, Hồng Bàng, Hải An, Đồ Sơn, Ngô Quyền, Lê Chân, Kiến An \n- Các huyện: Thủy Nguyên, An Dương, An Lão, Vĩnh Bảo, Tiên Lãng, Cát Hải, Kiến Thụy`,
        II: '- Huyện Bạch Long Vĩ',
        III: ``,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Đồng Nai',
      Vung: {
        I: `- Thành phố Biên Hòa \n- Thị xã Long Khánh \n- Các huyện Nhơn Trạch, Long Thành, Vĩnh Cửu, Trảng Bom`,
        II: '- Các huyện Định Quán, Xuân Lộc, Thống Nhất',
        III: ` - Các huyện Cẩm Mỹ, Tân Phú`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Bình Dương',
      Vung: {
        I: `- Thành phố Thủ Dầu Một \n- Các thị xã Thuận An, Dĩ An, Bến Cát, Tân Uyên \n- Các huyện Bàu Bàng, Bắc Tân Uyên, Dầu Tiếng, Phú Giáo.`,
        II: '',
        III: ``,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Bà Rịa - Vũng Tàu',
      Vung: {
        I: `- Thành phố Vũng Tàu \n- Thị xã Phú Mỹ`,
        II: '- Thành phố Bà Rịa',
        III: `- Các huyện Long Điền, Đất Đỏ, Xuyên Mộc, Châu Đức, Côn Đảo`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Hải Dương',
      Vung: {
        I: ``,
        II: '- Thành phố Hải Dương',
        III: `- Thị xã Chí Linh \n- Các huyện Cẩm Giàng, Nam Sách, Kim Thành, Kinh Môn, Gia Lộc, Bình Giang, Tứ Kỳ`,
        IV: `- Các huyện Thanh Hà, Thanh Miện, Ninh Giang`,
      }
    },
    {
      TinhThanhPho: 'Hưng Yên',
      Vung: {
        I: ``,
        II: '- Thành phố Hưng Yên \n- Các huyện Mỹ Hào, Văn Lâm, Văn Giang, Yên Mỹ',
        III: `- Các huyện Ân Thi, Khoái Châu, Kim Động, Phù Cừ, Tiên Lữ`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Vĩnh Phúc',
      Vung: {
        I: ``,
        II: '- Thành phố Vĩnh Yên, Phúc Yên\n- Huyện Bình Xuyên, Yên Lạc',
        III: `- Các huyện Vĩnh Tường, Tam Đảo, Tam Dương, Lập Thạch, Sông Lô`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Bắc Ninh',
      Vung: {
        I: ``,
        II: `- Thành phố Bắc Ninh \n- Thị xã Từ Sơn \n- Các huyện Quế Võ, Tiên Du, Yên Phong, Thuận Thành, Gia Bình, Lương Tài`,
        III: ``,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Quảng Ninh',
      Vung: {
        I: ``,
        II: `- Thành phố Hạ Long, Cẩm Phả, Uông Bí, Móng Cái`,
        III: `- Các thị xã Quảng Yên, Đông Triều\n- Huyện Hoành Bồ`,
        IV: `- Các huyên Vân Đồn, Đầm Hà, Cô Tô, Tiên Yên, Hải Hà, Bình Liêu, Ba Chẽ`,
      }
    },
    {
      TinhThanhPho: 'Thái Nguyên',
      Vung: {
        I: ``,
        II: `- Thành phố Thái Nguyên, Sông Công \n- Thị xã Phổ Yên`,
        III: `- Các huyện Phú Bình, Phú Lương, Đồng Hỷ, Đại Từ`,
        IV: `- Các huyện Định Hóa, Võ Nhai`,
      }
    },
    {
      TinhThanhPho: 'Phú Thọ',
      Vung: {
        I: ``,
        II: `- Thành phố Việt Trì`,
        III: `- Thị xã Phú Thọ \n- Các huyện Phù Ninh, Lâm Thao, Thanh Ba, Tam Nông`,
        IV: `- Các huyện Cẩm Khê, Đoan Hùng, Hạ Hòa, Tân Sơn, Thanh Sơn, Thanh Thủy, Yên Lập`,
      }
    },
    {
      TinhThanhPho: 'Lào Cai',
      Vung: {
        I: ``,
        II: `- Thành phố Lào Cai`,
        III: `- Các huyện Bảo Thắng, Sa pa`,
        IV: `- Các huyện Bảo Yên, Bát Xát, Bắc Hà, Mường Khương, Si Ma Cai, Văn Bàn`,
      }
    },
    {
      TinhThanhPho: 'Nam Định',
      Vung: {
        I: ``,
        II: `- Thành phố Nam Định\n- Huyện Mỹ Lộc`,
        III: `- Các huyện Giao Thủy, Hải Hậu, Nam Trực, Nghĩa Hưng, Trực Ninh, Vụ Bản, Xuân Trường, Ý Yên`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Ninh Bình',
      Vung: {
        I: ``,
        II: `- Thành phố Ninh Bình`,
        III: `- Thành phố Tam Điệp\n- Các huyện Gia Viễn, Yên Khánh, Hoa Lư`,
        IV: `- Các huyện Nho Quan, Kim Sơn, Yên Mô`,
      }
    },
    {
      TinhThanhPho: 'Thừa Thiên Huế',
      Vung: {
        I: ``,
        II: `- Thành phố Huế`,
        III: `- Các thị xã Hương Thủy, Hương Trà\n- Các huyện Phú Lộc, Phong Điền, Quảng Điền, Phú Vang`,
        IV: `- Các huyện A Lưới, Nam Đông`,
      }
    },
    {
      TinhThanhPho: 'Quảng Nam',
      Vung: {
        I: ``,
        II: `- Thành phố Hội An, Tam kỳ`,
        III: `- Thị xã Điện Bàn\n- Các huyện Đại Lộc, Duy Xuyên, Núi Thành, Quế Sơn, Phú Ninh, Thăng Bình`,
        IV: `- Các huyện Bắc Hà My, Nam Trà My, Phước Sơn, Tiên Phước, Hiệp Đức, Nông Sơn, Đông Giang, Nam Giang, Tây Giang.`,
      }
    },
    {
      TinhThanhPho: 'Đà Nẵng',
      Vung: {
        I: ``,
        II: `- Các quận: Hải châu, Sơn Trà, Ngũ Hành Sơn, Thanh Khê, Liên Chiểu, Cẩm Lệ \n- Các huyện: Hòa Vang, huyện đảo Hoàng Sa`,
        III: ``,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Khánh Hòa',
      Vung: {
        I: ``,
        II: `- Thành phố Nha Trang, Cam Ranh`,
        III: `- Thị xã Ninh Hòa \n- Các huyện Cam Lâm, Diên Khánh, Vạn Ninh`,
        IV: `- Các huyện Khánh Vinh, Khánh Sơn, huyện đảo Trường Sa`,
      }
    },
    {
      TinhThanhPho: 'Lâm Đồng',
      Vung: {
        I: ``,
        II: `- Thành phố Đà Lạt, Bảo Lộc`,
        III: `- Các huyện Đức Trọng, Di linh`,
        IV: `- Các huyện Lạc Dương, Đơn Dương, Lâm Hà, Bảo Lâm, Đạ Huoai, Đạ Tẻh, Cát Tiên, Đam Rông`,
      }
    },
    {
      TinhThanhPho: 'Bình Thuận',
      Vung: {
        I: ``,
        II: `- Thành phố Phan Thiết`,
        III: `- Thị xã La Gi \n- Các huyện Hàm Thuận Bắc, Hàm Thuận Nam`,
        IV: `- Các huyện Đức Linh, Tánh Linh, Tuy Phong, Phú Quý, Hàm Tân, Bắc Bình`,
      }
    },
    {
      TinhThanhPho: 'Tây Ninh',
      Vung: {
        I: ``,
        II: `- Thành phố Tây Ninh\n- Các huyện Trảng Bàng, Gò Dầu`,
        III: `- Các huyện Tân Biên, Tân Châu, Dương Minh Châu, Châu Thành, Hòa Thành, Bến Cầu`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Bình Phước',
      Vung: {
        I: ``,
        II: `- Thành phố Đồng Xoài \n- Huyện Chơn Thành`,
        III: `- Các thị xã Phước Long, Bình Long \n- Các huyện Đồng Phú, Hớn Quản, Lộc Ninh, Phú Riềng.`,
        IV: `- Các huyện Bù Đăng, Bù Đốp, Bù Gia Mập`,
      }
    },
    {
      TinhThanhPho: 'Long An',
      Vung: {
        I: ``,
        II: `- Thành phố Tân An \n- Các huyện Đức Hòa, Bến Lức, Thủ Thừa, Cần Đước, Cần Giuộc`,
        III: `- Thị xã Kiến Tường \n- Các huyện Đức Huệ, Châu Thành, Tân Trụ, Thạnh Hóa`,
        IV: `- Các huyện Vĩnh Hưng, Mộc Hóa, Tân Thạnh, Tân Hưng`,
      }
    },
    {
      TinhThanhPho: 'Tiền Giang',
      Vung: {
        I: ``,
        II: `- Thành phố Mỹ Tho \n- Huyện Châu Thành`,
        III: `- Các thị xã Gò Công, Cai Lậy \n- Các huyện Chợ Gạo, Tân Phước`,
        IV: `- Các huyện Cái Bè, Cai Lậy, Gò Công Tây, Gò Công Đông, Tân Phú Đông.`,
      }
    },
    {
      TinhThanhPho: 'Cần Thơ',
      Vung: {
        I: ``,
        II: `- Các quận Ninh Kiều, Bình Thủy, Cái Răng, Ô Môn, Thốt Nốt`,
        III: `- Các huyện Phong Điền, Cờ Đỏ, Thớt Lai, Vĩnh Thạnh`,
        IV: ``,
      }
    },
    {
      TinhThanhPho: 'Kiên Giang',
      Vung: {
        I: ``,
        II: `- Thành phố Rạch Giá \n- Thành phố Hà Tiên \n- Huyện Phú Quốc`,
        III: `- Các huyện Kiên Lương, Kiên Hải, Châu Thành`,
        IV: `- Các huyện An Biên, An Minh, Giồng Riềng, Gò Quao, Hòn Đất, U Minh Thượng, Tân Hiệp, Vĩnh Thuận, Giang Thành`,
      }
    },
    {
      TinhThanhPho: 'An Giang',
      Vung: {
        I: ``,
        II: `- Các thành phố Long Xuyên, Châu Đốc`,
        III: `- Thị xã Tân Châu \n- Các huyện Châu Phú, Châu Thành, Thoại Sơn`,
        IV: `- Các huyện Phú Tân, Tri Tôn, Tịnh Biên, Chợ Mới, An Phú`,
      }
    },
    {
      TinhThanhPho: 'Trà Vinh',
      Vung: {
        I: ``,
        II: `- Thành phố Trà Vinh`,
        III: `- Thị xã Duyên Hải`,
        IV: `- Các huyện Châu Thành, Cầu Ngang, Duyên Hải, Trà Cú, Tiểu Cần, Cầu Kè, Càng Long`,
      }
    },
    {
      TinhThanhPho: 'Cà Mau',
      Vung: {
        I: ``,
        II: `- Thành phố Cà Mau`,
        III: `- Các huyện Năm Căn, Cái Nước, U Minh, Trần Văn Thời`,
        IV: `- Các huyện Đầm Dơi, Ngọc Hiển, Thới Bình, Phú Tân`,
      }
    },
    {
      TinhThanhPho: 'Bắc Giang',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Bắc Giang\n- Các huyện Việt Yên, Yên Dũng, Hiệp Hòa, Tân Yên, Lạng Giang`,
        IV: `- Các huyện Yên Thế, Lục Ngạn, Sơn Động, Lục Nam`,
      }
    },
    {
      TinhThanhPho: 'Hà Nam',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Phủ Lý \n- Huyện Duy Tiên, Kim Bảng`,
        IV: `- Các huyện Lý Nhân, Bình Lục, Thanh Liêm`,
      }
    },
    {
      TinhThanhPho: 'Hòa Bình',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Hòa Bình\n- Huyện Lương Sơn`,
        IV: `- Các huyện Cao Phong, Kỳ Sơn, Kim Bôi, Lạc Sơn, Lạc Thủy, Mai Châu, Tân Lạc, Yên Thủy, Đà Bắc`,
      }
    },
    {
      TinhThanhPho: 'Thanh Hóa',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Thanh Hóa, Sầm Sơn \n- Thị xã Bỉm Sơn và huyện Tĩnh Gia`,
        IV: `- Các huyện Bá Thước, Cẩm Thủy, Đông Sơn, Hà Trung, Hậu Lộc, Hoằng Hóa, Lang Chánh, Mường Lát, Nga Sơn, Ngọc Lặc, Như Thanh, Như Xuân, Nông Cống, Quan Hóa, Quan Sơn, Quảng Xương, Thạch Thành, Thiệu Hóa, Thọ Xuân, Thường Xuân, Triệu Sơn, Vĩnh Lộc, Yên Định`,
      }
    },
    {
      TinhThanhPho: 'Hà Tĩnh',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Hà Tĩnh \n- Thị xã Kỳ Anh`,
        IV: `- Thị xã Hồng Lĩnh \n- Các huyện Cẩm Xuyên, Can Lộc, Đức Thọ, Hương Khê, Hương Sơn, Kỳ Anh, Nghi Xuân, Thạch Hà, Vũ Quang, Lộc Hà`,
      }
    },
    {
      TinhThanhPho: 'Phú Yên',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Tuy Hòa \n- Thị xã Sông Cầu và huyện Đông Hòa`,
        IV: `- Các huyện Phú Hòa, Tuy An, Sông Hinh, Đồng Xuân, Tây Hòa, Sơn Hòa`,
      }
    },
    {
      TinhThanhPho: 'Ninh Thuận',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Phan Rang - Tháp Chàm \n- Huyện Ninh Hải, Thuận Bắc`,
        IV: `- Các huyện Bác Ái, Ninh Phước, Ninh Sơn, Thuận Nam`,
      }
    },
    {
      TinhThanhPho: 'Kon Tum',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành Phố Kom Tum \n- Huyện Đăk Hà`,
        IV: `- Các huyện Đăk Tô, Đăk Glei, Ia H'Drai, Kon Plông, Kon Rẫy, Ngọc Hồi, Sa Thầy, Tu Mơ Rông`,
      }
    },
    {
      TinhThanhPho: 'Bến Tre',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Bến Tre \n- Huyện Châu Thành`,
        IV: `- Các huyện Ba Tri, Bình Đại, Chợ Lách, Giồng Trôm, Mỏ Cày Bắc, Mỏ Cày Nam, Thạnh Phú`,
      }
    },
    {
      TinhThanhPho: 'Vĩnh Long',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Vĩnh Long \n- Thị xã Bình Minh \n- Huyện Long Hồ`,
        IV: `- Các huyện Bình Tân, Mang Thít, Tam Bình, Trà Ôn, Vũng Liêm`,
      }
    },
    {
      TinhThanhPho: 'Hậu Giang',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Vị Thanh \n- Thị xã Ngã Bảy \n- Các huyện Châu Thành, Châu Thành A`,
        IV: `- Thị xã Long Mỹ \n- Các huyện Vị Thủy, Long Mỹ, Phụng Hiệp`,
      }
    },
    {
      TinhThanhPho: 'Bạc Liêu',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành Phố Bạc Liêu \n- Thị xã Giá Rai`,
        IV: `- Các huyện Hồng Dân, Hòa Bình, Phước Long, Vĩnh Lợi, Đông Hải`,
      }
    },
    {
      TinhThanhPho: 'Sóc Trăng',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Sóc Trăng \n- Các thị xã Vĩnh Châu, Ngã Năm`,
        IV: `- Các huyện Mỹ Tú, Long Phú, Thạnh Trị , Mỹ Xuyên , Châu Thành, Trần Đề, Kế Sách, Cù lao Dung`,
      }
    },
    {
      TinhThanhPho: 'Bắc Kạn',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Bắc Kạn`,
        IV: `- Các huyện Pác Nặm, Ba Bể, Ngân Sơn, Bạch Thông, Chợ Đồn, Chợ Mới, Na Rì`,
      }
    },
    {
      TinhThanhPho: 'Cao Bằng',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Cao Bằng`,
        IV: `- Các huyện Trùng Khánh, Hà Quảng, Bảo Lạc, Bảo Lâm, Hạ Lang, Hòa An, Nguyên Bình, Phục Hòa, Thạch An, Trà Lĩnh, Thông Nông, Quảng Uyên`,
      }
    },
    {
      TinhThanhPho: 'Đắk Lắk',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Buôn Mê Thuột`,
        IV: `- Thị xã Buôn Hồ \n- Các huyện Buôn Đôn, Cư Kuin, Cư M'Gar, Ea Kar, Ea Súp, Krông Ana, Ea H'leo, Krông Bông, Krông Búk, Krông Năng, Krông Pắc, Lắk, M'Drắk`,
      }
    },
    {
      TinhThanhPho: 'Đắk Nông',
      Vung: {
        I: ``,
        II: ``,
        III: ``,
        IV: `- Thị xã Gia Nghĩa \n- Các huyện Cư Jút, Đắk Glong, Đắk Mil, Đắk R'lấp, Đắk Song, Krông Nô, Tuy Đức`,
      }
    },
    {
      TinhThanhPho: 'Điện Biên',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Điện Biên Phủ`,
        IV: `- Thị xã Mường Lay \n- Các huyện Điện Biên, Điện Biên Đông, Mường Ảng, Mường Chà, Mường Nhé, Tủa Chùa, Tuần Giáo, Nậm Pồ`,
      }
    },
    {
      TinhThanhPho: 'Đồng Tháp',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Cao Lãnh \n- Thành phố Sa Đéc`,
        IV: `- Thị xã Hồng Ngự \n- Các huyện Cao Lãnh, Châu Thành, Hồng Ngự, Lai Vung, Lấp Vò, Tam Nông, Tân Hồng, Thanh Bình, Tháp Mười.`,
      }
    },
    {
      TinhThanhPho: 'Gia Lai',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Pleiku`,
        IV: `- Thị xã An Khê, thị xã Ayun Pa \n- Các huyện Chư Păh, Chư Prông, Chư Sê, Đắk Đoa, Chư Pưh, Phú Thiện, Mang Yang, Krông Pa, Kông Chro, K'Bang, Ia Pa, Ia Grai, Đức Cơ, Đak Pơ`,
      }
    },
    {
      TinhThanhPho: 'Hà Giang',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Hà Giang`,
        IV: `- Các huyện Bắc Mê, Bắc Quang, Đồng Văn, Hoàng Su Phì, Mèo Vạc, Quản Bạ, Quang Bình, Vị Xuyên, Xín Mần, Yên Minh`,
      }
    },
    {
      TinhThanhPho: 'Lai Châu',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Lai Châu`,
        IV: `- Các huyện Mường Tè, Phong Thổ, Sìn Hồ, Tam Đường, Than Uyên, Tân Uyên, Nậm Nhùn`,
      }
    },
    {
      TinhThanhPho: 'Lạng Sơn',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Lạng Sơn`,
        IV: `- Các huyện Bắc Sơn, Bình Gia, Cao Lộc, Chi Lăng, Đình Lập, Hữu Lũng, Lộc Bình, Tràng Định, Văn Lãng, Văn Quan`,
      }
    },
    {
      TinhThanhPho: 'Quảng Bình',
      Vung: {
        I: ``,
        II: `- Thành phố Đồng Hới`,
        III: `- Thị xã Ba Đồn \n- Các huyện Lệ Thủy, Quảng Ninh, Bố Trạch, Quảng Trạch.`,
        IV: `- Các huyện Minh Hóa, Tuyên Hóa`,
      }
    },
    {
      TinhThanhPho: 'Nghệ An',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Vinh`,
        IV: `- Thị xã Cửa Lò, Thị xã Hoàng Mai, Thị xã Thái Hòa \n- Các huyện Anh Sơn, Con Cuông, Diễn Châu, Đô Lương, Hưng Nguyên, Quỳ Châu, Kỳ Sơn, Nam Đàn, Nghi Lộc, Nghĩa Đàn, Quế Phong, Quỳ Hợp, Quỳnh Lưu, Tân Kỳ, Thanh Chương, Tương Dương, Yên Thành`,
      }
    },
    {
      TinhThanhPho: 'Quảng Trị',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Đông Hà`,
        IV: `- Thị xã Quảng Trị \n- Các huyện Cam Lộ, Cồn Cỏ, Đak Rông, Gio Linh, Hải Lăng, Hướng Hóa, Triệu Phong, Vĩnh Linh`,
      }
    },
    {
      TinhThanhPho: 'Sơn La',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Sơn La`,
        IV: `- Các huyện: Quỳnh Nhai, Mường La, Thuận Châu, Phù Yên, Bắc Yên, Mai Sơn, Sông Mã, Yên Châu, Mộc Châu, Sốp Cộp, Vân Hồ`,
      }
    },
    {
      TinhThanhPho: 'Thái Bình',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Thái Bình`,
        IV: `- Các huyện Đông Hưng, Hưng Hà, Kiến Xương, Quỳnh Phụ, Thái Thụy, Tiền Hải, Vũ Thư`,
      }
    },
    {
      TinhThanhPho: 'Tuyên Quang',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Tuyên Quang`,
        IV: `- Các huyện Chiêm Hóa, Hàm Yên, Lâm Bình, Na Hang, Sơn Dương, Yên Sơn`,
      }
    },
    {
      TinhThanhPho: 'Yên Bái',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Yên Bái`,
        IV: `- Thị xã Nghĩa Lộ \n- Các huyện Lục Yên, Mù Cang Chải, Trạm Tấu, Trấn Yên, Văn Chấn, Văn Yên, Yên Bình`,
      }
    },
    {
      TinhThanhPho: 'Bình Định',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Quy Nhơn`,
        IV: `- Thị xã An Nhơn \n- Các huyện Hoài Nhơn, An Lão, Phù Cát, Phù Mỹ, Tuy Phước, Tây Sơn, Vân Canh, Vĩnh Thạnh, Hoài Ân`,
      }
    },
    {
      TinhThanhPho: 'Quãng Ngãi',
      Vung: {
        I: ``,
        II: ``,
        III: `- Thành phố Quảng Ngãi \n- Các huyện Bình Sơn, Sơn Tịnh`,
        IV: `- Các huyện Ba Tơ, Đức Phổ, Minh Long, Mộ Đức, Lý Sơn, Tư Nghĩa, Trà Bồng, Tây Trà, Sơn Tây, Sơn Hà, Nghĩa Hành`,
      }
    },
  ]

}